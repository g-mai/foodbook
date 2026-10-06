import { useEffect, useState } from 'react';
import { ArrowUpRight, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getRandomRecipeIndex,
  formatRecipeLabel,
  type BrowserRecipe,
} from '@/lib/recipe-browser';

export function RecipeSuggestion({ recipes }: { recipes: BrowserRecipe[] }) {
  const [index, setIndex] = useState<number | null>(null);
  useEffect(() => {
    const initialPick = window.setTimeout(
      () => setIndex(getRandomRecipeIndex(recipes.length)),
      0,
    );
    return () => window.clearTimeout(initialPick);
  }, [recipes.length]);

  const recipe = recipes[(index ?? 0) % recipes.length];
  if (!recipe) return null;

  return (
    <aside className="recipe-suggestion" aria-label="Recipe inspiration">
      <div className="suggestion-note-row">
        <p className="handwritten">A little inspiration</p>
        {recipes.length > 1 && (
          <Button
            type="button"
            variant="ghost"
            className="suggestion-shuffle"
            onClick={() =>
              setIndex(getRandomRecipeIndex(recipes.length, index ?? undefined))
            }
          >
            <Shuffle aria-hidden="true" data-icon="inline-start" />
            Another idea
          </Button>
        )}
      </div>
      <a
        href={`/recipes/${recipe.id}/`}
        lang={recipe.language}
        className="suggestion-print"
        data-pending={index === null}
      >
        <img
          key={recipe.id}
          src={recipe.image.src}
          width={recipe.image.width}
          height={recipe.image.height}
          alt={recipe.image.alt}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="suggestion-photo"
        />
        <div
          className="suggestion-caption"
          aria-live="polite"
          aria-atomic="true"
        >
          <div>
            <span className="recipe-card-category">
              {recipe.categories.map(formatRecipeLabel).join(' · ')}
            </span>
            <h2 title={recipe.title}>{recipe.title}</h2>
          </div>
          <ArrowUpRight aria-hidden="true" className="suggestion-arrow" />
        </div>
      </a>
    </aside>
  );
}
