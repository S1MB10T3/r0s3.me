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

export interface OverlayEntry {
  kind: 'case' | 'archive'
  title: string
  /** Lazy import of an MDX module (default export + frontmatter) or bespoke TSX component. */
  load: () => Promise<{ default: ComponentType; frontmatter?: PageFrontmatter }>
  /** Shown on Home (Featured rows / Archive cards); duplicated from frontmatter
      so Home never has to load a page chunk just to render its listing. */
  tags?: string[]
  /** Featured (case) rows only: blurb next to the brand image. */
  description?: string
  /** Archive cards only: mosaic footprint (Figma Frame 1). Defaults to square. */
  card?: 'square' | 'wide' | 'tall'
}
