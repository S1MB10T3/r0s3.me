/** Two-column social link block (Figma "Frame 4") — hero top-right + footer right. */
const COLUMNS: { label: string; href: string }[][] = [
  [
    // CHANGE-ME: real profile URLs
    { label: 'Twitter', href: 'https://x.com/r0s3_me' },
    { label: 'Bluesky', href: 'https://bsky.app/profile/s1mmy.bsky.social' },
  ],
  [
    { label: 'Are.na', href: 'https://www.are.na/r0s3-me/' },
    { label: 'Instagram', href: 'https://www.instagram.com/r0s3.me/' },
    { label: 'Soundcloud', href: 'https://soundcloud.com/r0s3_me' },
  ],
]

export function SocialLinks() {
  return (
    <nav className="social" aria-label="Social links">
      {COLUMNS.map((column, i) => (
        <div key={i} className="social__column">
          {column.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
              <span aria-hidden="true">&larr; </span>
              {link.label}
            </a>
          ))}
        </div>
      ))}
    </nav>
  )
}
