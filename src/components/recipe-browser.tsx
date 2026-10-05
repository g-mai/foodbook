import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RecipeCard } from '@/components/recipe-card';
import {
  filterAndSortRecipes,
  formatRecipeLabel,
  getRecipeCategories,
  parseRecipeSort,
  type BrowserRecipe,
  type RecipeSort,
} from '@/lib/recipe-browser';

const PAGE_SIZE = 24;

interface RecipeBrowserProps {
  recipes: BrowserRecipe[];
}

function readLocation(categories: string[]) {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category') ?? 'all';
  return {
    query: params.get('q') ?? '',
    category:
      category === 'all' || categories.includes(category) ? category : 'all',
    sort: parseRecipeSort(params.get('sort')),
  };
}

function writeLocation(next: {
  query: string;
  category: string;
  sort: RecipeSort;
}) {
  const params = new URLSearchParams();
  if (next.query.trim()) params.set('q', next.query.trim());
  if (next.category !== 'all') params.set('category', next.category);
  if (next.sort !== 'newest') params.set('sort', next.sort);
  const search = params.toString();
  const nextUrl = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
  window.history.replaceState(null, '', nextUrl);
}

export function RecipeBrowser({ recipes }: RecipeBrowserProps) {
  const categories = useMemo(() => getRecipeCategories(recipes), [recipes]);
  const [filters, setFilters] = useState({
    query: '',
    category: 'all',
    sort: 'newest' as RecipeSort,
  });
  const { query, category, sort } = filters;
  // Render every recipe for the no-JavaScript fallback, then reveal batches
  // progressively after hydration.
  const [visibleCount, setVisibleCount] = useState(recipes.length);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filteredRecipes = useMemo(
    () => filterAndSortRecipes(recipes, query, category, sort),
    [recipes, query, category, sort],
  );
  const visibleRecipes = filteredRecipes.slice(0, visibleCount);
  const hasActiveFilters = query.trim() !== '' || category !== 'all';

  useEffect(() => {
    const restoreLocation = () => {
      setFilters(readLocation(categories));
      setVisibleCount(PAGE_SIZE);
    };
    const initialSync = window.setTimeout(restoreLocation, 0);
    window.addEventListener('popstate', restoreLocation);
    return () => {
      window.clearTimeout(initialSync);
      window.removeEventListener('popstate', restoreLocation);
    };
  }, [categories]);

  useEffect(() => {
    if (visibleCount >= filteredRecipes.length) return;
    const sentinel = sentinelRef.current;
    if (!sentinel || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((count) =>
            Math.min(count + PAGE_SIZE, filteredRecipes.length),
          );
        }
      },
      { rootMargin: '500px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredRecipes.length]);

  function updateFilters(next: {
    query?: string;
    category?: string;
    sort?: RecipeSort;
  }) {
    const nextFilters = { ...filters, ...next };
    setFilters(nextFilters);
    setVisibleCount(PAGE_SIZE);
    writeLocation(nextFilters);
  }

  function clearFilters() {
    updateFilters({ query: '', category: 'all' });
    searchRef.current?.focus();
  }

  function revealMore() {
    setVisibleCount((count) =>
      Math.min(count + PAGE_SIZE, filteredRecipes.length),
    );
  }

  const resultSummary = hasActiveFilters
    ? `${visibleRecipes.length} of ${filteredRecipes.length} ${filteredRecipes.length === 1 ? 'recipe' : 'recipes'}`
    : `${filteredRecipes.length} ${filteredRecipes.length === 1 ? 'recipe' : 'recipes'}`;

  return (
    <section aria-labelledby="recipes-heading" className="flex flex-col gap-6">
      <h2 id="recipes-heading" className="sr-only">
        Recipes
      </h2>
      <div className="flex flex-col gap-4">
        <label htmlFor="recipe-search" className="sr-only">
          Search recipes, ingredients, categories, and tags
        </label>
        <Input
          ref={searchRef}
          id="recipe-search"
          type="search"
          value={query}
          onChange={(event) =>
            updateFilters({ query: event.currentTarget.value })
          }
          placeholder="Search recipes or ingredients…"
          className="h-12 rounded-xl px-4 text-base sm:text-sm"
          autoComplete="off"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="recipe-category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="recipe-category"
              value={category}
              onChange={(event) =>
                updateFilters({ category: event.currentTarget.value })
              }
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {formatRecipeLabel(item)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="recipe-sort" className="text-sm font-medium">
              Order by
            </label>
            <select
              id="recipe-sort"
              value={sort}
              onChange={(event) =>
                updateFilters({ sort: event.currentTarget.value as RecipeSort })
              }
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title-asc">Title: A–Z</option>
              <option value="title-desc">Title: Z–A</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex min-h-6 flex-wrap items-center justify-between gap-2">
        <p
          aria-live="polite"
          aria-atomic="true"
          className="text-sm text-muted-foreground"
        >
          {resultSummary}
        </p>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        )}
      </div>

      {filteredRecipes.length > 0 ? (
        <>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleRecipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                priority={index === 0}
              />
            ))}
          </ul>
          {visibleCount < filteredRecipes.length && (
            <div ref={sentinelRef} className="flex justify-center py-3">
              <Button type="button" variant="outline" onClick={revealMore}>
                Load more recipes
              </Button>
            </div>
          )}
          {visibleCount >= filteredRecipes.length &&
            filteredRecipes.length > PAGE_SIZE && (
              <p className="py-3 text-center text-sm text-muted-foreground">
                All {filteredRecipes.length} recipes shown
              </p>
            )}
        </>
      ) : recipes.length > 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">No recipes match these filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another search or clear your filters.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">
            Your cookbook is ready for its first recipe
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a recipe to your collection and it will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
