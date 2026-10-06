---
name: Foodbook
description: A personal kitchen scrapbook with green ink, white photo prints, and room to explore.
colors:
  primary: '#365c45'
  primary-foreground: '#ffffff'
  background: '#f5f6f0'
  foreground: '#283e32'
  card: '#ffffff'
  secondary: '#e5eddf'
  secondary-foreground: '#36513c'
  muted: '#ecefe5'
  muted-foreground: '#5d6c60'
  accent: '#f6d4bc'
  accent-foreground: '#68442d'
  border: '#d5dccf'
  input: '#b8c6b4'
  ring: '#365c45'
typography:
  display:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: 'clamp(2.75rem, 5vw, 4.5rem)'
    fontWeight: 580
    lineHeight: 1.07
    letterSpacing: '-0.035em'
  headline:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: 'clamp(1.65rem, 3vw, 2.1rem)'
    fontWeight: 550
    lineHeight: 1.2
    letterSpacing: '-0.025em'
  title:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: '1.4rem'
    fontWeight: 550
    lineHeight: 1.25
  body:
    fontFamily: "'Geist Variable', sans-serif"
    fontSize: '1rem'
    lineHeight: 1.6
  label:
    fontFamily: "'Geist Variable', sans-serif"
    fontSize: '0.875rem'
    fontWeight: 600
  handwritten:
    fontFamily: "'Kalam', cursive"
    fontSize: '1.35rem'
    fontWeight: 400
    lineHeight: 1.3
rounded:
  print: '0.2rem'
  field: '0.5rem'
  control: '0.75rem'
  index-tab: '0.7rem 0.7rem 0.15rem 0.15rem'
spacing:
  compact: '0.5rem'
  control-gap: '0.75rem'
  regular: '1rem'
  section: '1.5rem'
  grid: '1.75rem'
  roomy: '2rem'
  browser: '3rem'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.index-tab}'
    height: '2.75rem'
    padding: '0 1.25rem'
  button-outline:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.control}'
    height: '2rem'
    padding: '0 0.625rem'
  button-ghost:
    textColor: '{colors.foreground}'
    rounded: '{rounded.control}'
    height: '2.75rem'
    padding: '0 0.75rem'
  category-tab:
    backgroundColor: '{colors.secondary}'
    textColor: '{colors.secondary-foreground}'
    rounded: '{rounded.index-tab}'
    height: '2.75rem'
    padding: '0 1.25rem'
  category-tab-hover:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.accent-foreground}'
  recipe-search:
    backgroundColor: '{colors.card}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.field}'
    height: '3.5rem'
    padding: '0.25rem 1rem 0.25rem 2.85rem'
  recipe-sort:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.field}'
    padding: '0.5rem 0.75rem'
  recipe-card:
    backgroundColor: '{colors.card}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.print}'
    padding: '0.6rem'
  suggestion-print:
    backgroundColor: '{colors.card}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.print}'
    padding: '0.85rem'
---

# Design System: Foodbook

## Overview

**Creative North Star: "The Kitchen Scrapbook"**

A personal collection of recipes feels kept and revisited: pale green-white paper, dark green ink, white photo prints, and occasional handwritten notes. The character is playful but adult, with a calm reading surface and small tactile cues rather than decorative clutter.

Fraunces gives recipe titles warmth; Geist keeps controls clear; Kalam marks a few personal notes. Photograph-led cards stay aligned while the featured print supplies the single tilt. The user's chosen replacement world establishes the current light theme; the previous look is not a visual constraint.

**Key Characteristics:**

- Green ink and leaf tabs on pale paper.
- White photo-print frames with quiet diffuse shadows.
- Warm serif titles, clear sans-serif controls, occasional handwritten notes.
- A single tilted featured print; orderly collection cards.

This record is source-derived from the implemented homepage and global stylesheet. No browser connection or desktop/mobile captures were available. The finish reviewer requested recapture; this document does not certify rendered appearance or responsive behavior.

## Colors

