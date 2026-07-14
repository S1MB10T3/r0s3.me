import type { ComponentType } from 'react'

export type HeaderSpec =
  | { type: 'rive'; src: string; artboard?: string; stateMachine?: string }
  | { type: 'video'; src: string; poster?: string }
  | { type: 'image'; src: string; alt?: string }

/** Archive card footprint (Figma "Article" component 118:341):
    default = 1x1 cell, wide = 2x1, tall = 1x2. */
export type CellType = 'default' | 'wide' | 'tall'

/**
 * Every page module (MDX frontmatter, or an exported `frontmatter` const in
 * bespoke TSX pages) is the single source of truth for its own metadata.
 * The registry derives the Home listings from these.
 */
export interface PageFrontmatter {
  title: string
  header?: HeaderSpec
  /** Shown on Home listings (Featured rows / Archive cards). */
  tags?: string[]
  /** True = big Work row at the top of Home; absent/false = archive grid. */
  featured?: boolean
  /** Manual ordering on Home: higher numbers sort first (featured rows and
      archive grid sort independently). Defaults to 0. */
  priority?: number
  /** Featured rows only: blurb next to the brand image. */
  description?: string
  /** Featured rows only: case study images, in page order. Home cycles
      these through the image strip under the brand image. */
  images?: string[]
  /** Archive cards only: mosaic footprint. Defaults to 'default' (1x1). */
  cell?: CellType
}

export interface OverlayEntry extends PageFrontmatter {
  /** Lazy import of the page module (MDX or bespoke TSX). */
  load: () => Promise<{ default: ComponentType; frontmatter?: PageFrontmatter }>
}
