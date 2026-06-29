import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import FocusFrame from '../FocusFrame'
import Placeholder from '../Placeholder'
import { sounds } from '../../utils/sounds'
import styles from './OmegaDirective.module.css'

const headerLabel = 'LCARS ACCESS 0001'
const footerLabel = 'STATUS: STAND BY'

export default function OmegaDirective() {
  const navigate = useNavigate()

  function goHome() {
    // for some reason sound will sometimes be truncated unless we put
    // the play inside an instant setTimeout
    window.setTimeout(() => {
      sounds.panelBeep07.play()
    }, 0)
    navigate('/')
  }

  function handleKeyUp(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter') {
      goHome()
    }
  }

  return (
    <FocusFrame headerLabel={headerLabel} footerLabel={footerLabel}>
      <div
        className={styles.omegaDirectiveSymbol}
        onClick={goHome}
        onKeyUp={handleKeyUp}
        tabIndex={0}
      >
        <Placeholder />
      </div>
    </FocusFrame>
  )
}
