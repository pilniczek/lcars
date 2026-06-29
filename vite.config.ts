import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  // Project page served from https://pilniczek.github.io/lcars/
  base: '/lcars/',
  plugins: [
    react(),
    svgr(),
    {
      // GitHub Pages serves static files, so a hard refresh on a deep client
      // route (e.g. /lcars/git/config/x) hits the Pages 404. Serving a copy of
      // index.html as 404.html lets the SPA boot and the router take over.
      name: 'spa-404-fallback',
      closeBundle() {
        copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'))
      },
    },
  ],
  server: {
    host: true,
  },
})
