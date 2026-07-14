import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import { imagetools } from 'vite-imagetools'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { load as parseYaml } from 'js-yaml'

/**
 * Serves `<file>?page-meta` as just that page's metadata (JSON), extracted at
 * build time — MDX YAML frontmatter, or the `export const frontmatter = {...}`
 * literal in bespoke TSX pages. The registry globs these eagerly to list every
 * page on Home WITHOUT statically importing the page modules, which would pull
 * all page bodies into the main chunk and defeat per-page code splitting.
 */
function pageMeta(): Plugin {
  // \0-prefixed virtual id ending in .js so no other plugin (esp. MDX, which
  // matches *.mdx and would recompile the meta module into a component)
  // processes the emitted JSON module
  const PREFIX = '\0page-meta:'
  return {
    name: 'page-meta',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!source.includes('?page-meta')) return
      const file = source.split('?')[0]
      const abs = importer ? resolve(dirname(importer.split('?')[0]), file) : file
      return `${PREFIX}${abs}.js`
    },
    load(id) {
      if (!id.startsWith(PREFIX)) return
      const file = id.slice(PREFIX.length, -'.js'.length)
      this.addWatchFile(file)
      const source = readFileSync(file, 'utf8')
      let meta: unknown
      if (file.endsWith('.mdx')) {
        const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
        meta = match ? parseYaml(match[1]) : {}
      } else {
        meta = evalFrontmatterLiteral(source, file)
      }
      return `export default ${JSON.stringify(meta)}`
    },
  }
}

/** Extract + evaluate the balanced `{...}` literal after `export const frontmatter`.
    The literal must be self-contained (no imported identifiers). */
function evalFrontmatterLiteral(source: string, file: string): unknown {
  const start = source.search(/export\s+const\s+frontmatter[^=]*=\s*\{/)
  if (start === -1) throw new Error(`${file}: bespoke pages must export a frontmatter literal`)
  const open = source.indexOf('{', start)
  let depth = 0
  for (let i = open; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}' && --depth === 0) {
      return new Function(`return (${source.slice(open, i + 1)})`)()
    }
  }
  throw new Error(`${file}: unterminated frontmatter literal`)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    pageMeta(),
    // MDX must run before react so JSX from .mdx is transformed
    mdx({
      remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
      providerImportSource: '@mdx-js/react',
    }),
    react(),
    imagetools(),
  ],
  // relative base: the hash-routed SPA works both at the r0s3.me root and
  // under the project path (s1mb10t3.net/r0s3.me/) before the DNS cutover.
  // Media references in src/ are likewise relative (media/..., not /media/...).
  base: './',
})
