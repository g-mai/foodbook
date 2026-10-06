# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who want their own recipe website and collection without writing application code or managing a backend. They set up an independent repository and hosting account once, then ask an AI coding agent to maintain the cookbook. Visitors use the published site to find, read, and print recipes.

## Product Purpose

Foodbook helps people save recipes from around the web in a collection they own and can keep updating. Success means a person can add a recipe through their agent, keep the source files in their repository, and read the published result comfortably on a phone or larger screen.

## Positioning

Foodbook is a reusable starter for independent personal recipe sites, not a shared hosted recipe service. Each cookbook contains editable application code, Markdown recipes, local images, and configuration in its owner's repository. Personal repositories preserve Foodbook's Git ancestry so owners can merge later shared updates while retaining their content and customizations.

## Operating Context

- A coding agent works in the owner's repository to prepare recipes and site changes. The owner reviews and publishes those changes through their repository workflow.
- Recipes are viewed in a browser, often on a phone, and can be printed from individual recipe pages.
- The intended publishing workflow builds the static Astro site through GitHub Actions and deploys it to Cloudflare Workers Static Assets when changes reach the production branch. These workflows are still planned, not yet implemented.
- A private source repository does not make the deployed website private; the site is public by default unless access control is configured separately.

## Capabilities and Constraints

- Current pages include a recipe collection with search, category filters, sorting, and recipe cards; individual pages show photos, ingredients, instructions, source links, and print styles.
- Recipes are Markdown files with validated frontmatter and a required local photo with alt text. The site generates static pages and optimizes images at build time.
- Shared starter recipes load alongside personal recipes by default and can be excluded through configuration. Recipe filenames must be unique across both sets.
- Personal settings can override the site name, description, tagline, default recipe language, measurement system, and starter inclusion. Existing recipes retain their recorded language and units when defaults change.
- The site has no application backend, database, or runtime server rendering. Search and filters run in the browser.
- The guided setup, automated recipe import skill, GitHub Actions checks, and production deployment workflow are planned. Do not describe them as shipped capabilities.
- Personal recipes and photos belong in the owner's repository, while the public project keeps its personal-content directories empty. Shared defaults and examples belong in the public project.

## Brand Commitments

- The shared product is named Foodbook. Owners may give their own cookbooks a different name through configuration.

## Evidence on Hand

- The public project includes three starter recipes and their images in `examples/default-recipes/` and `examples/images/`. These also demonstrate the content format.
- The current application, schema, and setup guidance are in `src/` and `README.md`; the upstream merge process is documented in `docs/upstream-updates.md`.
- No customer count, testimonials, or published usage results are established in the project.

## Product Principles

1. Keep each cookbook owned and editable by its user.
2. Make recipes easy to add through an agent and easy to read on the published site.
3. Preserve recipe provenance, original source links, and clear content validation.
4. Keep personal content separate from shared examples and make upstream updates mergeable.
5. Prefer a static, portable repository workflow over a hosted application backend.

## Accessibility & Inclusion

Recipe pages are responsive and print-friendly. Recipe photos require descriptive alt text, and the collection remains listed when browser JavaScript is unavailable. No product-specific accessibility standard has been specified.
