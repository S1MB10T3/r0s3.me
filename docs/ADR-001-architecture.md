# ADR-001: r0s3.me Portfolio Site Architecture

**Status:** Proposed
**Date:** 2026-07-13
**Deciders:** R0K
**Repo:** `git@github.com:S1MB10T3/r0s3.me.git`

## Context

The current portfolio (S1MB10T3.github.io, served at s1mb10t3.net) is a Jekyll site. The redesign in Figma ([R0S3.me file](https://www.figma.com/design/sMbXlMfbjXPypLeq8MxBJG/R0S3.me?node-id=62-93)) calls for a fundamentally different kind of site:

- **A single-page experience.** Home is one scroll: Hero → Featured work (Espa Labs, Caldera, Hook) → typographic quote section → archive grid → footer. The Figma file has Desktop (1512px), Tablet (744px), and Mobile (390px) variants of Home with identical section structure, so breakpoints are well defined.
- **Case studies as overlays**, not separate pages, in two tiers:
  - **Featured case studies** (Espa Labs, Caldera, Hook): long-form, art-directed scrolls in Figma (Caldera is 8,147px tall) with a consistent anatomy: Hero → Intro → Work sections → Postmortem outro (layers named "Postmodern" in the older case study frames), plus side-rail section labels (INTRO_01, DESIGNSYSTEM_03, etc.). These exist only as desktop designs today.
  - **Archive items** (the grid at the bottom of Home: Shining Armor, Element Finance, Salesforce, 20XX Magazine, the art pieces, etc.): each gets its own simpler overlay page. Most of this content already exists as markdown in the old Jekyll repo (`_art/*.md` with frontmatter + Vimeo embeds + image lists, `_design/*.html`, `_posts/*.md`) and should be migrated rather than rewritten.
- **A generic page template exists in Figma** ([node 156:45827](https://www.figma.com/design/sMbXlMfbjXPypLeq8MxBJG/R0S3.me?node-id=156-45827)) defining the shared anatomy for most overlay pages: a full-bleed **Rive or video header**, a light **INTRO_01** section (intro copy + Media Player widget), **one or more dark content sections** (large media block + caption), and a light **POSTMORTEM_0n** closer, with rotated side-rail labels auto-numbering down the page and a "Go Back" chip pinned top-left.
- **Hard requirements:** Rive and Three.js. Recurring UI in Figma (Media Player widget, Tag, Article, Button instances) suggests a small component system.
- **Music player:** the Media Player widget is a real audio player for DJ mixes hosted on SoundCloud. It needs a dropdown listing the available mixes (usually ~3), plus pause and mute controls. It appears on the home hero and in page intros, so audio should persist while navigating overlays.
- **Hosting:** GitHub Pages, new repo `S1MB10T3/r0s3.me`.

Forces at play: canvas-heavy interactivity (WebGL + Rive) favors an app-like SPA; GitHub Pages offers no server, so routing and image optimization must be build-time or client-side; this is a portfolio for an active job search, so shipping speed and link-shareability matter.

## Decision

Build a **Vite + React + TypeScript SPA** deployed to GitHub Pages via GitHub Actions, with:

1. **Hash-based overlay routing** (`r0s3.me/#caldera` opens the Caldera overlay)
2. **MDX for all overlay content**, with a TSX escape hatch for the one highly bespoke study; archive items are lightweight MDX migrated from the old Jekyll markdown
3. **Motion (Framer Motion)** as the sole animation library for overlay transitions and scroll-linked animation (open source, prior experience)
4. **react-three-fiber + drei** for Three.js, **@rive-app/react-webgl2** (or react-canvas) for Rive
5. **Custom domain** `r0s3.me` via CNAME, replacing the s1mb10t3.net Jekyll site

## Options Considered

### Option A: Vite + React + TypeScript SPA ✅ chosen

| Dimension | Assessment |
|-----------|------------|
| Complexity | Low. Minimal config, no framework conventions to fight |
| Cost | Free (GitHub Pages + Actions) |
| Scalability | Fine for a portfolio; code-splitting handles growth |
| Team familiarity | High. Plain React + TS, no meta-framework learning curve |

**Pros:** Best fit for an app-like single page with persistent WebGL canvas; fastest dev loop for animation-heavy iteration; trivially deployable as static files.
**Cons:** No server-side rendering, so per-case-study SEO and social cards are limited; initial JS bundle needs active management.

### Option B: Next.js (static export)

**Pros:** Real routes with static HTML per case study, better crawlability and OG cards.
**Cons:** `next/image` optimization is disabled in static export, removing the main benefit on Pages; App Router conventions add weight for a one-page site; overlay-over-persistent-canvas is awkward across route boundaries (parallel routes/intercepting routes work but add complexity).

### Option C: Astro + React islands

**Pros:** Best-in-class static output and MDX story.
**Cons:** The site is essentially one big interactive island (persistent Three.js hero, media player, overlay system), which negates Astro's islands advantage. State sharing across islands is friction you don't need.

## Trade-off Analysis

**Hash routing (`#caldera`) vs path routing (`/work/caldera`).** Hash routing is the right call here, and yes, it makes more sense than paths for this site:

- GitHub Pages serves a project SPA from one `index.html`; path-based deep links require the 404-redirect hack or prerendering. Hash URLs need nothing: `r0s3.me/#caldera` always loads `index.html` and the client reads `location.hash`.
- Back/forward buttons work naturally (hash changes push history entries), so closing an overlay via Back behaves as users expect.
- Links are still fully shareable, which is what matters for sending case studies to recruiters.
- The cost: search engines and social scrapers see one page, so every shared link gets the same OG card and case studies are not individually indexed. For a portfolio whose links are shared directly (not discovered via search), this is acceptable. If it ever matters, a build-time prerender step can be added later without changing the architecture.
- Implementation is a ~30-line `useHashRoute()` hook; no router library needed.

**MDX + escape hatch vs all-TSX.** The generic template (156:45827) pins down the component kit, and nearly every overlay page, featured or archive, is an instance of it. An MDX file becomes frontmatter plus a sequence of sections:

```mdx
---
title: To Ashes
header: { type: 'video', src: 'birdy-header.mp4' }   # or type: 'rive'
tags: [art, sculpture]
---

<Intro>            {/* light bg, media player widget, INTRO_01 */}
  Intro copy...
</Intro>

<Section title="design">      {/* dark bg; side rail reads DESIGN_02 (title + position) */}
  ![](./img/burned-top.png)    {/* media is just children: images, YouTube/Vimeo embed, any iframe */}
  Caption copy...
</Section>

<Postmortem>       {/* light bg closer, POSTMORTEM_0n */}
  Closing reflection...
</Postmortem>
```

The template shell handles what MDX shouldn't: the Go Back chip, the rotated side-rail labels, light/dark section backgrounds, and scroll behavior. Side-rail labels combine each section's `title` prop with its auto-numbered position: `<Section title="design">` as the second section renders DESIGN_02, and with no title it falls back to SECTION_0n. Intro and Postmortem label themselves (INTRO_01, POSTMORTEM_0n), so numbering stays correct when sections are added or reordered. The header is frontmatter-driven so a page declares a `.riv` artboard or a video file and gets the same layout. Old Jekyll `_art` files (frontmatter + images + Vimeo embeds) convert into this shape nearly one-to-one. Featured case studies use the same kit with richer section variants where their designs diverge. One registry maps every slug to an MDX module or a bespoke TSX component, so the unique case study opts out cleanly:

```ts
// src/content/registry.ts
export const overlays: Record<string, OverlayEntry> = {
  // featured case studies
  caldera: { kind: 'case', title: 'Caldera', load: () => import('./case/caldera.mdx') },
  espa:    { kind: 'case', title: 'Espa Labs', load: () => import('./case/espa.mdx') },
  hook:    { kind: 'case', title: 'Hook', load: () => import('./case/HookCustom') }, // bespoke TSX
  // archive items (migrated from Jekyll)
  birdy:   { kind: 'archive', title: 'To Ashes', load: () => import('./archive/birdy.mdx') },
  element: { kind: 'archive', title: 'Element Finance', load: () => import('./archive/element.mdx') },
  // ...
}
```

**Motion (Framer Motion) only, no GSAP.** Committed. Motion is MIT-licensed open source and R0K already has hands-on experience with it, which beats theoretical capability. `AnimatePresence` is exactly the right tool for overlay enter/exit, and `useScroll`/`useTransform` cover scroll-linked effects inside case studies. The known trade-off is weaker scroll choreography (no ScrollTrigger-style pinning/scrubbing timelines), so scroll sequences should be designed within what `useScroll` + sticky positioning can express rather than reaching for a second animation library.

**Rive vs Three.js division of labor.** Use Rive for designed 2D motion (logo glitch, media player states, tags/buttons, cursor accents) since you author it in the Rive editor and files are tiny. Reserve Three.js for the hero's 3D moment. Keep exactly one WebGL context for R3F; Rive should use its canvas/WebGL2 renderer instances sparingly (one artboard per active `.riv` mount).

## Proposed Structure

```
r0s3.me/
├── .github/workflows/deploy.yml     # build + deploy to Pages
├── public/
│   ├── CNAME                        # r0s3.me
│   ├── rive/*.riv
│   └── models/*.glb                 # draco-compressed
├── src/
│   ├── main.tsx / App.tsx
│   ├── routes/useHashRoute.ts       # hash <-> overlay state
│   ├── sections/                    # Hero, Featured, Quote, Archive, Footer
│   ├── overlay/                     # overlay shell (scroll lock, focus trap, ESC, Go Back)
│   │   └── template/                # generic page: MediaHeader, Intro, Section, Postmortem
│   ├── components/                  # Tag, Article, Button, SideRail
│   ├── player/                      # MediaPlayer UI + hidden SC widget + mixes.ts config
│   ├── three/                       # R3F canvas + hero scene (lazy)
│   ├── rive/                        # Rive wrapper components
│   ├── content/
│   │   ├── case/                    # featured case study MDX (+ bespoke TSX)
│   │   ├── archive/                 # archive item MDX (migrated from Jekyll)
│   │   └── registry.ts              # slug -> overlay entry
│   └── styles/                      # tokens from Figma variables
└── vite.config.ts                   # @mdx-js/rollup, vite-imagetools
```

Key mechanics:

- **Overlay system:** Home stays mounted under the overlay (Three.js scene keeps its state), `AnimatePresence` animates the case study panel in, body scroll locks, overlay content scrolls in its own container. ESC and Back both close it.
- **Code splitting:** `three`/R3F in a lazy chunk loaded when the hero canvas enters view; each case study's MDX chunk loads on overlay open. Target < 150KB gzipped initial JS before the three chunk.
- **Images:** case studies are image-heavy (Caldera alone has ~15 large blocks). Pre-generate AVIF/WebP with `vite-imagetools`, lazy-load below the fold, explicit dimensions to avoid CLS.
- **Music player:** one hidden SoundCloud widget iframe mounted at the app root, controlled through the SC Widget API (`widget.load(trackUrl)`, `.play()`, `.pause()`, `.setVolume(0)` for mute). Your custom Media Player component (Rive-animated states) is the only visible UI; the mix list lives in a small typed config (`mixes.ts` with title + SoundCloud URL) rendered as the dropdown. Because the widget lives at the root, playback survives opening/closing overlays even though the Media Player renders in multiple places (all instances drive the same global player state via context). Two constraints to design around: browsers block autoplay, so playback must start from a click, and the SC Widget API has no reliable seek-position streaming without the iframe, which is why the hidden-iframe approach beats trying to hit SoundCloud's (effectively closed) direct API.
- **Responsive:** three Figma breakpoints (1512/744/390) map to two CSS breakpoints plus fluid type via `clamp()`. Case studies have no mobile designs yet; the MDX component set should be built mobile-first so desktop-only art direction degrades gracefully.
- **Accessibility:** honor `prefers-reduced-motion` (freeze Rive states, static hero fallback), focus trap in overlay, real `<a href="#caldera">` links for overlay triggers.

## Consequences

**Easier:** iterating on animation (Vite HMR with R3F/Rive); adding case study #4 or a new archive piece (drop in an MDX file + registry entry); deploys (push to main, Actions does the rest).

**Harder:** SEO/social cards per case study (single OG card unless prerendering is added); anything needing a server (forms, analytics need third-party services); maintaining two rendering systems (Rive + Three) within a performance budget on mobile GPUs.

**Revisit later:** prerendering for per-study OG cards; case study mobile designs (currently a gap in Figma); whether old blog posts (`_posts`) come along or get retired.

## Action Items

1. [ ] Scaffold repo: Vite + React + TS, ESLint/Prettier, MDX plugin, deploy workflow, CNAME (`r0s3.me`), DNS A/AAAA records at registrar
2. [ ] Port design tokens from Figma variables (color, type scale, spacing) into CSS custom properties
3. [ ] Build static Home sections against the desktop frame (72:4), then tablet/mobile passes
4. [ ] Implement `useHashRoute` + overlay shell (scroll lock, focus trap, ESC/Back, AnimatePresence transitions)
5. [ ] Build the generic page template from Figma node 156:45827: overlay shell (Go Back chip, side rail with `title` + auto-numbering), frontmatter-driven Rive/video header, `<Intro>`, `<Section title>`, `<Postmortem>` components
6. [ ] Author Espa Labs and Caldera as MDX on the template (adding richer section variants where needed); scope the bespoke study
7. [ ] Migrate `_art`, `_design`, and relevant `_posts` content from the Jekyll repo into `content/archive/*.mdx` (script the frontmatter conversion, move images into the new pipeline)
8. [ ] Build the music player: hidden SoundCloud widget at app root, global player context, mix dropdown from `mixes.ts`, pause/mute controls
9. [ ] Integrate Rive: media player widget states, page headers, + logo animation first
10. [ ] Integrate R3F hero scene (lazy chunk, reduced-motion fallback)
11. [ ] Image pipeline: export from Figma, run through vite-imagetools, audit LCP/CLS; video headers as muted looping MP4/WebM with poster frames
12. [ ] Point r0s3.me DNS, keep s1mb10t3.net live until parity, then redirect
