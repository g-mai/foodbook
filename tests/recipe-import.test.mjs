import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { normalizeSourceUrl } from '../.agents/skills/recipe-import/scripts/normalize-source-url.mjs';

test('source URL normalization removes tracking, fragments, and trailing slashes', () => {
  assert.equal(
    normalizeSourceUrl(
      ' https://EXAMPLE.com:443/pasta/?utm_source=chat&UTM_medium=app&fbclid=tracking#instructions ',
    ),
    'https://example.com/pasta',
  );
  assert.equal(
    normalizeSourceUrl('https://example.com/?gclid=123'),
    'https://example.com/',
  );
});

test('recipe identity parameters survive normalization and compare regardless of order', () => {
  const expected = 'https://example.com/recipe?id=42&ref=cookbook&servings=2';
  assert.equal(
    normalizeSourceUrl(
      'https://example.com/recipe/?servings=2&id=42&ref=cookbook&mc_cid=123',
    ),
    expected,
  );
  assert.equal(normalizeSourceUrl(expected), expected);
  assert.notEqual(
    normalizeSourceUrl('https://example.com/?p=42'),
    normalizeSourceUrl('https://example.com/?p=43'),
  );
  assert.notEqual(
    normalizeSourceUrl('http://example.com/pasta'),
    normalizeSourceUrl('https://example.com/pasta'),
  );
});

test('invalid URLs, non-web schemes, and embedded credentials are rejected', () => {
  for (const source of [
    'not a URL',
    'file:///recipe',
    'https://token:secret@example.com/pasta',
  ]) {
    assert.throws(() => normalizeSourceUrl(source));
  }
});

test('the portable URL normalizer runs as a standalone CLI', () => {
  const script = fileURLToPath(
    new URL(
      '../.agents/skills/recipe-import/scripts/normalize-source-url.mjs',
      import.meta.url,
    ),
  );
  const result = spawnSync(
    process.execPath,
    [script, 'https://example.com/pasta/?utm_source=phone'],
    {
      encoding: 'utf8',
    },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), 'https://example.com/pasta');
});
