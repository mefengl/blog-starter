import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'

import mdRouterPlugin from './plugins/md-router'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({/* jsxImportSource: …, otherOptions… */}) },
    mdRouterPlugin({ directory: 'src/routes' }),
    TanStackRouterVite(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
