import styles from './PlanetView.module.css'
// following images from NASA https://nasa.tumblr.com/post/150044040289/top-10-star-trek-planets-chosen-by-our-scientists
import andoria from './planets/andoria.jpg'
import earth from './planets/earth.jpg'
import janus from './planets/janus.jpg'
import risa from './planets/risa.jpg'
import shoreleave from './planets/shoreleave.jpg'
import vendikar from './planets/vendikar.jpg'
import vulcan from './planets/vulcan.jpg'
// think this is from Memory Alpha?
import kronos from './planets/kronos.webp'

interface Props {
  planet?: number
}

const PLANETS: Record<number, { src: string; cover: boolean }> = {
  1: { src: andoria, cover: true },
  2: { src: earth, cover: false },
  3: { src: janus, cover: false },
  4: { src: risa, cover: true },
  5: { src: shoreleave, cover: true },
  6: { src: vendikar, cover: true },
  7: { src: vulcan, cover: true },
}

export default function PlanetView({ planet = 1 }: Props) {
  const { src, cover } = PLANETS[planet] ?? { src: kronos, cover: false }

  return (
    <div className={styles.planetView}>
      <img src={src} className={cover ? styles.imgCover : undefined} />
    </div>
  )
}
