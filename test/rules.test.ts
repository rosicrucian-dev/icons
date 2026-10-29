// The drawing rules (CONTRIBUTING.md), checked for every icon file.

import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  CATEGORIES,
  iconFiles,
  parseIcon,
  readIcons,
  readMeta,
} from '../scripts/icons.ts'

const icons = readIcons()
const meta = readMeta()

test('every file is an icon in meta.json, and every entry a file', () => {
  const files = iconFiles().map((f) => f.replace(/\.svg$/, ''))
  assert.deepEqual(files.sort(), Object.keys(meta).sort())
})

test('names are words in kebab case', () => {
  for (const name of Object.keys(meta))
    assert.match(name, /^[a-z0-9]+(-[a-z0-9]+)*$/, name)
})

test('the file is the drawing: the root line, one path, round caps and joins', () => {
  for (const icon of icons) {
    const parsed = parseIcon(icon.svg)
    assert.ok(
      !('problem' in parsed),
      `${icon.name}: ${'problem' in parsed && parsed.problem}`,
    )
    assert.doesNotMatch(
      icon.svg,
      /transform=|<g\b|\bid=|fill="#|stroke="#|<style/,
      icon.name,
    )
  }
})

test('the ink stays within the overhangs (2.25 to 21.75), no wider than 19.5', () => {
  for (const { name, bounds: b } of icons) {
    const within = (n: number) => n >= 2.25 - 0.01 && n <= 21.75 + 0.01
    assert.ok(
      within(b.left) && within(b.right) && within(b.top) && within(b.bottom),
      `${name}: ${JSON.stringify(b)}`,
    )
    assert.ok(
      b.right - b.left <= 19.5 + 0.01,
      `${name}: ${b.right - b.left} wide`,
    )
  }
})

test('the symbols stand one height: ink from 3.75 to 20.25', () => {
  // The dignities overhang by design (a roof's eaves, a crown's points);
  // the rest share the height exactly, so side by side they stand alike.
  for (const { name, category, bounds: b } of icons) {
    if (category === 'dignities') continue
    assert.ok(Math.abs(b.top - 3.75) < 0.01, `${name}: top ${b.top}`)
    assert.ok(Math.abs(b.bottom - 20.25) < 0.01, `${name}: bottom ${b.bottom}`)
  }
})

test('coordinates are on the grid: thousandths at most', () => {
  for (const icon of icons)
    for (const n of icon.path.match(/-?\d*\.\d+/g) ?? [])
      assert.ok(n.split('.')[1].length <= 3, `${icon.name}: ${n}`)
})

test('metadata: a known category, a source, a codepoint in form, keywords', () => {
  for (const [name, m] of Object.entries(meta)) {
    assert.ok(
      CATEGORIES.includes(m.category),
      `${name}: category ${m.category}`,
    )
    assert.ok(
      ['original', 'heroicons'].includes(m.source),
      `${name}: source ${m.source}`,
    )
    if (m.source === 'heroicons')
      assert.ok(m.heroicon, `${name}: which Heroicon?`)
    if (m.codepoint) {
      assert.match(m.codepoint, /^U\+[0-9A-F]{4,6}$/, `${name}: ${m.codepoint}`)
      assert.ok(m.character, `${name}: the character too`)
      assert.equal(
        m.character!.codePointAt(0),
        parseInt(m.codepoint.slice(2), 16),
        name,
      )
    }
    assert.ok(Array.isArray(m.keywords), name)
  }
})
