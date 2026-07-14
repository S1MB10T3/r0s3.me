import type { ComponentType } from 'react'

export type HeaderSpec =
  | { type: 'rive'; src: string; artboard?: string; stateMachine?: string }
  | { type: 'video'; src: string; poster?: string }

export interface PageFrontmatter {
  title: string
  header: HeaderSpec
  tags?: string[]
}

export interface OverlayEntry {
  kind: 'case' | 'archive'
  title: string
  /** Lazy import of an MDX module (default export + frontmatter) or bespoke TSX component. */
  load: () => Promise<{ default: ComponentType; frontmatter?: PageFrontmatter }>
}
