// The icons as the repo holds them: each SVG in src/24/outline read with
// its entry in src/meta.json, checked, and given its ink's bounds. The
// build (build.ts), the tests and the contact sheet all read them here.

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { bounds, inkCentre, type Bounds } from './path.ts'

export const ROOT = new URL('..', import.meta.url).pathname
export const ICONS_DIR = join(ROOT, 'src/24/outline')
export const META_FILE = join(ROOT, 'src/meta.json')

export const CATEGORIES = [
  'planets',
  'points',
  'signs',
  'aspects',
  'elements',
  'dignities',
  'numerals',
  'letters',
] as const
export type Category = (typeof CATEGORIES)[number]

export interface Meta {
  category: Category
  /** The Unicode character it stands for, if one does ("U+263F"). */
  codepoint?: string
  character?: string
  keywords: string[]
  /** Drawn here, or from (or built on) a Heroicon, named. */
  source: 'original' | 'heroicons'
  heroicon?: string
}

export interface Icon extends Meta {
  name: string
  /** The path's data, the whole drawing. */
  path: string
  /** The bounds of its ink, and where that's centred. */
  bounds: Bounds
  ink: { x: number; y: number }
  /** The file as it stands. */
  svg: string
}

/** The root element and the one path an icon file holds, exactly. */
export const SVG_OPEN =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">'
export const PATH_RE =
  /^\s*<path stroke-linecap="round" stroke-linejoin="round" d="([^"]+)" \/>\s*$/

/** The path data of an icon file, or why it isn't one. */
export function parseIcon(svg: string): { d: string } | { problem: string } {
  const lines = svg.trim().split('\n')
  if (lines.length !== 3) return { problem: `${lines.length} lines, not 3` }
  if (lines[0] !== SVG_OPEN) return { problem: 'the <svg> line differs' }
  if (lines[2].trim() !== '</svg>') return { problem: 'no closing </svg>' }
  const m = PATH_RE.exec(lines[1])
  if (!m) return { problem: 'the <path> line differs' }
  return { d: m[1] }
}

export function readMeta(): Record<string, Meta> {
  return JSON.parse(readFileSync(META_FILE, 'utf8'))
}

export function iconFiles(): string[] {
  return readdirSync(ICONS_DIR)
    .filter((f) => f.endsWith('.svg'))
    .sort()
}

/** Every icon, in the metadata's order (the order of the set). Throws on
 * a file that isn't an icon, or an icon without metadata. */
export function readIcons(): Icon[] {
  const meta = readMeta()
  const files = new Set(iconFiles())
  return Object.entries(meta).map(([name, m]) => {
    const file = `${name}.svg`
    if (!files.has(file)) throw new Error(`${name}: in meta.json, no ${file}`)
    const svg = readFileSync(join(ICONS_DIR, file), 'utf8')
    const parsed = parseIcon(svg)
    if ('problem' in parsed) throw new Error(`${file}: ${parsed.problem}`)
    const b = bounds(parsed.d)
    return { name, ...m, path: parsed.d, bounds: b, ink: inkCentre(b), svg }
  })
}

/** "north-node" → "NorthNodeIcon". */
export function componentName(name: string): string {
  return (
    name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase()) + 'Icon'
  )
}
