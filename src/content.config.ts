import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { createRecipeSchema } from './lib/recipe-schema';

const recipes = defineCollection({
  loader: glob({
    base: './recipes',
    pattern: '*.md',
  }),
  schema: ({ image }) => createRecipeSchema(image()),
});

export const collections = { recipes };
