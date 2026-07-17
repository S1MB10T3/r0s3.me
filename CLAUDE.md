# r0s3.me — portfolio site

Single-page portfolio for R0K (Senior Product Designer), replacing the old Jekyll site
(s1mb10t3.net). Deployed to GitHub Pages at https://r0s3.me. The full rationale lives in
`docs/ADR-001-architecture.md` — read it before making structural changes.

## Stack (decided, don't relitigate)

- Vite + React 19 + TypeScript, strict mode
- **Motion (Framer Motion) is the ONLY animation library.** No GSAP, ever. Scroll work uses
  `useScroll`/`useTransform` + sticky positioning.
- Rive (`@rive-app/react-canvas`) for designed 2D motion: media player states, page headers, logo
- react-three-fiber + drei for the 3D hero; keep three in its lazy chunk
- MDX for page content (`@mdx-js/rollup` with remark-frontmatter)

## Architecture

- **Hash routing:** `r0s3.me/#caldera` opens an overlay. `src/routes/useHashRoute.ts`. No router
  library. Overlay triggers must be real `<a href="#slug">` links.
- **Home stays mounted under overlays** (persists Three.js canvas + audio). Overlay shell:
  `src/overlay/OverlayRoot.tsx` (scroll lock, ESC/Back, focus, Go Back chip, frontmatter header).
- **Generic page template** (Figma node 156:45827): frontmatter-driven Rive/video header, then
  `<Intro>` (light, has media player), 1..n `<Section title="...">` (dark), `<Postmortem>` (light).
  Side-rail labels = uppercased `title` prop + CSS-counter position (DESIGN_02), sticky at the
  viewport's bottom-right (24/24) while their section is on screen. Media inside sections is
  plain MDX children (images, iframes), never props. Desktop measure: text 720px, media 940px,
  both centered; wrap media in `<Bleed>` for full-viewport width.
- **Content registry is derived:** each page in `src/content/work/` owns its metadata; the
  registry (`src/content/registry.ts`) globs the folder, so adding a page = dropping a file
  (slug = filename). MDX pages use YAML frontmatter; bespoke TSX pages (e.g. `espa.tsx`)
  export a self-contained `frontmatter` literal instead. Fields: `title`, `header`, `tags`,
  `featured` boolean (true = big Work rows on Home: espa, caldera, hook; false/absent =
  archive grid), `priority` integer (higher sorts first within each group), `cell`
  ('default' 1x1 / 'wide' 2x1 / 'tall' 1x2, Figma Article component 118:341), `description`
  (featured rows). The `page-meta` Vite plugin (vite.config.ts) extracts frontmatter at
  build time so Home lists pages without loading their chunks.
- **Music player:** DJ mixes on SoundCloud. ONE hidden SC widget iframe at app root
  (`src/player/PlayerProvider.tsx`), controlled via SC Widget API; custom UI only
  (`MediaPlayer.tsx`); mixes listed in `mixes.ts` (~3, dropdown + pause + mute). Audio persists
  across overlays. Autoplay is browser-blocked: playback starts from a click.

## Design source of truth

Figma: https://www.figma.com/design/sMbXlMfbjXPypLeq8MxBJG/R0S3.me
- Home desktop 72:4, tablet 82:299, mobile 82:302
- Case studies: Espa 87:407, Caldera 92:446, Hook 145:34656 (desktop only — no mobile designs yet)
- Generic page template: 156:45827
- Naming quirk: older frames call the closer "Postmodern"; canonical name is Postmortem.

Moodboard: Are.na channel `CHANGE-ME-channel-slug`. The `arena` MCP server (`.mcp.json`,
hosted at https://mcp.are.na/mcp, OAuth via `/mcp`) exposes its blocks; use it to pull the
board's images and compare palette, type feel, density, and mood against the site (tokens in
`src/styles/tokens.css` + screenshots of the running dev server).

## Content migration

Old Jekyll repo (S1MB10T3.github.io) archive content is migrated: all `_art/*.md` and
`_design/*.html` pages live as MDX in `src/content/work/` alongside the featured pages
(there is no separate `archive/` folder; featured vs archive is the `featured` frontmatter
flag), with optimized media in `public/media/<slug>/` (WebP max 1600px, WebM video; no MP4
fallbacks yet). Whether `_posts` blog content comes along is still undecided.

## Conventions

- R0K does not use em dashes in copy. Don't add them to any user-facing text.
- Design tokens in `src/styles/tokens.css` are placeholders until ported from Figma variables.
- Placeholder external links/URLs are marked CHANGE-ME.
- `npm run build` (tsc + vite) must pass before committing.

## Remaining work (ADR action items)

Tokens from Figma (colors/type are still placeholder tokens; real project media now exist for
every page, but the logo in Hero/Footer and the hero art + quote graphic slots are still
`/media/black.png` / empty placeholders), animations/effects pass (overlay transitions, scroll
work, remount lazy HeroScene in the hero art slot), real case study content, Rive assets, image
pipeline (vite-imagetools), MP4 fallbacks for archive WebM video, DNS cutover from s1mb10t3.net.
