import { useRef, type PointerEvent } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import { archiveWork } from '../content/registry'
import type { OverlayEntry } from '../content/types'
import { Tag } from '../components/Tag'
import './sections.css'

/** How far the oversized image can travel (percent). Paired with scale 1.15. */
const PARALLAX = 6
const SPRING = { stiffness: 220, damping: 24, mass: 0.35 }

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
          <ArchiveArticle key={slug} slug={slug} entry={entry} />
        ))}
      </div>
    </section>
  )
}

function ArchiveArticle({ slug, entry }: { slug: string; entry: OverlayEntry }) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLAnchorElement>(null)

  const progressX = useMotionValue(0)
  const progressY = useMotionValue(0)
  // Invert vs cursor so the crop reads as looking into the image
  const x = useSpring(useTransform(progressX, [-0.5, 0.5], [`${PARALLAX}%`, `-${PARALLAX}%`]), SPRING)
  const y = useSpring(useTransform(progressY, [-0.5, 0.5], [`${PARALLAX}%`, `-${PARALLAX}%`]), SPRING)

  function onPointerMove(e: PointerEvent<HTMLAnchorElement>) {
    if (reduceMotion || !ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    progressX.set((e.clientX - left) / width - 0.5)
    progressY.set((e.clientY - top) / height - 0.5)
  }

  function onPointerLeave() {
    progressX.set(0)
    progressY.set(0)
  }

  return (
    <a
      ref={ref}
      href={`#${slug}`}
      className={`article article--${entry.cell ?? 'default'}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span className="article__image">
        <motion.img
          src="media/black.png"
          alt=""
          style={reduceMotion ? undefined : { x, y, scale: 1.15 }}
        />
      </span>
      <span className="article__info">
        <span className="article__title">{entry.title}</span>
        <span className="article__tags">
          {entry.tags?.map((tag) => <Tag key={tag} label={tag} />)}
        </span>
      </span>
    </a>
  )
}
