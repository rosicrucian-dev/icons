// The build (scripts/build.ts): the manifest, and the React components,
// which must render as the SVG files are.

import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { pathToFileURL } from 'node:url'

import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { build, manifest } from '../scripts/build.ts'
import { componentName, readIcons } from '../scripts/icons.ts'
import { bounds } from '../scripts/path.ts'

test('path bounds: a circle, a line, an arc', () => {
  assert.deepEqual(bounds('M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z'), {
    left: 4,
    right: 20,
    top: 4,
    bottom: 20,
  })
  assert.deepEqual(bounds('M3 3l18 18'), {
    left: 3,
    right: 21,
    top: 3,
    bottom: 21,
  })
  // A half circle, bulging right: as far right as its radius.
  const half = bounds('M12 4a8 8 0 0 1 0 16')
  assert.ok(Math.abs(half.right - 20) < 0.01 && half.left === 12)
})

test('component names: words to PascalCase, Icon after', () => {
  assert.equal(componentName('sun'), 'SunIcon')
  assert.equal(componentName('north-node'), 'NorthNodeIcon')
  assert.equal(componentName('numeral-7'), 'Numeral7Icon')
  assert.equal(componentName('letter-a'), 'LetterAIcon')
})

test('the manifest carries each icon whole, with its path, bounds and ink', () => {
  const icons = readIcons()
  const m = manifest(icons)
  assert.equal(Object.keys(m).length, icons.length)
  const mercury = m.mercury
  assert.equal(mercury.category, 'planets')
  assert.equal(mercury.codepoint, 'U+263F')
  assert.ok(mercury.path.startsWith('M'))
  assert.ok(!('svg' in mercury))
  assert.ok(
    Math.abs(mercury.ink.x - 12) < 0.01 && Math.abs(mercury.ink.y - 12) < 0.01,
  )
  // The Moon's bow sits to one side: its ink is centred right of 12.
  assert.ok(m.moon.ink.x > 12.5, `${m.moon.ink.x}`)
})

test('the React package renders each icon as its file draws it', async () => {
  // Built into a folder inside the repo, so `react` resolves from here.
  const out = mkdtempSync(
    join(new URL('..', import.meta.url).pathname, '.build-test-'),
  )
  try {
    const icons = build(out)
    const index = await import(
      pathToFileURL(join(out, 'react/24/outline/index.js')).href
    )
    for (const icon of icons) {
      const Component = index[componentName(icon.name)]
      assert.ok(Component, componentName(icon.name))
      const html = renderToStaticMarkup(
        React.createElement(Component, { className: 'size-6' }),
      )
      assert.ok(html.includes(`d="${icon.path}"`), `${icon.name}: the path`)
      assert.ok(
        html.includes('class="size-6"'),
        `${icon.name}: props pass through`,
      )
      assert.ok(html.includes('aria-hidden="true"'), icon.name)
    }
    // With a title it's labelled, not hidden from readers of the label.
    const titled = renderToStaticMarkup(
      React.createElement(index.SunIcon, { title: 'The Sun', titleId: 'sun' }),
    )
    assert.ok(titled.includes('<title id="sun">The Sun</title>'))
    assert.ok(titled.includes('aria-labelledby="sun"'))
    // The manifest is written, and the SVGs copied.
    const written = JSON.parse(
      readFileSync(join(out, 'icons/icons.json'), 'utf8'),
    )
    assert.equal(Object.keys(written).length, icons.length)
    assert.equal(
      readFileSync(join(out, 'icons/svg/24/outline/sun.svg'), 'utf8'),
      icons[0].svg,
    )
  } finally {
    rmSync(out, { recursive: true, force: true })
  }
})
