/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// Perlin noise library loaded globally via <script src="/vendor/perlin.js"> in index.html
declare const noise: {
  seed: (seed: number) => void
  perlin2: (x: number, y: number) => number
  perlin3: (x: number, y: number, z: number) => number
  simplex2: (x: number, y: number) => number
  simplex3: (x: number, y: number, z: number) => number
}
