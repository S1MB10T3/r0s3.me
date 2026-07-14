import sharp from 'sharp'
import { readdir, stat, unlink } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * One-shot: convert the featured case study PNG exports (Espa, Caldera, Hook)
 * to WebP per the repo media convention (WebP, max 1600px). Downscales only
 * when wider than the cap; deletes the source PNG on success. Idempotent —
 * skips anything already converted.
 */
const ROOT = new URL('../public/media/', import.meta.url).pathname
const FOLDERS = ['espa', 'caldera', 'hook']
const MAX_W = 1600
const QUALITY = 82

let before = 0
let after = 0

for (const folder of FOLDERS) {
  const dir = join(ROOT, folder)
  for (const file of await readdir(dir)) {
    if (!file.endsWith('.png')) continue
    const src = join(dir, file)
    const out = src.replace(/\.png$/, '.webp')
    const srcBytes = (await stat(src)).size
    const img = sharp(src)
    const { width } = await img.metadata()
    const pipeline = width && width > MAX_W ? img.resize({ width: MAX_W }) : img
    await pipeline.webp({ quality: QUALITY }).toFile(out)
    const outBytes = (await stat(out)).size
    before += srcBytes
    after += outBytes
    await unlink(src)
    const pct = ((1 - outBytes / srcBytes) * 100).toFixed(0)
    console.log(
      `${folder}/${file.padEnd(24)} ${(srcBytes / 1024).toFixed(0)}KB -> ` +
        `${(outBytes / 1024).toFixed(0)}KB (-${pct}%)${width && width > MAX_W ? ` resized ${width}->${MAX_W}` : ''}`,
    )
  }
}

console.log(
  `\nTOTAL ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB ` +
    `(-${((1 - after / before) * 100).toFixed(0)}%)`,
)
