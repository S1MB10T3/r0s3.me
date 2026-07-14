---
name: verify
description: Build, run, and visually verify this site's pages and overlays end to end with Playwright against the vite dev server.
---

# Verifying r0s3.me changes

GUI surface: vite dev server + Playwright Chromium.

## Launch

```bash
npm install                      # fresh containers start without node_modules
npm run dev -- --port 5199 &     # ready in ~2s
```

## Drive

Playwright-core is a devDependency; the remote env pre-installs Chromium:

```js
import { chromium } from 'file:///<repo>/node_modules/playwright-core/index.mjs'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
```

(Absolute `file://` import because scripts usually live outside the repo;
bare `import 'playwright-core'` won't resolve from a scratchpad.)

- Case study overlays: goto `http://localhost:5199/#<slug>` directly.
- Overlays scroll in `.overlay__scroll`, NOT the window — scroll via
  `document.querySelector('.overlay__scroll').scrollTo(...)`.
- Overlay exit animation is 0.6s; wait ~700ms after navigation before
  querying the DOM or the outgoing overlay is still mounted.
- Desktop design viewport is 1512 wide; also check ~390 wide (no mobile
  designs in Figma yet, but nothing may overlap the fixed player chip
  bottom-left).
- Assert no `pageerror` console events: Motion scroll-effect bugs crash the
  whole React tree silently (blank page, no overlay).

## Gotchas

- Rive WASM loads from unpkg/jsdelivr; the remote sandbox proxy blocks those
  CDNs, so Rive headers error in console. Environment noise, not a bug.
- SoundCloud widget likewise fails to load (ERR_TUNNEL_CONNECTION_FAILED).
