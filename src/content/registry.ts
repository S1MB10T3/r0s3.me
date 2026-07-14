import type { OverlayEntry } from './types'

/**
 * Slug -> overlay page (ADR-001). Hash routing: r0s3.me/#caldera.
 * All pages live in src/content/work/. `featured: true` puts an entry in the
 * big Work rows on Home; everything else renders in the archive grid.
 * `priority` is the manual sort: higher numbers appear first within each
 * group. `cell` picks the archive card footprint (default / wide / tall).
 */
export const overlays: Record<string, OverlayEntry> = {
  // featured (the top Work rows: Espa, Caldera, Hook)
  espa: {
    featured: true,
    priority: 100,
    title: 'Espa Labs',
    tags: ['Product'],
    description:
      'About Espa helps teams move faster by streamlining collaboration and eliminating ' +
      'friction. Built for modern workflows, it adapts to how you work, not the other way around.',
    load: () => import('./work/espa.mdx'),
  },
  caldera: {
    featured: true,
    priority: 90,
    title: 'Caldera',
    tags: ['Product', 'Art Direction', 'Branding'],
    description:
      'AWS of Blockchains. Caldera host L2 chains and provides tools to help with the Metalayer ' +
      'Access shared liquidity, enable cross-chain interactions, and reach users across the ' +
      'entire Caldera ecosystem, and beyond.',
    load: () => import('./work/caldera.mdx'),
  },
  hook: {
    featured: true,
    priority: 80,
    title: 'Hook',
    tags: ['Product', 'Art Direction', 'Branding'],
    description: 'Options and Perpetuals DEX for NFT and other long-tail token access.',
    load: () => import('./work/hook.mdx'),
  },

  // archive grid (migrated from the old Jekyll repo; _posts still undecided, see ADR-001)
  element: { priority: 100, title: 'Element Finance', tags: ['UI/UX', 'Branding'], cell: 'wide', load: () => import('./work/element.mdx') },
  salesforce: { priority: 95, title: 'Salesforce Bootcamp Simulation', tags: ['UX/UI'], load: () => import('./work/salesforce.mdx') },
  '20xx': { priority: 90, title: '20XX Magazine', tags: ['UX/UI'], cell: 'wide', load: () => import('./work/20xx.mdx') },
  cozy: { priority: 85, title: 'cozy.nyc', tags: ['UX/UI', 'React'], load: () => import('./work/cozy.mdx') },
  nyfmf: { priority: 80, title: 'NYFMF Redesign', tags: ['UX/UI'], load: () => import('./work/nyfmf.mdx') },
  faces: { priority: 75, title: 'FACE(S)', tags: ['Short Film'], cell: 'tall', load: () => import('./work/faces.mdx') },
  cyborg: { priority: 70, title: 'Cyborgs. Robots. and Automotons.', tags: ['Art'], load: () => import('./work/cyborg.mdx') },
  flowerpot: { priority: 65, title: 'Untitled 12.13.19', tags: ['Art'], load: () => import('./work/flowerpot.mdx') },
  birdy: { priority: 60, title: 'To Ashes', tags: ['Art'], load: () => import('./work/birdy.mdx') },
  fractured: { priority: 55, title: 'Fractured', tags: ['Art'], load: () => import('./work/fractured.mdx') },
}

type Entry = [slug: string, entry: OverlayEntry]

const byPriority = ([, a]: Entry, [, b]: Entry) => b.priority - a.priority

/** Featured Work rows on Home, highest priority first. */
export const featuredWork = (): Entry[] =>
  Object.entries(overlays).filter(([, e]) => e.featured).sort(byPriority)

/** Archive grid on Home (everything not featured), highest priority first. */
export const archiveWork = (): Entry[] =>
  Object.entries(overlays).filter(([, e]) => !e.featured).sort(byPriority)
