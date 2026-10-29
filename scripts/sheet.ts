// A contact sheet of every icon, by category, at 24 and 64 px, light and
// dark, with the ink's top and foot marked: docs/sheet.html, to look the
// set over (open it in a browser). `npm run sheet`.

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { CATEGORIES, readIcons, ROOT } from './icons.ts'

const icons = readIcons()
const cell = (svg: string, size: number) =>
  svg.replace('<svg ', `<svg width="${size}" height="${size}" `)

const sections = CATEGORIES.map((c) => {
  const figures = icons
    .filter((i) => i.category === c)
    .map(
      (i) => `<figure>
  <div class="big">${cell(i.svg, 64)}</div>
  <div class="small">${cell(i.svg, 24)}${cell(i.svg, 20)}${cell(i.svg, 16)}</div>
  <figcaption>${i.name}<br><small>${i.bounds.top}–${i.bounds.bottom}, ink ${i.ink.x},${i.ink.y}</small></figcaption>
</figure>`,
    )
    .join('\n')
  return `<h2>${c}</h2>\n<div class="grid">\n${figures}\n</div>`
}).join('\n')

const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Rosicrucian Icons</title>
<style>
  body { font: 13px system-ui, sans-serif; margin: 24px; color: #18181b; background: #fff; }
  h2 { margin: 24px 0 8px; font-size: 15px; text-transform: capitalize; }
  .grid { display: flex; flex-wrap: wrap; gap: 12px; }
  figure { margin: 0; width: 96px; text-align: center; }
  .big svg { background:
    linear-gradient(#f43f5e33 0 0) 0 15.625%/100% 1px no-repeat,
    linear-gradient(#f43f5e33 0 0) 0 84.375%/100% 1px no-repeat,
    linear-gradient(#3b82f633 0 0) 0 18.75%/100% 1px no-repeat,
    linear-gradient(#3b82f633 0 0) 0 81.25%/100% 1px no-repeat; }
  .small { display: flex; justify-content: center; align-items: center; gap: 6px; margin-top: 4px; }
  figcaption { margin-top: 4px; }
  small { color: #71717a; font-size: 10px; }
  .dark { background: #18181b; color: #fff; padding: 24px; margin: 24px -24px -24px; }
</style>
<body>
<h1>Rosicrucian Icons <small>${icons.length} icons</small></h1>
<p>The red lines are the ink's top and foot (3.75, 20.25); the blue the baseline (4.5, 19.5).</p>
${sections}
<div class="dark">
${sections}
</div>
</body>
</html>
`
mkdirSync(join(ROOT, 'docs'), { recursive: true })
writeFileSync(join(ROOT, 'docs/sheet.html'), html)
console.log(`docs/sheet.html: ${icons.length} icons`)
