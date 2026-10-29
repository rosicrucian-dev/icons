// A new icon to draw: the grid template copied to icons/24/outline/<name>.svg
// and a stub entry added to icons/meta.json.
//
//   npm run new-icon <name> <category>

import { copyFileSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  CATEGORIES,
  ICONS_DIR,
  META_FILE,
  readMeta,
  ROOT,
  type Category,
} from './icons.ts'

const [name, category] = process.argv.slice(2)
if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
  console.error('usage: npm run new-icon <kebab-case-name> <category>')
  process.exit(1)
}
if (!CATEGORIES.includes(category as Category)) {
  console.error(`category: one of ${CATEGORIES.join(', ')}`)
  process.exit(1)
}
const file = join(ICONS_DIR, `${name}.svg`)
if (existsSync(file)) {
  console.error(`${file} exists`)
  process.exit(1)
}
copyFileSync(join(ROOT, 'template/grid.svg'), file)
const meta = readMeta()
meta[name] = {
  category: category as Category,
  keywords: [],
  source: 'original',
}
writeFileSync(META_FILE, JSON.stringify(meta, null, 2) + '\n')
console.log(
  `${file}: draw on the grid, then keep the one <path> alone; its entry is in icons/meta.json`,
)
