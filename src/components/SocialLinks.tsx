/** Two-column social link block (Figma "Frame 4") — hero top-right + footer right. */
const COLUMNS: { label: string; href: string }[][] = [
  [
    // CHANGE-ME: real profile URLs
    { label: 'Twitter', href: 'https://twitter.com/CHANGE-ME' },
    { label: 'Bluesky', href: 'https://bsky.app/profile/CHANGE-ME' },
  ],
  [
    { label: 'Are.na', href: 'https://www.are.na/CHANGE-ME' },
    { label: 'Instagram', href: 'https://instagram.com/CHANGE-ME' },
    { label: 'Soundcloud', href: 'https://soundcloud.com/CHANGE-ME' },
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
