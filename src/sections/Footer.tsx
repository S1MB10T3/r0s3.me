import { SocialLinks } from '../components/SocialLinks'
import './sections.css'

/** Footer (Figma 82:238): logo left, social links right. */
export function Footer() {
  return (
    <footer className="footer">
      <span className="footer__logo">
        <img src="media/black.png" alt="R0S3_ME" />
      </span>
      <SocialLinks />
    </footer>
  )
}
