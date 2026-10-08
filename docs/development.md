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

`wrangler.jsonc` configures Cloudflare Workers Static Assets to serve `dist/`. Cloudflare's Git repository connection is enabled in the dashboard, with `main` as the production branch. Changes pushed or merged into `main` trigger an automatic build and deployment. This setup was confirmed by the maintainer on October 7, 2026; the dashboard settings are not tracked in this repository. Check the Cloudflare deployment result before claiming that a change is live.

`pnpm deploy:dry-run` checks packaging without publishing. There is no live `deploy` script. The GitHub Actions `Validate` workflow runs `pnpm validate` on pull requests targeting `main` and on pushes to `main`, using pnpm 11.1.2 and Node.js 24. Cloudflare handles production deployment; a separate GitHub Actions deployment workflow is not needed.

Remote changes must stay within the user's requested scope. Agents can use GitHub tooling for authorized branch, commit, and pull request operations; authenticated access does not itself authorize unrelated publishing, resource deletion, or secret changes. Publish recipes through a branch and pull request rather than pushing directly to `main`.

The [recipe-import skill](../.agents/skills/recipe-import/SKILL.md) prepares Markdown and local photos and opens a recipe-only pull request. The `Auto-merge recipes` workflow runs after successful PR validation, checks the author's current write access and the complete changed-file list, and attempts a squash merge at the exact validated head SHA. It runs only trusted default-branch code with write permissions, never PR code or downloaded CI artifacts. Changes outside recipe/photo additions and updates require manual review.

Automatic recipe merging becomes active once the workflows are on the default branch; no repository variable or extra secret is needed. Protect `main` with the required `Validate` check and complete the [GitHub setup and phone import guide](recipe-import.md) before opening recipe import PRs. This workflow merges directly after CI; GitHub's separate native **Allow auto-merge** setting is not needed. To pause merging, disable **Auto-merge recipes** in GitHub Actions.

Do not commit API tokens or other credentials. A public repository exposes its tracked recipes, photos, and notes. Repository visibility and deployed-site access are separate; a private repository does not make the website private. Provider free-tier limits, CI quotas, agent usage, and optional domain costs still apply.

## References

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro framework components](https://docs.astro.build/en/guides/framework-components/)
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare Workers Builds and Git integration](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Cloudflare static asset limits](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [shadcn/ui with Astro](https://ui.shadcn.com/docs/installation/astro)
