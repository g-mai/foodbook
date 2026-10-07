# Foodbook

My personal recipe collector, kept open source.

I use Foodbook to save recipes I want to cook, find them again, and read them comfortably in the kitchen. Recipes are Markdown files with local photos and links to their original sources. Astro turns the collection into a static website.

This repository is my cookbook and the application behind it, not a reusable starter product or a hosted service. The source is open for others to explore and adapt, but development follows my own cooking and maintenance needs. There is no separate shared-project/personal-copy workflow to maintain.

## What it does

- Browse recipe cards, search by recipe name or ingredient, filter by cuisine, and sort the collection.
- Suggest a saved recipe when I need an idea for what to cook.
- Show photos, ingredients, instructions, notes, and original source links on individual recipe pages.
- Print recipes in a kitchen-friendly layout.
- Validate recipe metadata and local images during checks and builds.

The site uses Astro, TypeScript, Tailwind CSS, and React/shadcn UI components. Search and filters run in the browser; the recipe list remains available without JavaScript. There is no application backend or database.

Recipes can be added manually or with the [recipe-import skill](skills/recipe-import/SKILL.md) and a write-capable GitHub connector. GitHub Actions validates PRs and can automatically merge recipe-only changes from current write collaborators after the [one-time GitHub setup](docs/recipe-import.md). Cloudflare's Git connection builds and deploys changes to `main`.

## Run locally

Use pnpm and Node.js 22.22.3+ on the 22.x line, 24.16.0+ on the 24.x line, or 26.3.0+.

```sh
pnpm install --frozen-lockfile
pnpm dev --background
```

Open the URL reported by Astro, normally <http://localhost:4321/>. Manage the background server with:

```sh
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
```

Before handing off changes, run:

```sh
pnpm format
pnpm validate
```

Validation checks formatting, linting, tests, types, and the static build without deploying. See [development and hosting](docs/development.md) for the other commands and tooling notes.

## Keep recipes

All recipes live directly in `recipes/`, with photos in `recipes/images/`. Every Markdown recipe in that folder is part of the collection. Keep recipes, images, and personal notes tracked alongside the application.

Each recipe needs a stable, unique filename, source URL, date added, language, measurement system, ingredients, and a local image with alt text. Write the cooking steps and optional notes in the Markdown body. See the [recipe content guide](docs/recipes.md) for the complete format and an agent-assisted checklist.

## Application

There is no cookbook configuration or preference layer. Site copy lives in the pages and components, page metadata in `src/layouts/Layout.astro`, and styles in `src/styles/global.css`. Edit those files directly when needed. Recipe language and units describe the saved content rather than site-wide preferences.

## Project notes

- [Design system](DESIGN.md): the kitchen-scrapbook visual direction and implemented tokens.
- [Recipe content](docs/recipes.md): frontmatter, images, instructions, and adding recipes.
- [Development and hosting](docs/development.md): checks, tooling, and static hosting.

Open source describes the application, not permission to reuse every recipe or photo. Preserve source links and check rights before redistributing third-party content. A public repository exposes committed recipes, photos, and notes; do not commit secrets or information I do not want public. A private repository would not, by itself, make a deployed site private.
