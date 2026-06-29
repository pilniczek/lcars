import { useMemo } from 'react'
import type { FunctionComponent, SVGProps } from 'react'
import { makeRandomNumber, getRandomInt } from '../../utils'
import styles from './LCARSLabel.module.css'
import Number0 from './label/0.svg?react'
import Number1 from './label/1.svg?react'
import Number2 from './label/2.svg?react'
import Number3 from './label/3.svg?react'
import Number4 from './label/4.svg?react'
import Number5 from './label/5.svg?react'
import Number6 from './label/6.svg?react'
import Number7 from './label/7.svg?react'
import Number8 from './label/8.svg?react'
import Number9 from './label/9.svg?react'

const DIGITS: Record<string, FunctionComponent<SVGProps<SVGSVGElement>>> = {
  '0': Number0,
  '1': Number1,
  '2': Number2,
  '3': Number3,
  '4': Number4,
  '5': Number5,
  '6': Number6,
  '7': Number7,
  '8': Number8,
  '9': Number9,
}

interface Props {
  label?: string
  color?: number
}

export default function LCARSLabel({ label, color }: Props) {
  // Label and color can be passed in as props, or are randomly selected once
  const resolvedLabel = useMemo(
    () => label ?? makeRandomNumber(getRandomInt(2, 5), false),
    [label],
  )
  // color is accepted for API parity with the original component
  void color

  return (
    <span className={styles.label}>
      <div className={styles.labelStart}></div>
      {resolvedLabel.split('').map((character, index) => {
        const Digit = DIGITS[character]
        return <span key={index}>{Digit ? <Digit /> : null}</span>
      })}
      <div className={styles.labelEnd}></div>
    </span>
  )
}
