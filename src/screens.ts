// Single source of truth for the git-reference content. Drives the router
// (src/main.tsx), the App shell, and the left-sidebar nav.
//
// The app was repurposed from a Star-Trek-LCARS template into a git reference
// reader: every article (imported from the personal Quartz vault as static
// HTML) is one route, one sidebar button, and one content page. The HTML bodies
// live in src/content/git/*.html and are loaded raw at build time below.

// Articles are grouped into two sections; the section is part of every article
// route (/git/<section>/<slug>) and decides which sidebar/mobile-nav list an
// article appears in.
export type Section = 'config' | 'usage'

export interface Article {
  slug: string
  title: string
  section: Section
}

// A button in the header's top-right button row. An entry with a `to` route is
// clickable and navigates there.
export interface HeaderButton {
  label: string
  color: number
  to?: string
  // The section this button represents; used to mark it active when the current
  // route is in that section. Omitted for buttons with no section (Initialize).
  section?: Section
}

// Reading order within each section follows this array. Section drives the
// route (/git/<section>/<slug>) and which nav list the article appears in.
// Kept in sync with the converted files in src/content/git/ (titles come from
// each article's frontmatter).
export const ARTICLES: Article[] = [
  { slug: 'general-mindset', title: 'General mindset', section: 'config' },
  { slug: 'autocrlf', title: 'Safe line endings', section: 'config' },
  { slug: 'push-head', title: 'Push current', section: 'config' },
  { slug: 'pull-rebase', title: 'Clean pulls', section: 'config' },
  { slug: 'force-push-vs-force-with-lease', title: 'Safe force push', section: 'config' },
  { slug: 'git-rerere', title: 'Repeated conflicts', section: 'config' },
  { slug: 'vscode-editor', title: 'GIT editor', section: 'config' },
  { slug: 'git-wip', title: 'WIP commits', section: 'config' },
  { slug: 'configuration-example', title: 'Config Example', section: 'config' },
  { slug: 'general-mindset-usage', title: 'General mindset', section: 'usage' },
  { slug: 'strategy', title: 'Strategy', section: 'usage' },
  { slug: 'merge-or-rebase', title: 'Merge or Rebase', section: 'usage' },
  { slug: 'fixup-commity', title: 'Fixup commits', section: 'usage' },
  { slug: 'git-merged-custom-script', title: 'GIT Merged', section: 'usage' },
  { slug: 'helpful-commands', title: 'Helpful commands', section: 'usage' },
  { slug: 'semantic-commit-messages', title: 'Semantic message', section: 'usage' },
  { slug: 'git-hooks', title: 'GIT hooks', section: 'usage' },
  { slug: 'husky', title: 'Husky', section: 'usage' },
  { slug: 'git-submodule', title: 'Git submodules', section: 'usage' },
  { slug: 'worktrees', title: 'Worktrees', section: 'usage' },
]

// Canonical route for an article: /git/<section>/<slug>.
export function pathFor(article: Article): string {
  return `/git/${article.section}/${article.slug}`
}

// Articles of a section, in reading order.
export function articlesIn(section: Section): Article[] {
  return ARTICLES.filter((a) => a.section === section)
}

// First article of a section (the section's landing target).
export function firstOf(section: Section): Article {
  return articlesIn(section)[0]
}

// The section a route belongs to: parsed from /git/<section>/..., defaulting to
// 'config' for home (/) and anything unrecognised.
export function sectionFromPath(pathname: string): Section {
  if (pathname.startsWith('/git/usage/')) return 'usage'
  return 'config'
}

// LCARS buttons shown in the header band: Initialize (the menu-less transmission
// view) plus one button per section that opens that section's first article.
export const HEADER_BUTTONS: HeaderButton[] = [
  { label: 'Initialize', color: 6, to: '/git/initialize' },
  { label: 'Config', color: 5, to: pathFor(firstOf('config')), section: 'config' },
  { label: 'Usage', color: 9, to: pathFor(firstOf('usage')), section: 'usage' },
]

// Raw HTML body for each article, keyed by slug. The bodies are committed,
// pre-converted from the source markdown (no runtime markdown library).
const htmlModules = import.meta.glob('./content/git/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const ARTICLE_HTML: Record<string, string> = Object.fromEntries(
  Object.entries(htmlModules).map(([path, html]) => {
    const slug = path.slice(path.lastIndexOf('/') + 1).replace(/\.html$/, '')
    return [slug, html]
  }),
)

export function getArticle(slug: string | undefined): Article {
  return ARTICLES.find((a) => a.slug === slug) ?? ARTICLES[0]
}
