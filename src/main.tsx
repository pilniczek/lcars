import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider, useParams } from 'react-router-dom'
import { initSounds } from './utils/sounds'
import { setupResizeObserver } from './utils/resize-observer'
import App from './components/App'
import Home from './components/Home'
import Transmission from './components/Transmission'
import { firstOf, pathFor } from './screens'
import './styles/index.css'

// A bare section URL (/git/<section>, e.g. /git/usage or /git/usage/) has no
// article - send it to that section's first article. Unknown sections fall back
// to home.
function SectionLanding() {
  const { section } = useParams<{ section: string }>()
  if (section === 'config' || section === 'usage') {
    return <Navigate to={pathFor(firstOf(section))} replace />
  }
  return <Navigate to="/" replace />
}

const router = createBrowserRouter([
  // Root shows the dedicated landing page; every article lives at
  // /git/<section>/<slug>. App reads the slug from the route and renders that
  // article's content.
  { path: '/', element: <Home /> },
  // Bare /git has no article — send it to the first section's first article.
  { path: '/git', element: <Navigate to={pathFor(firstOf('config'))} replace /> },
  // A bare section URL (/git/<section>) redirects to that section's first article.
  { path: '/git/:section', element: <SectionLanding /> },
  { path: '/git/:section/:slug', element: <App /> },
  // The "Initialize" sidebar button shows the transmission content in the
  // clean, menu-less FocusFrame layout (src/components/Transmission). It lives
  // under /git as the entry point into the git reference; its content links to
  // the first git article. Static segment, so it out-ranks /git/:section.
  { path: '/git/initialize', element: <Transmission /> },
], {
  // Resolve routes under Vite's base (prod: /lcars, dev: /). React Router wants
  // the basename without a trailing slash.
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
})

initSounds()
setupResizeObserver()

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
