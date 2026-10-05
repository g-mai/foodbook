import { Badge } from '@/components/ui/badge';
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
        className="group flex h-full flex-col overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <img
          src={recipe.image.src}
          width={recipe.image.width}
          height={recipe.image.height}
          alt={recipe.image.alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="aspect-4/3 w-full object-cover"
        />
        <div className="flex h-full flex-col gap-3 p-4 sm:p-5">
          <h3 className="text-lg leading-snug font-semibold text-balance group-hover:underline group-hover:underline-offset-4">
            {recipe.title}
          </h3>
          {recipe.categories.length > 0 && (
            <div className="flex flex-wrap gap-2" aria-label="Categories">
              {recipe.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {formatRecipeLabel(category)}
                </Badge>
              ))}
            </div>
          )}
          {(totalMinutes !== null ||
            recipe.prepMinutes !== null ||
            recipe.cookMinutes !== null ||
            recipe.servings !== null) && (
            <p className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-1 text-sm text-muted-foreground">
              {totalMinutes !== null ? (
                <span>{totalMinutes} min</span>
              ) : (
                <>
                  {recipe.prepMinutes !== null && (
                    <span>Prep {recipe.prepMinutes} min</span>
                  )}
                  {recipe.cookMinutes !== null && (
                    <span>Cook {recipe.cookMinutes} min</span>
                  )}
                </>
              )}
              {recipe.servings !== null && (
                <span>{recipe.servings} servings</span>
              )}
            </p>
          )}
        </div>
      </a>
    </li>
  );
}
