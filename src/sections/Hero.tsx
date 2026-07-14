import { SocialLinks } from '../components/SocialLinks'
import './sections.css'

/**
 * Hero (Figma 72:5): logo top-left, social links top-right, large centered
 * artwork cropped by the section's bottom edge, designer blurb bottom-right
 * with a rule. Media player is fixed viewport chrome mounted in App.
 *
 * Layout pass: artwork + logo are black.png placeholders. The lazy R3F
 * HeroScene (src/three/HeroScene.tsx) replaces the artwork in the
 * animations/effects pass.
 */
export function Hero() {
  return (
    <section className="hero">
      <h1 className="hero__logo">
        <img src="media/black.png" alt="R0S3_ME" />
      </h1>

      <SocialLinks />

      <div className="hero__art">
        <img src="media/black.png" alt="" />
      </div>

      <div className="hero__info">
        <p>
          A multidisciplinary designer crafting meaningful experiences at the intersection of art
          and technology.
        </p>
      </div>
    </section>
  )
}
