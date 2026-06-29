# CLAUDE.md

## What this project is
An LCARS-themed git-reference reader (repurposed from the Star-Trek LCARS UI template).
Each article is one route, one sidebar button, and one content page. Articles are static HTML
in `src/content/git/*.html`, imported raw at build time. The single source of truth for which
articles exist and their order is the `ARTICLES` array in [src/screens.ts](src/screens.ts) - both
`SidebarNav` and `MobileNav` render purely from it. Index 0 maps to home (`/`); the rest map to
`/git/<slug>`.

## Writing style

- Always write **GIT** (all caps), never "Git", in article content and prose.
- Never use an em dash or en dash (`—` / `–`); use a hyphen `-` instead.
- The only approved quote characters are straight `"` and `'`; never curly quotes (`" " ' '`).

## Content mirror - avoid dead links
This reader's articles are also published as a public mirror at:

  **https://pilniczek.github.io/important/**

Each article is reachable at `https://pilniczek.github.io/important/<slug>` using the same slug as
the local content file (e.g. the `install-git` article → `https://pilniczek.github.io/important/install-git`).

**Rule:** When an article is removed or renamed and an in-app link (`/git/<slug>`) would otherwise
become a dead link, repoint that link to the mirror URL for the same slug instead of deleting it.
This keeps the referenced content reachable. (Example: removing the `install-git` article - the
inbound link in [git.html](src/content/git/git.html) was repointed to
`https://pilniczek.github.io/important/install-git`.)

## Build
- Dev: `npm run dev`
- Production build: `npm run build` (run after editing `screens.ts` or content files to confirm the
  typed `ARTICLE_HTML` glob map still resolves).
