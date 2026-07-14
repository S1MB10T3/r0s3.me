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

1. Create `src/content/case/slug.mdx` or `src/content/archive/slug.mdx`
   (frontmatter: `title`, `header`; body: `<Intro>`, `<Section title>`, `<Postmortem>`)
2. Register the slug in `src/content/registry.ts`
3. It's live at `/#slug`

See `docs/ADR-001-architecture.md` and `CLAUDE.md` for architecture details.
