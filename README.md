# r0s3.me

Portfolio of R0S3 — single-page experience with case study overlays.
Vite + React + TypeScript, Motion, Rive, react-three-fiber, MDX. Deployed to GitHub Pages.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build && npm run preview
```

## Deploy

Push to `main`. GitHub Actions builds and deploys to Pages (custom domain `r0s3.me` via
`public/CNAME`). One-time repo setup: Settings → Pages → Source: **GitHub Actions**, then add the
custom domain.

## Add a page

1. Create `src/content/work/slug.mdx`
   (frontmatter: `title`, `header`; body: `<Intro>`, `<Section title>`, `<Postmortem>`)
2. Register the slug in `src/content/registry.ts` with a `priority` (higher sorts first),
   optional `featured: true` (big Work rows on Home), and optional `cell`
   (`'wide'` / `'tall'` archive card footprint, 1x1 otherwise)
3. It's live at `/#slug`

See `docs/ADR-001-architecture.md` and `CLAUDE.md` for architecture details.
