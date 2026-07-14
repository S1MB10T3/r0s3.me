import { useRive } from '@rive-app/react-canvas'
import type { HeaderSpec } from '../../content/types'

/**
 * Full-bleed page header driven by frontmatter: a Rive artboard or a
 * muted looping video (ADR-001, generic template 156:45827).
 */
export function MediaHeader({ header }: { header: HeaderSpec }) {
  return (
    <header className="page-header">
      {header.type === 'video' ? (
        <video src={header.src} poster={header.poster} autoPlay muted loop playsInline />
      ) : header.type === 'image' ? (
        <img src={header.src} alt={header.alt ?? ''} />
      ) : (
        <RiveHeader src={header.src} artboard={header.artboard} stateMachine={header.stateMachine} />
      )}
    </header>
  )
}

function RiveHeader({
  src,
  artboard,
  stateMachine,
}: {
  src: string
  artboard?: string
  stateMachine?: string
}) {
  const { RiveComponent } = useRive({
    src,
    artboard,
    stateMachines: stateMachine,
    autoplay: true,
  })
  return <RiveComponent style={{ width: '100%', height: '60vh' }} />
}
