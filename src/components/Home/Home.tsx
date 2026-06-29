import { useState } from 'react'
import { Link } from 'react-router-dom'
import FocusFrame from '../FocusFrame'
import MobileNav from '../MobileNav'
import { firstOf, pathFor } from '../../screens'
import { playClick } from '../../utils/sounds'
import styles from './Home.module.css'

// Dedicated landing page for the root route (/). Uses the clean, menu-less
// FocusFrame layout (same shell as the /git/initialize Transmission screen) rather
// than the article reader's App shell.
const headerLabel = 'LCARS Terminal'
const footerLabel = 'Main Bridge'

// Call-to-action targets. The GIT pill leads to the start of the presentation;
// the second pill links out to the original LCARS template. Both are mirrored
// as wedges in the mobile menu (see the MobileNav `routes` below).
const gitPath = pathFor(firstOf('config'))
const originalLcarsUrl = 'https://github.com/louh/lcars'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <FocusFrame
      headerLabel={headerLabel}
      footerLabel={footerLabel}
      observeResizes
      onFooterAction={() => {
        playClick()
        setMenuOpen(true)
      }}
      footerActionLabel="Open navigation menu"
      overlay={
        <MobileNav
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          routes={[
            { path: gitPath, label: 'Git Presentation' },
            { path: originalLcarsUrl, label: 'Original LCARS', external: true },
          ]}
          showInnerRing={false}
        />
      }
    >
      <div className={styles.home}>
        <h1>LCARS Presentations</h1>
        <h3>Star Trek designed presentations</h3>
        <nav className={styles.links}>
          <Link to={gitPath} className={styles.link}>
            Git Presentation
          </Link>
          <a
            href={originalLcarsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.link} ${styles.linkAlt}`}
            onClick={() => playClick()}
          >
            Original LCARS
          </a>
        </nav>
      </div>
    </FocusFrame>
  )
}
