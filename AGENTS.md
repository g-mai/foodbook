## Development

### Shared project and personal cookbooks

- Personal cookbooks are independent repositories preserving Foodbook's Git history: `origin` is the personal repository and `upstream` is the public Foodbook repository. Check the repository context before preparing changes; the public development checkout may only have `origin`.
- Keep personal overrides in `foodbook.config.ts` and `src/styles/custom.css`. Add shared defaults in `src/lib/foodbook-defaults.ts` and shared styles in `src/styles/global.css` instead of routinely editing the personal override files upstream.
- Personal recipes and photos belong in `src/content/recipes/` and `src/assets/recipes/`, tracked in the personal repository. Keep these directories empty in the public project except for `.gitkeep`; shared examples belong in `examples/`.
- Shared starter recipes in `examples/default-recipes/` also serve as format examples. They load alongside personal recipes unless the personal config sets `includeDefaultRecipes: false`. Store shared images in `examples/images/`. Keep recipe filenames unique across the loaded starter and personal directories.
- All application code remains customizable. Upstream updates use normal Git merges on a dedicated branch, preserving personal content and custom features. Follow `docs/upstream-updates.md`; do not replace a cookbook with a fresh upstream copy or squash away upstream merge ancestry.
- These conventions do not change the remote-service safety restrictions above.

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
