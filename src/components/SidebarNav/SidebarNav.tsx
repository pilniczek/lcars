import { useLocation, useNavigate } from 'react-router-dom'
import { articlesIn, pathFor, sectionFromPath } from '../../screens'
import { playClick } from '../../utils/sounds'
import styles from './SidebarNav.module.css'

interface Props {
  // Owned by the App shell, which holds the root element to fullscreen.
  onFullscreen: () => void
}

// bgcolor classes cycled across the article buttons for the LCARS column.
const ARTICLE_COLORS = [3, 6, 5, 9, 7, 4, 2]

export default function SidebarNav({ onFullscreen }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function go(path: string) {
    if (path === pathname) return
    playClick()
    navigate(path)
  }

  // The current section (from the URL) drives which article list is shown; the
  // active article is the last path segment, or the first article for home (/).
  const section = sectionFromPath(pathname)
  const articles = articlesIn(section)
  const activeSlug = pathname.startsWith('/git/')
    ? pathname.slice(pathname.lastIndexOf('/') + 1)
    : articles[0].slug

  return (
    <>
      <div className="sidebar-top">
        {/* Black-background wrapper: its bg fills the flex gaps so they read
            black, while the orange container shows through as the elbow. */}
        <div className="sidebar-nav">
          <button className="sidebar-block bgcolor-3 linkable" onClick={onFullscreen}>
            Fullscreen
          </button>
        </div>
        {/* Transparent spacer so the orange sidebar-top elbow shows through. */}
        <div className="sidebar-block" />
      </div>
      <div className="sidebar-bottom">
        {/* leading transparent spacer — preserves the LCARS elbow */}
        <div className="sidebar-block" />
        <div className="sidebar-nav">
          {articles.map((article, i) => {
            const path = pathFor(article)
            const active = article.slug === activeSlug ? styles.active : ''
            return (
              <button
                key={article.slug}
                className={`sidebar-block bgcolor-${
                  ARTICLE_COLORS[i % ARTICLE_COLORS.length]
                } linkable ${active}`}
                onClick={() => go(path)}
              >
                {article.title}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
