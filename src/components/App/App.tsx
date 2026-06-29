import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMainStore } from '../../stores/main'
import DividerContent from '../DividerContent'
import LCARSBar from '../LCARSBar'
import LCARSButton from '../LCARSButton'
import MobileNav from '../MobileNav'
import SidebarNav from '../SidebarNav'
import { ARTICLE_HTML, getArticle, HEADER_BUTTONS, sectionFromPath } from '../../screens'
import { startResizeObserver } from '../../utils/resize-observer'
import { playClick, sounds } from '../../utils/sounds'

// Fixed LCARS theme for the reader (per-screen themes were removed when the demo
// screens were replaced by the article list).
const COLOR_SCHEME = 1
const TITLE_TYPE = 1 as const

export default function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { slug } = useParams()
  const activeSection = sectionFromPath(pathname)
  const setTheme = useMainStore((s) => s.setTheme)
  const [menuOpen, setMenuOpen] = useState(false)

  const article = getArticle(slug)
  const html = ARTICLE_HTML[article.slug] ?? ''
  const title = article.title

  // Set global theme once for the whole reader.
  useEffect(() => {
    setTheme(COLOR_SCHEME)
  }, [setTheme])

  useEffect(() => {
    startResizeObserver()
  }, [])

  // Scroll back to the top whenever the article changes.
  useEffect(() => {
    document.querySelector('.main-content')?.scrollTo(0, 0)
  }, [article.slug])

  function enterFullscreen() {
    if (document.fullscreenEnabled) {
      if (!document.fullscreenElement) {
        document.documentElement
          .requestFullscreen()
          .then(() => {
            if (sounds.panelBeep13.playing() === false) {
              sounds.panelBeep13.play()
            }
          })
          .catch(() => {
            sounds.denyBeep1.play()
          })
      } else {
        document.exitFullscreen()
        sounds.panelBeep08.play()
      }
    }
  }

  // Keep in-article wikilinks (rendered as plain <a href="/git/...">) inside the
  // SPA: intercept left-clicks on internal links and route via React Router.
  // External links and modified clicks fall through to default behaviour.
  function onContentClick(event: MouseEvent<HTMLDivElement>) {
    const anchor = (event.target as HTMLElement).closest('a')
    if (!anchor) return
    const href = anchor.getAttribute('href') ?? ''
    if (!href.startsWith('/git/')) return
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    playClick()
    const [path, hash] = href.split('#')
    navigate(path)
    if (hash) {
      // Defer to after the new article renders, then jump to the heading.
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView()
      })
    }
  }

  return (
    <div
      className="screen"
      data-observe-resizes
      data-breakpoints='{"XS": 0, "SM": 708, "MD": 1280, "LG": 1600, "XL": 1900, "XXL": 3000}'
    >
      <section className="lcars-type-01">
        <h1 className="lcars-title small">
          <LCARSBar align="left" colorScheme={TITLE_TYPE}>
            {title}
          </LCARSBar>
        </h1>
        <SidebarNav onFullscreen={enterFullscreen} />
        <DividerContent />
        <div className="meta-content">
          <h1 className="lcars-title large" data-type={TITLE_TYPE}>
            {title}
          </h1>
          <div className="buttons-area">
            {HEADER_BUTTONS.map((button) => (
              <LCARSButton
                key={button.label}
                label={button.label}
                color={button.color}
                active={button.section === activeSection}
                onClick={
                  button.to
                    ? () => {
                        playClick()
                        navigate(button.to!)
                      }
                    : undefined
                }
              />
            ))}
          </div>
        </div>
        <div
          className="main-content"
          onClick={onContentClick}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <footer>
          <LCARSBar
            align="right"
            colorScheme={TITLE_TYPE}
            onAction={() => {
              playClick()
              setMenuOpen(true)
            }}
            actionLabel="Open navigation menu"
          />
        </footer>
      </section>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
