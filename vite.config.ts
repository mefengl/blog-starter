import mdx from '@mdx-js/rollup'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'

import mdRouterPlugin from './plugins/md-router'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({
      remarkPlugins: [
        remarkGfm,
      ],
    }) },
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
