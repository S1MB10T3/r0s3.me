import type { OverlayEntry } from './types'

/**
 * Slug -> overlay page (ADR-001). Hash routing: r0s3.me/#caldera.
 * Featured case studies + archive items both render through the generic
 * template; bespoke pages point at a TSX module instead of MDX.
 */
export const overlays: Record<string, OverlayEntry> = {
  // featured case studies
  espa: { kind: 'case', title: 'Espa Labs', load: () => import('./case/espa.mdx') },
  caldera: { kind: 'case', title: 'Caldera', load: () => import('./case/caldera.mdx') },
  hook: { kind: 'case', title: 'Hook', load: () => import('./case/hook.mdx') },

  // archive items migrated from the old Jekyll repo (_design, then _art;
  // _posts blog content is still undecided, see ADR-001)
  element: { kind: 'archive', title: 'Element Finance', load: () => import('./archive/element.mdx') },
  salesforce: { kind: 'archive', title: 'Salesforce Bootcamp Simulation', load: () => import('./archive/salesforce.mdx') },
  '20xx': { kind: 'archive', title: '20XX Magazine', load: () => import('./archive/20xx.mdx') },
  cozy: { kind: 'archive', title: 'cozy.nyc', load: () => import('./archive/cozy.mdx') },
  nyfmf: { kind: 'archive', title: 'NYFMF Redesign', load: () => import('./archive/nyfmf.mdx') },
  faces: { kind: 'archive', title: 'FACE(S)', load: () => import('./archive/faces.mdx') },
  cyborg: { kind: 'archive', title: 'Cyborgs. Robots. and Automotons.', load: () => import('./archive/cyborg.mdx') },
  flowerpot: { kind: 'archive', title: 'Untitled 12.13.19', load: () => import('./archive/flowerpot.mdx') },
  birdy: { kind: 'archive', title: 'To Ashes', load: () => import('./archive/birdy.mdx') },
  fractured: { kind: 'archive', title: 'Fractured', load: () => import('./archive/fractured.mdx') },
}
