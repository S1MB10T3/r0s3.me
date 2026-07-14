import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import { imagetools } from 'vite-imagetools'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
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
