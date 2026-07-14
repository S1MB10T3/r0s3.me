import { archiveWork } from '../content/registry'
import { Tag } from '../components/Tag'
import './sections.css'

/**
 * Archive mosaic (Figma "Frame 1" / "All Works"): 4-column grid of Article
 * cards (component 118:341); `cell` on the registry entry picks the footprint
 * (default = 1x1, wide = 2 columns, tall = 2 rows).
 */
export function Archive() {
  const items = archiveWork()

  return (
    <section className="archive">
      <div className="archive__grid">
        {items.map(([slug, entry]) => (
          <a
            key={slug}
            href={`#${slug}`}
            className={`article article--${entry.cell ?? 'default'}`}
          >
            <span className="article__image">
              <img src="media/black.png" alt="" />
            </span>
            <span className="article__info">
              <span className="article__title">{entry.title}</span>
              <span className="article__tags">
                {entry.tags?.map((tag) => <Tag key={tag} label={tag} />)}
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
