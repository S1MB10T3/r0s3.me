import { Suspense, lazy } from 'react'
import { MediaPlayer } from '../player/MediaPlayer'
import './sections.css'

// three/R3F stays in its own lazy chunk (ADR-001 performance budget)
const HeroScene = lazy(() => import('../three/HeroScene'))

export function Hero() {
  return (
    <section className="hero">
      <h1 className="hero__logo">R0S3_ME</h1>
      <div className="hero__canvas">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>
      <p className="hero__tagline">
        A multidisciplinary designer crafting meaningful experiences at the intersection of art and
        technology.
      </p>
      <MediaPlayer />
    </section>
  )
}
