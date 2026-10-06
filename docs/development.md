# Development and hosting

Foodbook's application and recipe collection live in one repository. Work directly on its code, styles, and recipes. There is no configuration or override layer for adapting it into other cookbooks.

## Local commands

Use pnpm with Node.js 22.22.3+ on the 22.x line, 24.16.0+ on the 24.x line, or 26.3.0+. Install locked dependencies with `pnpm install --frozen-lockfile`.

| Command                      | Purpose                                                         |
| ---------------------------- | --------------------------------------------------------------- |
| `pnpm dev --background`      | Start Astro's background dev server                             |
| `pnpm exec astro dev status` | Show the background server status                               |
| `pnpm exec astro dev logs`   | Read the background server logs                                 |
| `pnpm exec astro dev stop`   | Stop the background server                                      |
| `pnpm format`                | Format source, configuration, and Markdown                      |
| `pnpm format:check`          | Check formatting without modifying files                        |
| `pnpm lint`                  | Lint JavaScript, TypeScript, React, and Astro; fail on warnings |
| `pnpm lint:fix`              | Apply available ESLint fixes locally                            |
| `pnpm test`                  | Run schema, collection, browser, and suggestion tests           |
| `pnpm check`                 | Check Astro and TypeScript types                                |
| `pnpm build`                 | Generate the static website in `dist/`                          |
| `pnpm validate`              | Check formatting, lint, tests, types, and the static build      |
| `pnpm preview`               | Build and preview the static website locally                    |
| `pnpm deploy:dry-run`        | Build and check Wrangler packaging without publishing           |

Run `pnpm format` after editing files, then `pnpm validate` before handing off changes. Validation does not deploy. Do not hand-edit generated files or `pnpm-lock.yaml`; use pnpm for dependency changes.

## Application structure

- `src/pages/index.astro` builds the collection and hydrates the interactive recipe browser.
- `src/pages/recipes/[id].astro` generates recipe pages from the content collection.
- `src/content.config.ts` and `src/lib/recipe-schema.ts` load and validate recipes.
- `recipes/` holds all recipe Markdown files; `recipes/images/` holds their photos.
- `src/layouts/Layout.astro` holds default page metadata; site copy lives directly in pages and components.
- `src/styles/global.css` holds the styles and theme.
- `src/components/`, `src/layouts/`, and `src/pages/` are editable application code, not an upstream layer to keep untouched.

Astro uses static output without the Cloudflare adapter. React components needing browser interactivity use an Astro `client:*` directive; other components render at build time. Photos become optimized static assets. No database, runtime server rendering, KV namespace, or separate image-storage service is required.

## Formatting and editor support

Prettier owns formatting; ESLint owns code-quality checks. `eslint-config-prettier` disables conflicting style rules. Astro and TypeScript type checking remains a separate step.

The Astro-aware Prettier plugin formats `.astro` files. The Tailwind sorter currently handles React/JavaScript/TypeScript and CSS, including `cn()` and `cva()`, but not the new Astro formatter's syntax tree. Do not add competing formatting rules to ESLint to work around this. Markdown recipes are formatted too; ESLint does not lint Markdown, YAML, or CSS.

VS Code settings enable Prettier and ESLint fixes on explicit saves. Use the recommended Astro, ESLint, Prettier, and Tailwind CSS extensions. The `@/*` import alias maps to `src/*`.

## Hosting and publication

`wrangler.jsonc` configures Cloudflare Workers Static Assets to serve `dist/`. `pnpm deploy:dry-run` checks packaging without publishing. There is no live `deploy` script and no GitHub Actions validation or deployment workflow in this repository yet. Do not assume that a push publishes the site or that the local configuration proves a deployment exists.

Under the current project safety restriction, agents may use `gh` and `wrangler` only for read-only queries and dry runs, not remote writes, pushes, deployments, deletions, or secret configuration. Leave publishing steps to the maintainer; an authenticated CLI does not itself authorize remote changes.

Do not commit API tokens or other credentials. A public repository exposes its tracked recipes, photos, and notes. Repository visibility and deployed-site access are separate; a private repository does not make the website private. Provider free-tier limits, CI quotas, agent usage, and optional domain costs still apply.

## References

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro framework components](https://docs.astro.build/en/guides/framework-components/)
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare static asset limits](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [shadcn/ui with Astro](https://ui.shadcn.com/docs/installation/astro)
