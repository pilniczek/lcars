import { useEffect } from 'react'
import type { ReactNode } from 'react'
import FocusFrameBar from '../FocusFrameBar'
import { startResizeObserver } from '../../utils/resize-observer'
import styles from './FocusFrame.module.css'

// Same breakpoints as the article reader's App shell, so MobileNav's
// `.screen.SM` hide rule lines up when this frame opts into resize observation.
const BREAKPOINTS = '{"XS": 0, "SM": 708, "MD": 1280, "LG": 1600, "XL": 1900, "XXL": 3000}'

interface Props {
  headerLabel: string | null
  footerLabel: string | null
  children?: ReactNode
  // Track the screen's width so container breakpoint classes (SM, MD, ...) get
  // applied. Needed when an `overlay` (MobileNav) must hide on larger screens.
  observeResizes?: boolean
  // Turns the footer end-cap into a button (used to open the mobile menu).
  onFooterAction?: () => void
  footerActionLabel?: string
  // Rendered as a direct child of `.screen` (e.g. a MobileNav overlay), matching
  // the App shell so the `.screen.SM .overlay` hide rule resolves.
  overlay?: ReactNode
}

export default function FocusFrame({
  headerLabel,
  footerLabel,
  children,
  observeResizes,
  onFooterAction,
  footerActionLabel,
  overlay,
}: Readonly<Props>) {
  useEffect(() => {
    if (observeResizes) startResizeObserver()
  }, [observeResizes])

  return (
    <div
      className="screen"
      {...(observeResizes ? { 'data-observe-resizes': true, 'data-breakpoints': BREAKPOINTS } : {})}
    >
      <div className={styles.transmissionContainer}>
        <header className={styles.frameBar}>
          <FocusFrameBar label={headerLabel} position="right" />
        </header>
        <div className={styles.transmissionBody}>{children}</div>
        <footer className={styles.frameBar}>
          <FocusFrameBar
            label={footerLabel}
            position="left"
            onAction={onFooterAction}
            actionLabel={footerActionLabel}
          />
        </footer>
      </div>
      {overlay}
    </div>
  )
}
