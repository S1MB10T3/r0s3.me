import type { ReactNode } from 'react'
import { MediaPlayer } from '../../player/MediaPlayer'

/** Light intro section — INTRO_01 on the side rail, media player widget included. */
export function Intro({ children }: { children: ReactNode }) {
  return (
    <section className="page-section page-section--light">
      <span className="page-section__rail">INTRO</span>
      <MediaPlayer />
      <div className="page-section__body">{children}</div>
    </section>
  )
}
