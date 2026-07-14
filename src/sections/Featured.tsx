import { featuredWork, headerPreview } from '../content/registry'
import { Tag } from '../components/Tag'
import './sections.css'

/* Article-image strip widths per row, from Figma (Work instances 103:105,
   105:106, 105:192). Filled from the page's `images` frontmatter list. */
const STRIP_WIDTHS = [
  [393, 340, 248, 248],
  [427, 360, 360, 360],
  [286, 427, 426, 212],
]

/**
 * Featured work rows (Figma 82:105): per row a header (title + tags left,
 * View More right) and a content band (brand image, bottom-aligned
 * description, image strip) that scrolls horizontally as one unit.
 */
export function Featured() {
  const featured = featuredWork()

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
              <img src={headerPreview(entry.header)} alt="" />
            </a>
            <div className="work__description">
              <p>{entry.description}</p>
            </div>
            <div className="work__strip">
              {(STRIP_WIDTHS[row % STRIP_WIDTHS.length] ?? []).map((width, i) => {
                const images = entry.images
                const src = images?.length ? images[i % images.length] : 'media/black.png'
                return <img key={i} src={src} alt="" style={{ width }} />
              })}
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
