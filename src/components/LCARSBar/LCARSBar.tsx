import type { ReactNode } from 'react'
import styles from './LCARSBar.module.css'

interface Props {
  colorScheme?: number
  align?: 'left' | 'right'
  children?: ReactNode
  // When set, a "MENU" text button is shown (used as the mobile menu opener).
  onAction?: () => void
  // Visible label for the action button (CSS uppercases it). Defaults to "Menu".
  actionText?: string
  actionLabel?: string
}

export default function LCARSBar({
  colorScheme = 1,
  align = 'left',
  children,
  onAction,
  actionText = 'Menu',
  actionLabel,
}: Props) {
  const hasTextContent = children !== undefined && children !== null && children !== ''

  return (
    <div className={styles.bar} data-color-scheme={colorScheme} data-align={align}>
      <div className={styles.barLeft}></div>
      <div className={styles.barText}>
        {hasTextContent && <span>{children}</span>}
      </div>
      {onAction && (
        <button type="button" className={styles.barMenu} onClick={onAction} aria-label={actionLabel}>
          <span>{actionText}</span>
        </button>
      )}
      <div className={styles.barRight}></div>
    </div>
  )
}
