import type { ReactNode } from 'react'

/** Light intro section — INTRO_01 on the side rail. Media player is fixed App chrome. */
export function Intro({ children }: { children: ReactNode }) {
  return (
    <section className="page-section page-section--light">
      <div className="page-section__railtrack">
        <span className="page-section__rail">INTRO</span>
      </div>
      <div className="page-section__body">{children}</div>
    </section>
  )
}
