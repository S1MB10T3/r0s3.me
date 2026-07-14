import { motion, useReducedMotion } from 'motion/react'
import { SocialLinks } from '../components/SocialLinks'
import './sections.css'

/**
 * Hero (Figma 72:5): logo top-left, social links top-right, large centered
 * artwork cropped by the section's bottom edge, designer blurb bottom-right
 * with a rule (72:9). Media player is fixed viewport chrome mounted in App.
 *
 * Layout pass: artwork + logo are black.png placeholders. The lazy R3F
 * HeroScene (src/three/HeroScene.tsx) replaces the artwork in the
 * animations/effects pass.
 */
export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="hero">
      <h1 className="hero__logo">
        <img src="media/black.png" alt="R0S3_ME" />
      </h1>

      <SocialLinks />

      {/* empty slot for now — the lazy R3F HeroScene / video mounts here in
          the animations pass (was a black.png placeholder, too distracting) */}
      <div className="hero__art" />

      <div className="hero__info">
        <motion.span
          className="hero__info-rule"
          aria-hidden="true"
          initial={reduceMotion ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
        />
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        >
          A multidisciplinary designer crafting meaningful experiences at the intersection of art
          and technology.
        </motion.p>
      </div>
    </section>
  )
}
