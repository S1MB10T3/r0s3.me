/** Minimal typings for the SoundCloud Widget API (https://developers.soundcloud.com/docs/api/html5-widget). */
interface SCWidget {
  load(url: string, options?: { auto_play?: boolean; callback?: () => void }): void
  play(): void
  pause(): void
  toggle(): void
  setVolume(volume: number): void // 0..100
  bind(event: string, listener: (data?: unknown) => void): void
  unbind(event: string): void
}

interface SCWidgetFactory {
  (element: HTMLIFrameElement | string): SCWidget
  Events: {
    READY: string
    PLAY: string
    PAUSE: string
    FINISH: string
  }
}

interface Window {
  SC?: { Widget: SCWidgetFactory }
}
