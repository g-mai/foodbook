---
version: 1
slug: 'src-pages-index-astro'
primary_target: 'src/pages/index.astro'
related_targets:
  [
    'src/components/recipe-browser.tsx',
    'src/components/recipe-card.tsx',
    'src/components/recipe-suggestion.tsx',
    'src/styles/global.css',
  ]
---

# Homepage

Target: src/pages/index.astro; related: src/components/recipe-browser.tsx, src/components/recipe-card.tsx, src/styles/global.css.
Mode: Operate with equally prominent recipe discovery.
Audience: cookbook visitors finding a saved dish or deciding what to cook, often on phones.
Preserve content, source links, search, category filters, URL restoration, sorting, progressive loading and the static no-JavaScript collection. Recipes and imagery remain supplied content.

## Direction contract

THESIS: A kitchen scrapbook gives finding a known dish and discovering another equal room. A photo-print suggestion beside search is the first encounter with the collection.

OWN-WORLD: Pale green-white paper, dark green ink, leaf-green controls and apricot highlights. Self-hosted Fraunces headings, Geist controls and occasional Kalam notes. White photo-print frames carry quiet offset shadows; index tabs stay aligned and only the suggestion tilts.

STORY: Visitors recognize a personal collection, search by dish or ingredient, filter by cuisine, or get random recipe suggestions without immediate repeats before opening one.

FIRST VIEWPORT: Compact wordmark header. Desktop pairs a large two-line question, tagline and search on the left with a medium photo-print suggestion on the right. Category tabs and the collection follow. Mobile stacks compact search, suggestion, then the collection.

FORM: User-selected kitchen scrapbook; explicitly pinned by the user after comparison with neighborhood deli and food magazine. Concept seed unavailable because the local Impeccable engine is absent; no random assignment is claimed. Build path: code.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Validation limitations

Finish reviewer disposition: recapture, because desktop/mobile screenshots are unavailable. A separate source audit found and prompted correction of control rules being overridden by utility layers.

No enabled in-app or Chrome browser connection is available in this session. Visual captures and live interaction inspection remain unverified; do not claim visual sign-off from source review alone. Existing recipe raster files are unchanged and their source links remain recorded in recipe frontmatter.

## Suggestion refinement

Recipe images change without a reveal animation. Caption height reserves one category line and three title lines, with longer titles clamped and their complete text retained. Initial client-side suggestion and subsequent picks are random; the static fallback remains deterministic. Search and empty-state copy is concise, with redundant helper and completion text removed.

The initial suggestion is pending until the client chooses its random recipe. Hidden visibility preserves the print dimensions and prevents the static fallback recipe from flashing; shuffle stays disabled while pending. The no-JavaScript stylesheet makes the fallback print visible. SSR regression coverage verifies this pre-effect state.
