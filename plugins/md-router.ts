import type { Plugin } from 'vite'

import fs from 'node:fs'
import path from 'node:path'

const pluginName = 'md-router'

export default function mdRouterPlugin(options: {
  directory?: string
} = {}): Plugin {
  const processMdxFile = (file: string): void => {
    const tsxFile = file.replace(/\.(?:mdx|md)$/, '.tsx')
    const componentName = path.basename(file, path.extname(file))
      .replace(/[^a-z0-9]/gi, '_') // Replace non-alphanumeric characters with underscores
      .replace(/_./g, match => match[1].toUpperCase()) // Convert to camelCase
      .replace(/^\w/, c => c.toUpperCase()) // Capitalize first character

    const tsxContent = `// This file is auto-generated by ${pluginName}
import { createFileRoute } from '@tanstack/react-router'

import ${componentName} from './${path.basename(file)}'

export const Route = createFileRoute('/${path.basename(file, path.extname(file)).toLowerCase()}')({
  component: () => <${componentName} />,
})
`

    fs.writeFileSync(tsxFile, `${tsxContent.trimEnd()}\n`)
  }

  const removeTsxFile = (file: string): void => {
    const tsxFile = file.replace(/\.(?:mdx|md)$/, '.tsx')
    if (fs.existsSync(tsxFile)) {
      fs.unlinkSync(tsxFile)
    }
  }

  const scanDirectory = (directory: string): void => {
    const files = fs.readdirSync(directory)

    files.forEach((file) => {
      const absolutePath = path.join(directory, file)
      const stat = fs.statSync(absolutePath)

      if (stat.isDirectory() && file !== 'node_modules') {
        scanDirectory(absolutePath)
      }
      else if (/\.(?:mdx|md)$/.test(file)) {
        processMdxFile(absolutePath)
      }
    })
  }

  return {
    buildStart() {
      const directoryToScan = options.directory || path.resolve(__dirname, '../src')
      scanDirectory(directoryToScan)
    },
    configureServer(server) {
      server.watcher.on('add', (filePath) => {
        if (/\.(?:mdx|md)$/.test(filePath)) {
          processMdxFile(filePath)
        }
      })

      server.watcher.on('unlink', (filePath) => {
        if (/\.(?:mdx|md)$/.test(filePath)) {
          removeTsxFile(filePath)
        }
      })

      server.watcher.on('change', (filePath) => {
        if (/\.(?:mdx|md)$/.test(filePath)) {
          processMdxFile(filePath)
        }
      })

      server.watcher.on('rename', (oldPath, newPath) => {
        if (/\.(?:mdx|md)$/.test(oldPath) && !/\.(?:mdx|md)$/.test(newPath)) {
          removeTsxFile(oldPath)
        }
        if (!/\.(?:mdx|md)$/.test(oldPath) && /\.(?:mdx|md)$/.test(newPath)) {
          processMdxFile(newPath)
        }
      })
    },
    name: pluginName,
  }
}
