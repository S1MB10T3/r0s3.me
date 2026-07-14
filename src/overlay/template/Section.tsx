import type { ReactNode } from 'react'

interface Props {
  /**
   * Side-rail label text. `<Section title="design">` as the 2nd section
   * renders DESIGN_02. Falls back to SECTION_0n when omitted. Numbering is a
   * CSS counter (see overlay.css) so reordering sections never breaks labels.
   */
  title?: string
  children: ReactNode
}

/** Dark content section. Media is plain MDX children: images, YouTube/Vimeo embeds, any iframe. */
export function Section({ title = 'section', children }: Props) {
  return (
    <section className="page-section page-section--dark">
      <div className="page-section__railtrack">
        <span className="page-section__rail">{title}</span>
      </div>
      <div className="page-section__body">{children}</div>
    </section>
  )
}