The palette combines garden greens with an apricot highlight and white photographic paper. Frontmatter records the light-theme values; it is the normative token layer.

### Primary

- **Garden Green** (`primary`): selected category tabs, search icon, arrows, and handwritten notes.
- **White Ink** (`primary-foreground`): lettering on the selected category tab.

### Secondary

- **Leaf Paper** (`secondary`): unselected category tabs.
- **Leaf Ink** (`secondary-foreground`): their default labels.

### Tertiary

- **Apricot Paper** (`accent`): hover treatment for unselected tabs and text selection.
- **Apricot Ink** (`accent-foreground`): the corresponding tab hover label.

### Neutral

- **Green-white Paper** (`background`): page surface and sort-field background.
- **Dark Green Ink** (`foreground`): body text and headings.
- **Photo Paper** (`card`): recipe frames and the search field.
- **Soft Leaf Wash** (`muted`): inherited ghost and outline button hover surfaces.
- **Quiet Green Ink** (`muted-foreground`): help text, counts, and recipe facts.
- **Paper Edge** (`border`): header, footer, collection separators, and outline controls.
- **Field Edge** (`input`): search and sort strokes.
- **Focus Green** (`ring`): keyboard focus indicators.

## Typography

**Display Font:** self-hosted Fraunces Variable, with Georgia and serif fallbacks.
**Body Font:** self-hosted Geist Variable, with a sans-serif fallback.
**Note Font:** self-hosted Kalam, regular, with a cursive fallback.

The variable serif supplies soft, expressive headings without slowing down the control text. Handwriting is a sparse personal annotation rather than the reading face.

### Hierarchy

- **Display:** the frontmatter display role serves the opening question. Below the mobile breakpoint its size becomes `clamp(2.5rem, 10vw, 3.25rem)`.
- **Headline:** the frontmatter headline role serves the collection heading.
- **Title:** the frontmatter title role serves collection cards. The featured caption instead uses `clamp(1.3rem, 2vw, 1.7rem)` with weight 550 and line-height 1.2.
- **Body:** the frontmatter body role serves the tagline and search input. The tagline is limited to 35ch and becomes 0.9rem on mobile.
- **Label:** the frontmatter label role serves the search label. Buttons use weight 500; utility hints and counts use 0.8rem; recipe facts use 0.75rem with tabular numerals.
- **Handwritten:** the frontmatter handwritten role appears in the inspiration note and footer.

**The Note Rule.** Reserve handwriting for short personal notes; retain Geist for actions and reading support.

## Layout

The main shell is centered at `min(100% - 3rem, 1160px)` with 2rem vertical padding. Its header uses a flexible wordmark/link row and a fine bottom stroke. The homepage opening places search and recipe inspiration in adjacent columns (`1.12fr 1fr`) with a fluid `clamp(2rem, 6vw, 5rem)` gap. This homepage composition belongs to its surface brief, not a mandatory template for every page.

The browser separates its major sections by 3rem. Collection controls wrap naturally, followed by a three-column recipe grid with a 1.75rem gap. At 900px and below the grid uses two columns, the opening gap becomes 2rem, and sort label/field stack.

At 639px and below the shell becomes `min(100% - 2.5rem, 460px)` with 1.25rem vertical padding. Search and inspiration stack; the opening gap is 1.75rem, major sections use 2rem, and the grid becomes one column with a 1.5rem gap. Collection heading and filter row wrap; tab horizontal padding becomes 1rem. These are implemented media queries, awaiting browser verification.

## Elevation & Depth

White frames and tonal tabs provide most separation. Diffuse green-tinted shadows give photo prints a quiet lift; there are no hard offset blocks in this implemented homepage world.

### Shadow Vocabulary

- **Paper:** `0 6px 18px rgb(40 62 50 / 8%)`, the resting recipe-card shadow.
- **Raised Paper:** `0 12px 26px rgb(40 62 50 / 13%)`, the featured print and hovered recipe cards.

**The Single Tilt Rule.** Only the featured print tilts: 2deg at larger sizes, 1deg on mobile. Collection cards stay aligned at rest.

