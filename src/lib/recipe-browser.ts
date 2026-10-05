export interface BrowserRecipe {
  id: string;
  title: string;
  addedAt: string;
  language: string;
  categories: string[];
  tags: string[];
  ingredients: string[];
  prepMinutes: number | null;
  cookMinutes: number | null;
  servings: number | null;
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
}

export type RecipeSort = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

export function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('-', ' ')
    .toLocaleLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

export function formatRecipeLabel(value: string) {
  return value
    .replaceAll('-', ' ')
    .replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase());
}

export function getRecipeCategories(recipes: BrowserRecipe[]) {
  return [...new Set(recipes.flatMap(({ categories }) => categories))].sort(
    (a, b) => a.localeCompare(b),
  );
}

export function filterAndSortRecipes(
  recipes: BrowserRecipe[],
  query: string,
  category: string,
  sort: RecipeSort,
) {
  const searchTerms = normalizeSearchText(query).split(' ').filter(Boolean);
  const collator = new Intl.Collator(undefined, {
    sensitivity: 'base',
    numeric: true,
  });

  return recipes
    .filter((recipe) => {
      if (category !== 'all' && !recipe.categories.includes(category)) {
        return false;
      }

      if (searchTerms.length === 0) return true;

      const searchableText = normalizeSearchText(
        [
          recipe.title,
          ...recipe.categories,
          ...recipe.tags,
          ...recipe.ingredients,
        ].join(' '),
      );
      return searchTerms.every((term) => searchableText.includes(term));
    })
    .sort((a, b) => {
      if (sort === 'title-asc' || sort === 'title-desc') {
        const direction = sort === 'title-asc' ? 1 : -1;
        return (
          direction *
          (collator.compare(a.title, b.title) || a.id.localeCompare(b.id))
        );
      }

      const direction = sort === 'newest' ? -1 : 1;
      return (
        direction * (Date.parse(a.addedAt) - Date.parse(b.addedAt)) ||
        collator.compare(a.title, b.title) ||
        a.id.localeCompare(b.id)
      );
    });
}

export function parseRecipeSort(value: string | null): RecipeSort {
  if (value === 'oldest' || value === 'title-asc' || value === 'title-desc') {
    return value;
  }
  return 'newest';
}
