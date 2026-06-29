import { Link } from 'react-router-dom'
import FocusFrame from '../FocusFrame'
import FederationLogo from './federation-logo.svg?react'
import { firstOf, pathFor } from '../../screens'
import styles from './Transmission.module.css'

const headerLabel = 'Subspace Comm Net 4471'
const footerLabel = 'Main Bridge'

// Clicking the transmission opens the start of the git reference.
const gitStart = pathFor(firstOf('config'))

export default function Transmission() {
  return (
    <FocusFrame headerLabel={headerLabel} footerLabel={footerLabel}>
      <Link to={gitStart} className={styles.transmissionLink}>
        <div className={styles.federationLogo}>
          <FederationLogo />
        </div>
        <h1>Incoming Transmission</h1>
        <h3>Starfleet Command • Authorized access only</h3>
      </Link>
    </FocusFrame>
  )
}