Cards lift 4px on hover over 250ms; the featured print straightens and lifts 3px over 300ms. Both use `cubic-bezier(0.16, 1, 0.3, 1)`. Suggestion images switch without an animation. Reduced-motion rules remove hover transitions, rotations, and lifts.

## Shapes

Photo prints have nearly square corners, fields have gentle corners, and inherited utility buttons use the base control radius. Category controls have rounded top corners and shallow bottom corners, making a row of index tabs. They are buttons with pressed state, rather than a tab-panel navigation widget.

Images crop to 4:3 with `object-fit: cover`. The mobile featured image changes to 16:9. Recipe titles wrap anywhere to accommodate long names. Frames use generous white photographic margins without additional card borders.

## Components

### Buttons

Inherited shadcn controls are compact, medium-weight Geist actions. The selected category button uses garden green and white lettering; its hover reduces background opacity to 80%. The suggestion's ghost action uses a 2.75rem minimum height and 0.8rem text. Generic outline actions retain the 2rem default height and paper-edge border. Ghost and outline hover use the soft leaf wash.

Button focus uses a three-pixel half-opacity green ring and a green border. Disabled controls suppress interaction and reduce opacity. Enabled buttons move down one pixel on activation through their inherited base style.

### Category Tabs

The leaf-paper unselected state changes to apricot on hover. Selection switches to the primary button state. Each has a 2.75rem minimum height and uses `aria-pressed`; the row wraps. Custom homepage control rules are unlayered CSS so their backgrounds, sizes, and silhouettes override inherited utility-layer defaults.

### Cards / Containers

The whole recipe print is a link. A 0.6rem white frame surrounds its image; the caption uses `1rem 0.5rem 0.5rem` padding and a 0.55rem internal gap. Title and arrow share a row; time and servings wrap beneath it. Existing categories are recipe metadata, not a reusable decorative eyebrow pattern.

### Inputs / Fields

The search field is a white, bordered input labeled "Search recipes", with an inset search icon and room for full-size text. Its inherited input focus ring remains visible while the custom field-edge border is retained. The native sort select uses paper background, a field-edge border, and a 2.75rem minimum height. An active search has a result link 0.65rem beneath the field; there is no repeated helper line.

### Navigation

The wordmark pairs a 26px outlined book SVG with a 1.7rem Fraunces label at weight 650 and tracking -0.03em; the label becomes 1.45rem on mobile. The collection link uses 0.875rem Geist, becomes 0.75rem with a bounded width on mobile, and underlines on hover. Collection links, recipe links, the native select, and footer links use a two-pixel green focus outline with a five-pixel offset; the wordmark uses a four-pixel offset.

### Featured Print

The inspiration note and ghost shuffle action sit above a linked photo print with a 0.85rem frame. Mobile frame padding is 0.65rem. Before the initial pick, the print is hidden with its layout space retained and the shuffle action disabled; a no-JavaScript style restores the deterministic fallback. The first hydrated suggestion is random; "Another idea" uniformly chooses from the other recipes without immediately repeating. The caption has a polite live region. Its category reserves one line and its title three lines, keeping print height stable; longer titles are ellipsized with full text retained for assistive technology and the native title tooltip. The print uses the raised shadow and the single tilt, giving discovery a tangible place beside search.

## Do's and Don'ts

### Do:

- **Do** use the green-paper palette and white photo frames for the current light world.
- **Do** keep recipe photos and their source provenance intact.
- **Do** preserve visible control labels, keyboard focus, wrapping titles, and reduced-motion behavior.
- **Do** reserve handwriting for short personal notes; retain Geist for actions and reading support.
- **Do** keep the featured print as the single tilted element and collection cards aligned at rest.

### Don't:

- **Don't** turn recipe category metadata into a decorative kicker system.
- **Don't** spread rotations or hard offset shadows across the collection.
- **Don't** promote this homepage's search-and-suggestion composition into a compulsory layout for every surface.
- **Don't** treat source review as desktop/mobile visual sign-off.
