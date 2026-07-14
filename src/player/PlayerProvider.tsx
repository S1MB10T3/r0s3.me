/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { mixes, type Mix } from './mixes'

/**
 * Global music player (ADR-001): one hidden SoundCloud widget iframe lives at
 * the app root, controlled via the SC Widget API. Every MediaPlayer UI
 * instance drives this shared state, so audio persists across overlays.
 * Mixes autoplay on load while muted; unmute (or play, if the browser blocked
 * muted autoplay) requires a user gesture.
 */

interface PlayerState {
  mixes: Mix[]
  current: Mix
  playing: boolean
  muted: boolean
  selectMix: (id: string) => void
  togglePlay: () => void
  toggleMute: () => void
}

const PlayerContext = createContext<PlayerState | null>(null)

const WIDGET_API = 'https://w.soundcloud.com/player/api.js'
const embedSrc = (url: string) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&visual=false&show_teaser=false&auto_play=true`

export function PlayerProvider({ children }: { children: ReactNode }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const widgetRef = useRef<SCWidget | null>(null)
  const mutedRef = useRef(true)
  const [current, setCurrent] = useState<Mix>(mixes[0])
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  mutedRef.current = muted

  // load the widget API script once, then bind the hidden iframe
  useEffect(() => {
    let cancelled = false

    const init = () => {
      if (cancelled || !iframeRef.current || !window.SC) return
      const widget = window.SC.Widget(iframeRef.current)
      widget.bind(window.SC.Widget.Events.READY, () => {
        if (cancelled) return
        widget.setVolume(0)
        widget.play()
      })
      widget.bind(window.SC.Widget.Events.PLAY, () => setPlaying(true))
      widget.bind(window.SC.Widget.Events.PAUSE, () => setPlaying(false))
      widget.bind(window.SC.Widget.Events.FINISH, () => setPlaying(false))
      widgetRef.current = widget
    }

    if (window.SC) {
      init()
    } else {
      const script = document.createElement('script')
      script.src = WIDGET_API
      script.async = true
      script.onload = init
      document.head.appendChild(script)
    }

    return () => {
      cancelled = true
    }
  }, [])

  const selectMix = useCallback(
    (id: string) => {
      const mix = mixes.find((m) => m.id === id)
      if (!mix || mix.id === current.id) return
      setCurrent(mix)
      widgetRef.current?.load(mix.url, {
        auto_play: playing,
        callback: () => {
          widgetRef.current?.setVolume(mutedRef.current ? 0 : 100)
        },
      })
    },
    [current.id, playing],
  )

  const togglePlay = useCallback(() => {
    widgetRef.current?.toggle()
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      widgetRef.current?.setVolume(m ? 100 : 0)
      return !m
    })
  }, [])

  return (
    <PlayerContext.Provider value={{ mixes, current, playing, muted, selectMix, togglePlay, toggleMute }}>
      {children}
      {/* hidden SoundCloud widget — the custom MediaPlayer UI is the only visible control */}
      <iframe
        ref={iframeRef}
        title="soundcloud-player"
        src={embedSrc(current.url)}
        allow="autoplay"
        style={{ position: 'absolute', width: 0, height: 0, border: 0, visibility: 'hidden' }}
      />
    </PlayerContext.Provider>
  )
}

export function usePlayer(): PlayerState {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>')
  return ctx
}
