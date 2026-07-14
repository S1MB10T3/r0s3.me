import type { ReactNode } from 'react'

/**
 * Full-viewport media escape hatch. Section media is capped at 940px by
 * default (Figma template 156:45827); wrap an image/video in <Bleed> when a
 * page wants it edge to edge:
 *
 *   <Bleed>![Alt text](media/slug/shot.webp)</Bleed>
 */
export function Bleed({ children }: { children: ReactNode }) {
  return <div className="page-bleed">{children}</div>
}
