import type { ComponentType } from 'react'
import type { OverlayEntry, PageFrontmatter } from './types'

type PageModule = { default: ComponentType; frontmatter?: PageFrontmatter }

/**
 * The registry is derived, not written by hand (ADR-001). Every page module
 * in src/content/work/ carries its own metadata: MDX pages via YAML
 * frontmatter, bespoke TSX pages via an exported `frontmatter` const.
 * Adding a page = dropping a file in work/; the slug is the filename and the
 * overlay is live at /#slug.
 */

// lazy imports — each page stays in its own code-split chunk
const pages = import.meta.glob<PageModule>('./work/*.{mdx,tsx}')

// metadata only, eagerly — served by the page-meta Vite plugin (see
// vite.config.ts), so Home can list every page without pulling any page
// body into the main chunk
const metas = import.meta.glob<PageFrontmatter>('./work/*.{mdx,tsx}', {
  eager: true,
  import: 'default',
  query: '?page-meta',
})

const slugOf = (path: string) => path.replace('./work/', '').replace(/\.(mdx|tsx)$/, '')

export const overlays: Record<string, OverlayEntry> = Object.fromEntries(
  Object.entries(metas).map(([path, meta]) => [slugOf(path), { ...meta, load: pages[path] }]),
)

type Entry = [slug: string, entry: OverlayEntry]

const byPriority = ([, a]: Entry, [, b]: Entry) => (b.priority ?? 0) - (a.priority ?? 0)

/** Featured Work rows on Home, highest priority first. */
export const featuredWork = (): Entry[] =>
  Object.entries(overlays).filter(([, e]) => e.featured).sort(byPriority)

/** Archive grid on Home (everything not featured), highest priority first. */
export const archiveWork = (): Entry[] =>
  Object.entries(overlays).filter(([, e]) => !e.featured).sort(byPriority)
