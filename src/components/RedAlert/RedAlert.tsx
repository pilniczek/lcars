import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import FocusFrame from '../FocusFrame'
import Placeholder from '../Placeholder'
import { sounds } from '../../utils/sounds'
import styles from './RedAlert.module.css'

const headerLabel = 'ALERT CONDITION'
const footerLabel = 'ALL HANDS — BATTLE STATIONS'

export default function RedAlert() {
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
      <div className={styles.redAlert} onClick={goHome} onKeyUp={handleKeyUp} tabIndex={0}>
        <Placeholder />
      </div>
    </FocusFrame>
  )
}
