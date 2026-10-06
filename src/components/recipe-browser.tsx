import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, Search } from 'lucide-react';
import { RecipeSuggestion } from '@/components/recipe-suggestion';
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
    <div className="recipe-browser">
      <section className="scrapbook-opening" aria-labelledby="cookbook-heading">
        <div className="scrapbook-intro">
          <h1 id="cookbook-heading" className="scrapbook-title">
            What sounds
            <br />
            good today<span className="title-punctuation">?</span>
          </h1>
          <p className="scrapbook-tagline">
            The dishes you love, gathered in one happy place.
          </p>
          <div className="search-area">
            <label htmlFor="recipe-search" className="search-label">
              Search recipes, ingredients, categories, and tags
            </label>
            <div className="search-field">
              <Search aria-hidden="true" className="search-icon" />
              <Input
                ref={searchRef}
                id="recipe-search"
                type="search"
                value={query}
                onChange={(event) =>
                  updateFilters({ query: event.currentTarget.value })
                }
                placeholder="Find a recipe…"
                className="recipe-search"
                autoComplete="off"
              />
            </div>
            <div className="search-results-container">
              {hasActiveFilters && (
                <a href="#collection" className="search-results-link">
                  {filteredRecipes.length}{' '}
                  {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
                  <ArrowDown aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
        {recipes.length > 0 && <RecipeSuggestion recipes={recipes} />}
      </section>

      <section
        id="collection"
        aria-labelledby="recipes-heading"
        className="recipe-collection"
      >
        <div className="collection-heading">
          <div>
            <h2 id="recipes-heading">Recipes</h2>
            <p
              className="collection-count"
              aria-live="polite"
              aria-atomic="true"
            >
              {resultSummary}
            </p>
          </div>
          <div className="sort-field">
            <label htmlFor="recipe-sort" className="sr-only">
              Sort recipes
            </label>
            <select
              id="recipe-sort"
              value={sort}
              onChange={(event) =>
                updateFilters({ sort: event.currentTarget.value as RecipeSort })
              }
              className="recipe-sort"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title-asc">Title: A–Z</option>
              <option value="title-desc">Title: Z–A</option>
            </select>
          </div>
        </div>
        <div className="collection-filter-row">
          <div
            className="category-tabs"
            role="group"
            aria-label="Recipe categories"
          >
            <Button
              type="button"
              variant={category === 'all' ? 'default' : 'outline'}
              className="filter-chip"
              aria-pressed={category === 'all'}
              onClick={() => updateFilters({ category: 'all' })}
            >
              Everything
            </Button>
            {categories.map((item) => (
              <Button
                key={item}
                type="button"
                variant={category === item ? 'default' : 'outline'}
                className="filter-chip"
                aria-pressed={category === item}
                onClick={() => updateFilters({ category: item })}
              >
                {formatRecipeLabel(item)}
              </Button>
            ))}
          </div>
          {hasActiveFilters && (
            <Button type="button" variant="ghost" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>

        {filteredRecipes.length > 0 ? (
          <>
            <ul className="recipe-grid">
              {visibleRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </ul>
            {visibleCount < filteredRecipes.length && (
              <div ref={sentinelRef} className="flex justify-center py-3">
                <Button type="button" variant="outline" onClick={revealMore}>
                  Load more recipes
                </Button>
              </div>
            )}
          </>
        ) : recipes.length > 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="font-medium">No recipes found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search.
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
            <p className="font-medium">No recipes yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first recipe to get started.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
