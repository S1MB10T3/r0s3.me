import type { ComponentType } from 'react'

export type HeaderSpec =
  | { type: 'rive'; src: string; artboard?: string; stateMachine?: string }
  | { type: 'video'; src: string; poster?: string }
  | { type: 'image'; src: string; alt?: string }

export interface PageFrontmatter {
  title: string
  header?: HeaderSpec
  tags?: string[]
}

/** Archive card footprint (Figma "Article" component 118:341):
    default = 1x1 cell, wide = 2x1, tall = 1x2. */
export type CellType = 'default' | 'wide' | 'tall'

export interface OverlayEntry {
  title: string
  /** Featured entries render as the big Work rows at the top of Home;
      everything else lands in the archive grid. */
  featured?: boolean
  /** Manual ordering on Home: higher numbers sort first (featured rows and
      archive grid sort independently). */
  priority: number
  /** Lazy import of an MDX module (default export + frontmatter) or bespoke TSX component. */
  load: () => Promise<{ default: ComponentType; frontmatter?: PageFrontmatter }>
  /** Shown on Home (Featured rows / Archive cards); duplicated from frontmatter
      so Home never has to load a page chunk just to render its listing. */
  tags?: string[]
  /** Featured rows only: blurb next to the brand image. */
  description?: string
  /** Archive cards only: mosaic footprint. Defaults to 'default' (1x1). */
  cell?: CellType
}
