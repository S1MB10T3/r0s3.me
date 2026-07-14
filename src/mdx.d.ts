declare module '*.mdx' {
  import type { ComponentType } from 'react'
  import type { PageFrontmatter } from './content/types'

  export const frontmatter: PageFrontmatter
  const MDXComponent: ComponentType
  export default MDXComponent
}
