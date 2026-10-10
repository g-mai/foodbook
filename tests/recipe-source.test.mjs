import assert from 'node:assert/strict';
import test from 'node:test';
import { getSourceHref } from '../src/lib/recipe-source.ts';

test('HTTP(S) sources become links without changing their values', () => {
  for (const source of [
    'https://example.com/recipe/?id=42&utm_source=magazine#steps',
    'http://example.com/recipe',
  ]) {
    assert.equal(getSourceHref(source), source);
  }
});

test('printed references, missing sources, and non-web URLs do not become links', () => {
  for (const source of [
    undefined,
    '',
    'Delicious magazine, October 2026, page 42',
    'Magazine reference: https://example.com',
    'javascript:alert(1)',
    'data:text/html,<h1>Recipe</h1>',
    'file:///recipe',
    '//example.com/recipe',
  ]) {
    assert.equal(getSourceHref(source), undefined);
  }
});
