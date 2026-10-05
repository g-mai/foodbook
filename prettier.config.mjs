/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  singleQuote: true,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.{js,mjs,cjs,jsx,ts,tsx,css}',
      options: {
        plugins: ['prettier-plugin-tailwindcss'],
        tailwindStylesheet: './src/styles/global.css',
        tailwindFunctions: ['cn', 'cva'],
      },
    },
    {
      files: '*.astro',
      // The Tailwind sorter does not yet support the Astro 7 formatter's AST.
      // Keep the Astro-aware formatter rather than downgrading its parser.
      options: { parser: 'astro' },
    },
  ],
};
