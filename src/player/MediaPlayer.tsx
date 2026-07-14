import { usePlayer } from './PlayerProvider'
import './media-player.css'

/**
 * The Media Player widget from Figma (pill: bars icon, mix dropdown, mute).
 * Fixed to the viewport (48 / 48 desktop). Purely presentational — all state
 * lives in PlayerProvider. Mount once at App root.
 * TODO: replace the bars glyph + states with the Rive animation.
 */
export function MediaPlayer() {
  const { mixes, current, playing, muted, selectMix, togglePlay, toggleMute } = usePlayer()

  return (
    <div className="media-player">
      <button
        className="media-player__play"
        onClick={togglePlay}
        aria-label={playing ? 'Pause mix' : 'Play mix'}
      >
        {playing ? '❚❚' : '▶'}
      </button>

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

      <button
        className="media-player__mute"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}
