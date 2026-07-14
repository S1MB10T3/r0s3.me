import { useEffect, useRef, useState, type ComponentType } from 'react'
import { motion } from 'motion/react'
import { MDXProvider } from '@mdx-js/react'
import type { OverlayEntry, PageFrontmatter } from '../content/types'
import { Intro } from './template/Intro'
import { Section } from './template/Section'
import { Postmortem } from './template/Postmortem'
import { MediaHeader } from './template/MediaHeader'
import './overlay.css'

const mdxComponents = { Intro, Section, Postmortem }

interface LoadedPage {
  Component: ComponentType
  frontmatter?: PageFrontmatter
}

interface Props {
  slug: string
  entry: OverlayEntry
  onClose: () => void
}

/**
 * Overlay shell (ADR-001): renders a case study / archive page above Home.
 * Owns scroll lock, ESC-to-close, focus management, the Go Back chip, and the
 * frontmatter-driven Rive/video header. Content is a lazily loaded MDX (or
 * bespoke TSX) module.
 */
export function OverlayRoot({ slug, entry, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState<LoadedPage | null>(null)

  useEffect(() => {
    let cancelled = false
    entry.load().then((mod) => {
      if (!cancelled) setPage({ Component: mod.default, frontmatter: mod.frontmatter })
    })
    return () => {
      cancelled = true
    }
  }, [entry])

  // scroll lock while any overlay is open
  useEffect(() => {
    document.body.classList.add('overlay-open')
    return () => document.body.classList.remove('overlay-open')
  }, [])

  // ESC closes; move focus into the overlay on open
  useEffect(() => {
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label={entry.title}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
    >
      <button className="overlay__back" onClick={onClose}>
        ← Go Back
      </button>
      <div className="overlay__scroll" ref={panelRef} tabIndex={-1} data-overlay-slug={slug}>
        {page ? (
          <article className="page">
            {page.frontmatter?.header && <MediaHeader header={page.frontmatter.header} />}
            <MDXProvider components={mdxComponents}>
              <page.Component />
            </MDXProvider>
          </article>
        ) : (
          <div className="overlay__loading">LOADING_{slug.toUpperCase()}</div>
        )}
      </div>
    </motion.div>
  )
}
