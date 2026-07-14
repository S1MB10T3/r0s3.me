import { overlays } from '../content/registry'
import './sections.css'

/** Featured work rows (Espa Labs, Caldera, Hook) linking to their overlays. */
export function Featured() {
  const featured = Object.entries(overlays).filter(([, entry]) => entry.kind === 'case')

  return (
    <section className="featured">
      {featured.map(([slug, entry]) => (
        <article key={slug} className="featured__row">
          <h2>{entry.title}</h2>
          {/* real <a href> so overlays are shareable + crawlable */}
          <a href={`#${slug}`}>View More</a>
        </article>
      ))}
    </section>
  )
}
