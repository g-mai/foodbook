import { ArrowUpRight, Clock3, UsersRound } from 'lucide-react';
import { formatRecipeLabel, type BrowserRecipe } from '@/lib/recipe-browser';

interface RecipeCardProps {
  recipe: BrowserRecipe;
  priority?: boolean;
}

export function RecipeCard({ recipe, priority = false }: RecipeCardProps) {
  const totalMinutes =
    recipe.prepMinutes !== null && recipe.cookMinutes !== null
      ? recipe.prepMinutes + recipe.cookMinutes
      : null;

  return (
    <li>
      <a
        href={`/recipes/${recipe.id}/`}
        lang={recipe.language}
        className="recipe-card group"
      >
        <img
          src={recipe.image.src}
          width={recipe.image.width}
          height={recipe.image.height}
          alt={recipe.image.alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="recipe-card-photo"
        />
        <div className="recipe-card-caption">
          {recipe.categories.length > 0 && (
            <p className="recipe-card-category">
              {recipe.categories.map(formatRecipeLabel).join(' · ')}
            </p>
          )}
          <div className="recipe-card-title-row">
            <h3>{recipe.title}</h3>
            <ArrowUpRight aria-hidden="true" className="recipe-card-arrow" />
          </div>
          {(totalMinutes !== null ||
            recipe.prepMinutes !== null ||
            recipe.cookMinutes !== null ||
            recipe.servings !== null) && (
            <p className="recipe-card-facts">
              {totalMinutes !== null ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 aria-hidden="true" className="size-4" />
                  {totalMinutes} min
                </span>
              ) : (
                <>
                  {recipe.prepMinutes !== null && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 aria-hidden="true" className="size-4" />
                      Prep {recipe.prepMinutes} min
                    </span>
                  )}
                  {recipe.cookMinutes !== null && (
                    <span>Cook {recipe.cookMinutes} min</span>
                  )}
                </>
              )}
              {recipe.servings !== null && (
                <span className="inline-flex items-center gap-1.5">
                  <UsersRound aria-hidden="true" className="size-4" />
                  {recipe.servings} servings
                </span>
              )}
            </p>
          )}
        </div>
      </a>
    </li>
  );
}
