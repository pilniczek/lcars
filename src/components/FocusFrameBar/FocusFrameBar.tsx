import styles from './FocusFrameBar.module.css'

interface Props {
  label: string | null
  position: 'left' | 'right'
  // When set, a visible "MENU" text button is shown (the mobile menu opener),
  // mirroring LCARSBar in the article reader.
  onAction?: () => void
  // Visible label for the action button (CSS uppercases it). Defaults to "Menu".
  actionText?: string
  actionLabel?: string
}

export default function FocusFrameBar({
  label,
  position,
  onAction,
  actionText = 'Menu',
  actionLabel,
}: Readonly<Props>) {
  return (
    <div className={styles.bar}>
      <div className={`${styles.cap} ${styles.capLeft}`}></div>
      {position === 'right' && <div className={styles.spacer} />}
      {label && <h2 className={styles.label}>{label}</h2>}
      {position === 'left' && <div className={styles.spacer} />}
      {/* Menu opener typeset like the bar label so it reads as a tappable
          action. The colour lives on the inner span (not the button) to dodge
          the reset's `button { color: inherit }`. */}
      {onAction && (
        <button type="button" className={styles.menu} onClick={onAction} aria-label={actionLabel}>
          <span>{actionText}</span>
        </button>
      )}
      <div className={`${styles.cap} ${styles.capRight}`}></div>
    </div>
  )
}
