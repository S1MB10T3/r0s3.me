import { overlays } from '../content/registry'
import { Tag } from '../components/Tag'
import './sections.css'

/* Article-image strip widths per row, from Figma (Work instances 103:105,
   105:106, 105:192). Placeholder blocks until real screenshots land. */
const STRIP_WIDTHS = [
  [393, 340, 248, 248],
  [427, 360, 360, 360],
  [286, 427, 426, 212],
]

/**
 * Featured work rows (Figma 82:105): per row a header (title + tags left,
 * View More right) and a content band of brand image, bottom-aligned
 * description, and a horizontally scrolling image strip.
 */
export function Featured() {
  const featured = Object.entries(overlays).filter(([, entry]) => entry.kind === 'case')

  return (
    <section className="featured">
      {featured.map(([slug, entry], row) => (
        <article key={slug} className="work">
          <header className="work__header">
            <div className="work__info">
              <h2 className="work__title">{entry.title}</h2>
              {entry.tags?.map((tag) => <Tag key={tag} label={tag} />)}
            </div>
            {/* real <a href> so overlays are shareable + crawlable */}
            <a className="work__more" href={`#${slug}`}>
              View More <span aria-hidden="true">&rarr;</span>
            </a>
          </header>

          <div className="work__content">
            <a className="work__brand" href={`#${slug}`} aria-label={entry.title}>
              <img src="media/black.png" alt="" />
            </a>
            <div className="work__description">
              <p>{entry.description}</p>
            </div>
            <div className="work__strip">
              {(STRIP_WIDTHS[row % STRIP_WIDTHS.length] ?? []).map((width, i) => (
                <img key={i} src="media/black.png" alt="" style={{ width }} />
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
