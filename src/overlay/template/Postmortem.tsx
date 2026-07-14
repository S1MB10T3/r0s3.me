import type { ReactNode } from 'react'

/** Light closing section — POSTMORTEM_0n on the side rail. */
export function Postmortem({ children }: { children: ReactNode }) {
  return (
    <section className="page-section page-section--light">
      <span className="page-section__rail">POSTMORTEM</span>
      <div className="page-section__body">{children}</div>
    </section>
  )
}
