# Content model

The files in this directory are the editable content layer for the site. Rendering components should contain structure, styling hooks, and interaction only; headings, body copy, labels, links, image metadata, and accessibility text belong here.

## Where content lives

- `site.ts` — brand identity, release details, shared destinations/actions, header, footer, and editorial UI labels.
- `home.ts` — the homepage, grouped by the same semantic sections shown in `HomePage.tsx`.
- `privacy.ts` — the complete privacy page, including summary cards, data rows, prose sections, and contact CTA.
- `seo.ts` — route metadata and the long-form reading guides.
- `types.ts` — small shared content contracts such as links, images, icons, and section headings.

## Editing rules

1. Change shared facts once in `site.ts`. Other content should reference those values rather than repeat URLs, email addresses, or brand assets.
2. Keep content semantic. Prefer `heading`, `modes`, or `summaryCards` over generic arrays of anonymous blocks.
3. Use discriminated visual models when a section supports distinct presentations. The homepage reading modes and feature cards demonstrate this with `kind` fields.
4. Store complete image metadata together: source, alternative text, width, and height.
5. Derive structured data from visible content. FAQ schema is generated from `homeContent.faq.items` so the two cannot drift.
6. Use `satisfies` when adding a new content object. It validates the model while preserving useful literal types for renderers.

## Adding content

For a new item in an existing section, add it to that section's collection. The corresponding component should render it automatically.

For a genuinely new section, add a named section model to `HomePageContent`, provide its content in `homeContent`, create a focused renderer under `components/home`, and compose it in `pages/HomePage.tsx`.
