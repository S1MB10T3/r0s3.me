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

  // archive items — migrate from the old Jekyll repo (_art, _design, _posts)
  birdy: { kind: 'archive', title: 'To Ashes', load: () => import('./archive/birdy.mdx') },
}
