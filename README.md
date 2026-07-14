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

1. Create `src/content/work/slug.mdx` (or `slug.tsx` for a bespoke page that exports a
   `frontmatter` const)
2. Set its frontmatter: `title`, `header`, `tags`, `priority` (higher sorts first), optional
   `featured: true` (big Work rows on Home), optional `cell` (`wide` / `tall` archive card
   footprint, 1x1 otherwise), `description` (featured rows)
3. That's it — the registry globs the folder; the page is live at `/#slug`

See `docs/ADR-001-architecture.md` and `CLAUDE.md` for architecture details.
