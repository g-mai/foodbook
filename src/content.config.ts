import { basename } from 'node:path';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { createRecipeSchema } from './lib/recipe-schema';
import { foodbook } from './lib/foodbook';

const recipes = defineCollection({
  loader: glob({
    base: '.',
    pattern: foodbook.includeDefaultRecipes
      ? ['src/content/recipes/*.md', 'examples/default-recipes/*.md']
      : ['src/content/recipes/*.md'],
    generateId: ({ entry }) => basename(entry, '.md'),
  }),
  schema: ({ image }) => createRecipeSchema(image()),
});

export const collections = { recipes };
