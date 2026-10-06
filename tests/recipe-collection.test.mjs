import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

test('the recipes folder loads every recipe and reflects additions and removals', () => {
  const workspace = fileURLToPath(new URL('../', import.meta.url));
  const root = mkdtempSync(join(tmpdir(), 'foodbook-collection-'));
  try {
    for (const directory of ['src/lib', 'src/pages']) {
      mkdirSync(join(root, directory), { recursive: true });
    }
    symlinkSync(
      join(workspace, 'node_modules'),
      join(root, 'node_modules'),
      'junction',
    );
    writeFileSync(join(root, 'package.json'), '{"type":"module"}');
    writeFileSync(
      join(root, 'astro.config.mjs'),
      'export default { output: "static" };',
    );
    for (const file of ['src/content.config.ts', 'src/lib/recipe-schema.ts']) {
      cpSync(join(workspace, file), join(root, file));
    }
    cpSync(join(workspace, 'recipes'), join(root, 'recipes'), {
      recursive: true,
    });
    const recipeFiles = readdirSync(join(root, 'recipes'))
      .filter((file) => file.endsWith('.md'))
      .sort();
    assert.ok(recipeFiles.length > 0, 'Expected saved recipes');
    const recipe = readFileSync(join(root, 'recipes', recipeFiles[0]), 'utf8');
    writeFileSync(
      join(root, 'src/pages/index.astro'),
      `---
import { getCollection } from 'astro:content';
const ids = (await getCollection('recipes')).map(({ id }) => id).sort();
---
<p id="recipe-ids">{ids.join(',')}</p>`,
    );
    const cli = fileURLToPath(
      new URL('bin/astro.mjs', import.meta.resolve('astro/package.json')),
    );
    function buildIds() {
      const result = spawnSync(process.execPath, [cli, 'build'], {
        cwd: root,
        encoding: 'utf8',
        timeout: 60_000,
      });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      const html = readFileSync(join(root, 'dist/index.html'), 'utf8');
      const match = html.match(/<p id="recipe-ids">([^<]*)<\/p>/);
      assert.ok(match, 'Expected rendered recipe IDs');
      return match[1] ? match[1].split(',') : [];
    }
    const recipeIds = recipeFiles.map((file) => basename(file, '.md'));
    assert.deepEqual(buildIds(), recipeIds);
    writeFileSync(join(root, 'recipes/test-added-recipe.md'), recipe);
    assert.deepEqual(buildIds(), [...recipeIds, 'test-added-recipe'].sort());
    rmSync(join(root, 'recipes/test-added-recipe.md'));
    assert.deepEqual(buildIds(), recipeIds);
    for (const file of recipeFiles) rmSync(join(root, 'recipes', file));
    assert.deepEqual(buildIds(), []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
