import './sections.css'

/**
 * Typographic quote section (Figma "Frame 5"): the quote overlaid on a large
 * centered graphic. The graphic slot (.quote__art) is empty for now — a video
 * or 3D/shader piece fills it in the animations pass.
 */
export function Quote() {
  return (
    <section className="quote">
      <div className="quote__art" />
      <blockquote>
        &ldquo;No longer structured by the polarity of public and private, the cyborg defines a
        technological polis based partly on a revolution of social relations in the oikos, the
        household. Nature and culture are reworked;&rdquo;
      </blockquote>
    </section>
  )
}
