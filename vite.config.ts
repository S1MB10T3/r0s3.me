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
  // custom domain (r0s3.me) serves from root
  base: '/',
})
