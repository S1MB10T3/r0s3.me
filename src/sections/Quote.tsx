import './sections.css'

/**
 * Typographic quote section (Figma "Frame 5"): a large centered graphic
 * (black.png placeholder for the wireframe artwork) with the quote overlaid.
 */
export function Quote() {
  return (
    <section className="quote">
      <img className="quote__art" src="/media/black.png" alt="" />
      <blockquote>
        &ldquo;No longer structured by the polarity of public and private, the cyborg defines a
        technological polis based partly on a revolution of social relations in the oikos, the
        household. Nature and culture are reworked;&rdquo;
      </blockquote>
    </section>
  )
}
