import assert from 'node:assert/strict';
import test from 'node:test';
import { z } from 'astro/zod';
import {
  createRecipeSchema,
  ingredientSchema,
} from '../src/lib/recipe-schema.ts';
import { foodbookDefaults } from '../src/lib/foodbook-defaults.ts';

// Astro validates image files separately; unit tests use a path-string schema.
const schema = createRecipeSchema(z.string().min(1));
const recipe = {
  title: 'Chicken Cacciatore',
  sourceUrl:
    'https://blog.giallozafferano.it/maniamore/pollo-alla-cacciatora-ricetta/',
  addedAt: '2026-10-05T12:00:00Z',
  language: foodbookDefaults.language,
  measurementSystem: foodbookDefaults.measurementSystem,
  image: '../../assets/recipes/pollo-alla-cacciatora.jpg',
  imageAlt: 'Chicken pieces in tomato sauce with black olives',
  ingredients: [{ name: 'chicken thighs', quantity: 1, unit: 'kg' }],
};

test('minimal recipes retain explicit language, units, and date', () => {
  const result = schema.parse(recipe);
  assert.equal(result.language, 'en');
  assert.equal(result.measurementSystem, 'metric');
  assert.equal(result.addedAt, recipe.addedAt);
  assert.deepEqual(result.categories, []);
  assert.deepEqual(result.tags, []);
  assert.equal(result.servings, undefined);
});

test('cuisine categories and other tags are independent', () => {
  const result = schema.parse({
    ...recipe,
    categories: ['italian', 'greek'],
    tags: ['main-course', 'chicken'],
  });
  assert.deepEqual(result.categories, ['italian', 'greek']);
  assert.deepEqual(result.tags, ['main-course', 'chicken']);
  assert.equal(
    schema.safeParse({ ...recipe, categories: ['Italian'] }).success,
    false,
  );
});

test('ingredients support fractions, ranges, counts, and unspecified amounts', () => {
  for (const ingredient of [
    { name: 'salt', quantity: 0.5, unit: 'tsp', notes: 'optional' },
    { name: 'water', quantity: '100-150', unit: 'ml' },
    { name: 'carrot', quantity: 1 },
    { name: 'pepper', quantity: 'to taste' },
    { name: 'fresh herbs' },
  ]) {
    assert.deepEqual(ingredientSchema.parse(ingredient), ingredient);
  }
  for (const ingredient of [
    { name: '' },
    { name: 'salt', quantity: 0 },
    { name: 'salt', quantity: -1 },
    { name: 'salt', quantity: '' },
    { name: 'salt', quantity: null },
    { name: 'salt', unit: 'g' },
  ]) {
    assert.equal(ingredientSchema.safeParse(ingredient).success, false);
  }
});

test('required fields cannot be omitted or inferred from current preferences', () => {
  for (const key of Object.keys(recipe)) {
    const invalid = { ...recipe };
    delete invalid[key];
    assert.equal(schema.safeParse(invalid).success, false, key);
  }
});

test('invalid metadata and unnecessary fields are rejected', () => {
  for (const invalid of [
    { title: ' ' },
    { sourceUrl: 'not-a-url' },
    { sourceUrl: 'javascript:alert(1)' },
    { addedAt: '2026-02-30T12:00:00Z' },
    { addedAt: '2026-10-05' },
    { language: 'en_US' },
    { measurementSystem: 'unknown' },
    { servings: 0 },
    { prepMinutes: -1 },
    { cookMinutes: -1 },
    { imageAlt: ' ' },
    { ingredients: [] },
    { sourceName: 'Example Kitchen' },
    { originalLanguage: 'it' },
    { slug: 'duplicate-metadata' },
  ]) {
    assert.equal(schema.safeParse({ ...recipe, ...invalid }).success, false);
  }
});

test('localized and imperial recipes do not depend on cookbook defaults', () => {
  const result = schema.parse({
    ...recipe,
    language: 'it-IT',
    measurementSystem: 'imperial',
    prepMinutes: 0,
    cookMinutes: 0,
  });
  assert.equal(result.language, 'it-IT');
  assert.equal(result.measurementSystem, 'imperial');
});

test('timestamps support newest-added sorting, including fractional seconds', () => {
  const older = schema.parse(recipe);
  const newer = schema.parse({
    ...recipe,
    addedAt: '2026-10-05T12:00:00.100Z',
  });
  const sorted = [older, newer].sort(
    (a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt),
  );
  assert.equal(sorted[0], newer);
});
