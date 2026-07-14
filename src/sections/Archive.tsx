import { overlays } from '../content/registry'
import './sections.css'

/** Archive grid (Figma: Frame 1) — every item opens its own overlay page. */
export function Archive() {
  const items = Object.entries(overlays).filter(([, entry]) => entry.kind === 'archive')

  return (
    <section className="archive">
      <div className="archive__grid">
        {items.map(([slug, entry]) => (
          <a key={slug} href={`#${slug}`} className="archive__item">
            {entry.title}
          </a>
        ))}
      </div>
    </section>
  )
}
