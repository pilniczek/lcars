import styles from './Placeholder.module.css'

// Template scaffolding: fills its parent with a tiled, repeated note so it's
// obvious where real page content should go. No props — drop it into any
// content slot.
const NOTE = 'Add your content here'
const REPEAT = 48

export default function Placeholder() {
  return (
    <div className={styles.placeholder} aria-label={NOTE}>
      {Array.from({ length: REPEAT }, (_, i) => (
        <span key={i} className={styles.note} aria-hidden="true">
          {NOTE}
        </span>
      ))}
    </div>
  )
}
