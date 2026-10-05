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
import { foodbookDefaults } from '../src/lib/foodbook-defaults.ts';

test('starter preference defaults to enabled', () => {
  assert.equal(foodbookDefaults.includeDefaultRecipes, true);
});

test('personal overrides exclude starters, including new upstream additions', () => {
  // Build an isolated content-only cookbook; never change personal project files.
  const workspace = fileURLToPath(new URL('../', import.meta.url));
  const root = mkdtempSync(join(tmpdir(), 'foodbook-collection-'));
  try {
    for (const directory of ['src/lib', 'src/content/recipes', 'src/pages']) {
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
    writeFileSync(join(root, 'foodbook.config.ts'), 'export default {};');
    for (const file of [
      'src/content.config.ts',
      'src/lib/recipe-schema.ts',
      'src/lib/foodbook.ts',
      'src/lib/foodbook-defaults.ts',
    ]) {
      cpSync(join(workspace, file), join(root, file));
    }
    cpSync(join(workspace, 'examples'), join(root, 'examples'), {
      recursive: true,
    });
    const starters = readdirSync(join(root, 'examples/default-recipes'))
      .filter((file) => file.endsWith('.md'))
      .sort();
    assert.ok(
      starters.length > 0,
      'Expected at least one shared example recipe',
    );
    const starter = readFileSync(
      join(root, 'examples/default-recipes', starters[0]),
      'utf8',
    );
    writeFileSync(
      join(root, 'src/content/recipes/personal-recipe.md'),
      starter.replace('image: ../images/', 'image: ../../../examples/images/'),
    );
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
      return match[1].split(',').filter(Boolean);
    }
    const starterIds = starters.map((file) => basename(file, '.md'));
    assert.deepEqual(buildIds(), [...starterIds, 'personal-recipe'].sort());
    writeFileSync(
      join(root, 'foodbook.config.ts'),
      'export default { includeDefaultRecipes: false };',
    );
    assert.deepEqual(buildIds(), ['personal-recipe']);
    writeFileSync(
      join(root, 'examples/default-recipes/future-starter.md'),
      starter,
    );
    assert.deepEqual(buildIds(), ['personal-recipe']);
    writeFileSync(
      join(root, 'foodbook.config.ts'),
      'export default { includeDefaultRecipes: true };',
    );
    assert.deepEqual(
      buildIds(),
      [...starterIds, 'future-starter', 'personal-recipe'].sort(),
    );
    writeFileSync(
      join(root, 'foodbook.config.ts'),
      'export default { includeDefaultRecipes: false };',
    );
    rmSync(join(root, 'src/content/recipes/personal-recipe.md'));
    assert.deepEqual(buildIds(), []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
