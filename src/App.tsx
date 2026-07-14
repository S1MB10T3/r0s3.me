import { AnimatePresence } from 'motion/react'
import { useHashRoute } from './routes/useHashRoute'
import { overlays } from './content/registry'
import { OverlayRoot } from './overlay/OverlayRoot'
import { PlayerProvider } from './player/PlayerProvider'
import { MediaPlayer } from './player/MediaPlayer'
import { Hero } from './sections/Hero'
import { Featured } from './sections/Featured'
import { Quote } from './sections/Quote'
import { Archive } from './sections/Archive'
import { Footer } from './sections/Footer'

export default function App() {
  const { slug, close } = useHashRoute()
  const entry = slug ? overlays[slug] : undefined

  return (
    <PlayerProvider>
      {/* Home stays mounted beneath overlays so canvas/audio state persists */}
      <main aria-hidden={entry ? true : undefined}>
        <Hero />
        <Featured />
        <Quote />
        <Archive />
        <Footer />
      </main>

      <AnimatePresence>
        {entry && <OverlayRoot key={slug} slug={slug} entry={entry} onClose={close} />}
      </AnimatePresence>

      {/* Fixed viewport chrome — outside main so it stays reachable over overlays */}
      <MediaPlayer />
    </PlayerProvider>
  )
}
