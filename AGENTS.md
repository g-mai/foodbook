## Remote service safety

- Use `gh` and `wrangler` exclusively for read-only queries and dry-run actions.
- Never push, deploy, write, or delete remote resources, including secrets, through these CLIs.
- Authentication is not authorization to make remote changes. Keep implementation changes local.
- Use `pnpm run deploy:dry-run` to verify deployment without publishing.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Code quality

- Use Prettier for formatting and ESLint for code linting. Prettier formats Astro files; Tailwind class sorting currently applies to React/JS/TS and CSS, not `.astro` (see the configuration compatibility note). Do not add competing formatting rules to ESLint.
- Run `pnpm format` after editing files, then `pnpm validate` before handing off changes.
- `pnpm validate` checks formatting, linting, types, and the static build without deploying.
- Do not hand-edit generated files or `pnpm-lock.yaml`; use pnpm for dependency changes.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
