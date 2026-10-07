import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function loadComponent(path, resolve = require) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
  });
  const exports = {};
  runInNewContext(outputText, { exports, require: resolve });
  return exports;
}
const button = loadComponent('../src/components/ui/button.tsx');
const { RecipeSuggestion } = loadComponent(
  '../src/components/recipe-suggestion.tsx',
  (name) => {
    if (name === '@/components/ui/button') return button;
    if (name === '@/lib/recipe-browser')
      return require('../src/lib/recipe-browser.ts');
    return require(name);
  },
);

test('before effects run, the suggestion stays hidden', () => {
  // Together, the SSR marker and its hiding rule prevent recipe 0 being painted.
  const styles = readFileSync(
    new URL('../src/styles/global.css', import.meta.url),
    'utf8',
  );
  assert.match(
    styles,
    /\.suggestion-print\[data-pending='true'\]\s*\{\s*visibility: hidden;/,
  );
  const page = readFileSync(
    new URL('../src/pages/index.astro', import.meta.url),
    'utf8',
  );
  assert.match(
    page,
    /<noscript>[\s\S]*?\.suggestion-print\[data-pending='true'\]\s*\{\s*visibility: visible;/,
  );
});

test('an empty suggestion collection renders nothing', () => {
  assert.equal(
    renderToStaticMarkup(createElement(RecipeSuggestion, { recipes: [] })),
    '',
  );
});
