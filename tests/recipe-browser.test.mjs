import assert from 'node:assert/strict';
import test from 'node:test';
import {
  filterAndSortRecipes,
  formatRecipeLabel,
  getRecipeCategories,
  getRandomRecipeIndex,
  normalizeSearchText,
} from '../src/lib/recipe-browser.ts';

test('random suggestions can start on any recipe and never immediately repeat', () => {
  assert.equal(getRandomRecipeIndex(0), 0);
  assert.equal(getRandomRecipeIndex(1, 0), 0);

  for (const count of [2, 3, 25]) {
    const samples = Array.from({ length: count }, (_, i) => (i + 0.5) / count);
    assert.deepEqual(
      samples.map((sample) => getRandomRecipeIndex(count, undefined, sample)),
      Array.from({ length: count }, (_, i) => i),
    );

    for (let previous = 0; previous < count; previous++) {
      const picks = Array.from({ length: count - 1 }, (_, i) =>
        getRandomRecipeIndex(count, previous, (i + 0.5) / (count - 1)),
      );
      assert.equal(new Set(picks).size, count - 1);
      assert.ok(
        picks.every((pick) => pick !== previous && pick >= 0 && pick < count),
      );
      assert.notEqual(getRandomRecipeIndex(count, previous, 0), previous);
      assert.notEqual(
        getRandomRecipeIndex(count, previous, 0.999999),
        previous,
      );
    }
  }
});

const recipes = [
  {
    id: 'pollo',
    title: 'Pollo alla Cacciatora',
    addedAt: '2026-10-05T12:00:00Z',
    language: 'en',
    categories: ['italian'],
    tags: ['main-course', 'chicken'],
    ingredients: ['black olives', 'chicken thighs'],
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 4,
    image: { src: '/pollo.webp', width: 720, height: 540, alt: 'Chicken' },
  },
  {
    id: 'apple-tart',
    title: 'Apple Tart',
    addedAt: '2025-02-10T10:00:00Z',
    language: 'en',
    categories: ['french'],
    tags: ['dessert'],
    ingredients: ['apples', 'cinnamon'],
    prepMinutes: null,
    cookMinutes: 30,
    servings: null,
    image: { src: '/tart.webp', width: 720, height: 540, alt: 'Apple tart' },
  },
  {
    id: 'zucchini',
    title: 'Zucchini Gratin',
    addedAt: '2026-10-05T12:00:00Z',
    language: 'en',
    categories: ['french'],
    tags: ['vegetarian'],
    ingredients: ['zucchini', 'cheese'],
    prepMinutes: 10,
    cookMinutes: 20,
    servings: 2,
    image: { src: '/gratin.webp', width: 720, height: 540, alt: 'Gratin' },
  },
];

test('search normalization ignores case, accents, hyphens, and repeated spaces', () => {
  assert.equal(normalizeSearchText('  CRÈME--Brûlée  '), 'creme brulee');
  assert.deepEqual(
    filterAndSortRecipes(recipes, 'black   OLIVES', 'all', 'newest').map(
      ({ id }) => id,
    ),
    ['pollo'],
  );
  assert.deepEqual(
    filterAndSortRecipes(recipes, 'main course', 'all', 'newest').map(
      ({ id }) => id,
    ),
    ['pollo'],
  );
});

test('search combines title, ingredient, category, and tag matches', () => {
  assert.deepEqual(
    filterAndSortRecipes(recipes, 'chicken italian', 'all', 'newest').map(
      ({ id }) => id,
    ),
    ['pollo'],
  );
  assert.deepEqual(
    filterAndSortRecipes(recipes, 'cinnamon', 'all', 'newest').map(
      ({ id }) => id,
    ),
    ['apple-tart'],
  );
});

test('categories are unique and alphabetized, with readable labels', () => {
  assert.deepEqual(getRecipeCategories(recipes), ['french', 'italian']);
  assert.equal(formatRecipeLabel('main-course'), 'Main Course');
});

test('category and search filters combine', () => {
  assert.deepEqual(
    filterAndSortRecipes(recipes, 'zucchini', 'french', 'newest').map(
      ({ id }) => id,
    ),
    ['zucchini'],
  );
  assert.deepEqual(
    filterAndSortRecipes(recipes, '', 'italian', 'newest').map(({ id }) => id),
    ['pollo'],
  );
});

test('sorting supports dates, alphabetical order, and deterministic ties', () => {
  assert.deepEqual(
    filterAndSortRecipes(recipes, '', 'all', 'newest').map(({ id }) => id),
    ['pollo', 'zucchini', 'apple-tart'],
  );
  assert.deepEqual(
    filterAndSortRecipes(recipes, '', 'all', 'oldest').map(({ id }) => id),
    ['apple-tart', 'pollo', 'zucchini'],
  );
  assert.deepEqual(
    filterAndSortRecipes(recipes, '', 'all', 'title-asc').map(({ id }) => id),
    ['apple-tart', 'pollo', 'zucchini'],
  );
  assert.deepEqual(
    filterAndSortRecipes(recipes, '', 'all', 'title-desc').map(({ id }) => id),
    ['zucchini', 'pollo', 'apple-tart'],
  );
});
