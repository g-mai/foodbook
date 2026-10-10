import assert from 'node:assert/strict';
import test from 'node:test';
import { isRecipeOnlyChange } from '../.github/scripts/recipe-files.mjs';

const recipe = { filename: 'recipes/pasta.md', status: 'added' };

test('recipe additions and updates with supported photos use recipe validation', () => {
  for (const status of ['added', 'modified']) {
    for (const extension of ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif']) {
      const files = [
        { ...recipe, status },
        { filename: `recipes/images/pasta.${extension}`, status },
      ];
      assert.equal(isRecipeOnlyChange(files, files.length), true);
    }
  }
  assert.equal(isRecipeOnlyChange([recipe], 1), true);
});

test('mixed changes, deletions, renames, and unsupported paths use full validation', () => {
  for (const file of [
    { filename: 'src/lib/recipe-schema.ts', status: 'modified' },
    { filename: '.github/workflows/validate.yml', status: 'modified' },
    { filename: 'recipes/pasta.md', status: 'removed' },
    { filename: 'recipes/pasta.md', status: 'renamed' },
    { filename: 'recipes/nested/pasta.md', status: 'added' },
    { filename: 'recipes/images/pasta.svg', status: 'added' },
    { filename: 'recipes/Pasta.md', status: 'added' },
  ]) {
    assert.equal(isRecipeOnlyChange([recipe, file], 2), false);
  }
});

test('empty, image-only, and incomplete diffs use full validation', () => {
  assert.equal(isRecipeOnlyChange([], 0), false);
  assert.equal(
    isRecipeOnlyChange(
      [{ filename: 'recipes/images/pasta.jpg', status: 'added' }],
      1,
    ),
    false,
  );
  assert.equal(isRecipeOnlyChange([recipe], 2), false);
});
