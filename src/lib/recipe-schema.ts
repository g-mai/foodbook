import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const filterLabel = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message: 'Use lowercase labels such as italian, greek, or main-course.',
});

export const ingredientSchema = z
  .strictObject({
    name: text,
    quantity: z.union([z.number().positive(), text]).optional(),
    unit: text.optional(),
    notes: text.optional(),
  })
  .refine(
    ({ quantity, unit }) => unit === undefined || quantity !== undefined,
    {
      message: 'An ingredient with a unit must also have a quantity.',
      path: ['quantity'],
    },
  );

/** Accept Astro's image helper so local images receive build-time validation. */
export function createRecipeSchema<T extends z.ZodType>(imageSchema: T) {
  return z.strictObject({
    title: text,
    source: text.optional(),
    addedAt: z.iso.datetime(),
    language: z.literal('en'),
    measurementSystem: z.literal('metric'),
    servings: z.number().positive().optional(),
    prepMinutes: z.number().nonnegative().optional(),
    cookMinutes: z.number().nonnegative().optional(),
    categories: z.array(filterLabel).default([]),
    tags: z.array(filterLabel).default([]),
    image: imageSchema,
    imageAlt: text,
    ingredients: z.array(ingredientSchema).min(1),
  });
}
