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
    sourceUrl: z.url({ protocol: /^https?$/ }),
    addedAt: z.iso.datetime(),
    language: text.refine(
      (value) => {
        try {
          return Intl.getCanonicalLocales(value).length === 1;
        } catch {
          return false;
        }
      },
      { message: 'Use a BCP 47 language tag such as en or it-IT.' },
    ),
    measurementSystem: z.enum(['metric', 'imperial']),
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
