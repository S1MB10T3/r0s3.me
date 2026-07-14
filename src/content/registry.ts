import type { OverlayEntry } from './types'

/**
 * Slug -> overlay page (ADR-001). Hash routing: r0s3.me/#caldera.
 * Featured case studies + archive items both render through the generic
 * template; bespoke pages point at a TSX module instead of MDX.
 */
export const overlays: Record<string, OverlayEntry> = {
  // featured case studies
  espa: {
    kind: 'case',
    title: 'Espa Labs',
    tags: ['Product'],
    description:
      'About Espa helps teams move faster by streamlining collaboration and eliminating ' +
      'friction. Built for modern workflows, it adapts to how you work, not the other way around.',
    load: () => import('./case/espa.mdx'),
  },
  caldera: {
    kind: 'case',
    title: 'Caldera',
    tags: ['Product', 'Art Direction', 'Branding'],
    description:
      'AWS of Blockchains. Caldera host L2 chains and provides tools to help with the Metalayer ' +
      'Access shared liquidity, enable cross-chain interactions, and reach users across the ' +
      'entire Caldera ecosystem, and beyond.',
    load: () => import('./case/caldera.mdx'),
  },
  hook: {
    kind: 'case',
    title: 'Hook',
    tags: ['Product', 'Art Direction', 'Branding'],
    description: 'Options and Perpetuals DEX for NFT and other long-tail token access.',
    load: () => import('./case/hook.mdx'),
  },

  // archive items migrated from the old Jekyll repo (_design, then _art;
  // _posts blog content is still undecided, see ADR-001)
  element: { kind: 'archive', title: 'Element Finance', tags: ['UI/UX', 'Branding'], card: 'wide', load: () => import('./archive/element.mdx') },
  salesforce: { kind: 'archive', title: 'Salesforce Bootcamp Simulation', tags: ['UX/UI'], load: () => import('./archive/salesforce.mdx') },
  '20xx': { kind: 'archive', title: '20XX Magazine', tags: ['UX/UI'], card: 'wide', load: () => import('./archive/20xx.mdx') },
  cozy: { kind: 'archive', title: 'cozy.nyc', tags: ['UX/UI', 'React'], load: () => import('./archive/cozy.mdx') },
  nyfmf: { kind: 'archive', title: 'NYFMF Redesign', tags: ['UX/UI'], load: () => import('./archive/nyfmf.mdx') },
  faces: { kind: 'archive', title: 'FACE(S)', tags: ['Short Film'], card: 'tall', load: () => import('./archive/faces.mdx') },
  cyborg: { kind: 'archive', title: 'Cyborgs. Robots. and Automotons.', tags: ['Art'], load: () => import('./archive/cyborg.mdx') },
  flowerpot: { kind: 'archive', title: 'Untitled 12.13.19', tags: ['Art'], load: () => import('./archive/flowerpot.mdx') },
  birdy: { kind: 'archive', title: 'To Ashes', tags: ['Art'], load: () => import('./archive/birdy.mdx') },
  fractured: { kind: 'archive', title: 'Fractured', tags: ['Art'], load: () => import('./archive/fractured.mdx') },
}
