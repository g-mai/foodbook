# Shared recipe content

Shared starter recipes and their images belong here, separate from personal cookbook content. The included real recipes also serve as format examples.

## Included starter recipes

`default-recipes/` is loaded into the recipe collection by default, alongside personal recipes in `src/content/recipes/`. These are real recipes included with a new Foodbook checkout, saved in English with metric measurements. Changing language or measurement preferences does not rewrite them.

- `default-recipes/pollo-alla-cacciatora.md`: chicken cacciatore, categorized as `italian`, with a local photo in `images/pollo-alla-cacciatora.jpg`.
- `default-recipes/pasta-with-broccoli-and-anchovies.md`: linguine with Sicilian broccoli and anchovies, based on [Agrodolce's recipe](https://www.agrodolce.it/ricette/pasta-con-broccoli-e-acciughe). Add a local photo and its alt text before building; the recipe schema requires both image fields.
- `default-recipes/modanyaki.md`: Japanese cabbage pancake layered with yakisoba and pork belly, based on [Japanese Cooking 101's recipe](https://japanesecooking101.com/modanyaki-recipe/), with its local source photo.

To exclude all starter recipes, set `includeDefaultRecipes: false` in your personal `foodbook.config.ts`. Personal recipes still load. Starter files and images remain in the repository, but do not produce recipe pages or homepage links. New starters received through upstream updates remain excluded too.

In a personal checkout, you can edit or remove a starter recipe like any other repository file. Recipe filenames must be unique across loaded starter and personal recipes; duplicates fail validation rather than silently overwrite content. Each loaded recipe gets a page at `/recipes/<filename-without-extension>/`; chicken cacciatore is at `/recipes/pollo-alla-cacciatora/`.

The [recipe format](../README.md#recipe-content) is documented in the root README. Use the included chicken cacciatore file as a complete example of frontmatter, ingredients, Markdown instructions, and a local image.

Personal recipes belong in `src/content/recipes/`, and their photos in `src/assets/recipes/`. Keep those directories empty in the public Foodbook repository, apart from their `.gitkeep` placeholders.
