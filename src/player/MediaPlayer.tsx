import { usePlayer } from './PlayerProvider'
import './media-player.css'

/**
 * The Media Player widget from Figma (145:45782): EQ bars, mix dropdown, mute.
 * Fixed to the viewport (48 / 48 desktop). Purely presentational — all state
 * lives in PlayerProvider. Mount once at App root.
 * TODO: replace the bars glyph + states with the Rive animation.
 */
export function MediaPlayer() {
  const { mixes, current, playing, muted, selectMix, togglePlay, toggleMute } = usePlayer()

  return (
    <div className="media-player">
      <button
        className={`media-player__play${playing ? ' media-player__play--playing' : ''}`}
        onClick={togglePlay}
        aria-label={playing ? 'Pause mix' : 'Play mix'}
        type="button"
      >
        <svg className="media-player__eq" viewBox="0 0 64 64" aria-hidden="true">
          <rect className="media-player__eq-bar" x="12" y="35.333" width="9.455" height="16.667" rx="4.727" />
          <rect className="media-player__eq-bar" x="27.273" y="12" width="9.455" height="40" rx="4.727" />
          <rect className="media-player__eq-bar" x="42.545" y="26" width="9.455" height="26" rx="4.727" />
        </svg>
      </button>

      <div className="media-player__track">
        <span className="media-player__title">{current.title}</span>
        <svg className="media-player__chevron" viewBox="0 0 16 10" aria-hidden="true">
          <path
            d="M1 1L7.741 9L15 1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <select
          className="media-player__select"
          value={current.id}
          onChange={(e) => selectMix(e.target.value)}
          aria-label="Choose a mix"
        >
          {mixes.map((mix) => (
            <option key={mix.id} value={mix.id}>
              {mix.title}
            </option>
          ))}
        </select>
      </div>

      <button
        className={`media-player__mute${muted ? ' media-player__mute--muted' : ''}`}
        onClick={toggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
        type="button"
      >
        <svg className="media-player__speaker" viewBox="0 0 33 34" aria-hidden="true">
          <path d="M10 14.405C10 13.891 10.389 13.461 10.9 13.41L14.859 13.014C14.953 13.005 15.044 12.982 15.131 12.948L21.129 10.549C21.786 10.286 22.5 10.77 22.5 11.477V22.523C22.5 23.23 21.786 23.714 21.129 23.451L15.131 21.053C15.044 21.018 14.953 20.995 14.859 20.986L10.9 20.59C10.389 20.539 10 20.109 10 19.595V14.405Z" />
        </svg>
      </button>
    </div>
  )
}
