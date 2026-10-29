# Rosicrucian Icons: a plan

An open source icon set from Rosicrucian Developers, in Heroicons' manner,
for the symbols of the spiritual traditions. It starts with astrology: the
symbols Starscroll draws today, lifted out into a package anyone can use,
with a gallery on rosicrucian.dev.

## 1. What exists today (the starter)

All in Starscroll, `src/lib/astroSymbols.ts` and three components. Hand
drawn, one family, with a written style guide in the file's header:

- A 24-unit grid, one stroke of 1.5, round caps and joins, slants at 45°.
- Every symbol the same ink height, 3.75 to 20.25 (16.5), bodies on the
  4.5–19.5 baseline, overhangs to 2.25/21.75.
- Shared part sizes (small, medium and large circles; bows of radius 15;
  hooks of 3.75; crossbars 7.5 wide) so symbols read as kin side by side.
- Each symbol carries where its ink is centred (`mx`, `my`), so it can be
  set by its ink rather than its box. No other icon set does this; keep it.

The inventory, 36 symbols plus numerals and letters:

| Category  | Icons                                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| Planets   | sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto                                                |
| Points    | north-node, south-node, chiron                                                                                          |
| Signs     | aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces                     |
| Aspects   | conjunction, opposition, square, trine, quincunx, sextile                                                               |
| Elements  | fire, earth, air, water                                                                                                 |
| Dignities | domicile (a house), exaltation (a crown), detriment (the house struck through), fall (the crown turned), retrograde (℞) |
| Numerals  | 0–9, in the symbols' stroke, for house numbers                                                                          |
| Letters   | A, C, D, I, M, for the angles (AC, MC, DC, IC)                                                                          |

Two provenance notes to settle before publishing:

- The domicile house is Heroicons' own `home` path (MIT). Keep their
  copyright line in LICENSE, or redraw it.
- The symbols are drawn "after Astronomicon's forms": the conventional
  shapes, reconstructed on our grid. Confirm no outline was traced from the
  font, and credit Astronomicon as a reference in the README.

## 2. Name and packages

Project name: **Rosicrucian Icons**. The repo is `rosicrucian-dev/icons`;
the packages are scoped, so the org owns the names:

- `@rosicrucian-dev/icons`: the SVG files and a JSON manifest. Framework
  free; the source of truth for everything else.
- `@rosicrucian-dev/icons-react`: one component per icon, generated,
  tree-shakeable, like `@heroicons/react/24/outline`.

Vue, Svelte and an icon font can come later from the same SVGs; none is
needed to start.

## 3. Repository layout

One repo, `rosicrucian-dev/icons`, npm workspaces:

```
icons/
  icons/
    24/outline/           one SVG per icon, hand edited: the source of truth
      sun.svg
      north-node.svg
      ...
  packages/
    icons/                @rosicrucian-dev/icons
      icons.json          generated: the manifest
      svg/                generated: optimised copies
    react/                @rosicrucian-dev/icons-react
      24/outline/*.js     generated components, plus .d.ts
  scripts/
    build.ts              SVGO, then the manifest and the components
    new-icon.ts           copies the grid template to src/24/outline/<name>.svg
  test/
    rules.test.ts         every SVG obeys the style rules (see §5)
    manifest.test.ts      names unique, categories known, codepoints valid
  template/
    grid.svg              the 24 grid with the baseline and overhang guides
  README.md  CONTRIBUTING.md  CHANGELOG.md  LICENSE
```

Icon names are words, kebab case, never the Unicode character: `sun`,
`north-node`, `grand-trine` later. Variants are separate files
(`crown.svg` and `crown-fallen.svg`), not flags.

## 4. The manifest

`icons.json`, one entry per icon, generated from the SVG and a small
front-matter block in it (or a sidecar `meta.json` per category):

```json
{
  "name": "mercury",
  "category": "planets",
  "codepoint": "U+263F",
  "keywords": ["planet", "hermes", "communication"],
  "path": "M8.25 3.75a3.75 3.75 0 0 0 7.5 0M15.75 11.25 ...",
  "ink": { "x": 12, "y": 12 },
  "since": "0.1.0"
}
```

The SVGs stay on the plain 24 grid, so they drop into any project like a
Heroicon; the `ink` centre is there for apps that set symbols optically
(Starscroll's wheel, its chart grid).

## 5. Build and tests

- `scripts/build.ts`: SVGO with a conservative config (keep stroke
  attributes and the viewBox; no path merging that would change the
  drawing), then write the manifest and the React components from a
  template string. No bundler: ESM, `exports` map, hand-written `.d.ts`
  template.
- `test/rules.test.ts` turns the style guide into checks: `viewBox="0 0 24
24"`, `stroke-width="1.5"`, round caps and joins, `fill="none"`, ink
  within 3.75–20.25 vertically (measured from the path's bounds with a
  small path-bbox routine), no transforms, no ids.
- CI on every push: tests, build, a diff check that the generated packages
  are up to date. Publish on a `v*` tag with `npm publish --provenance`.

## 6. The React package

```tsx
import { MercuryIcon } from '@rosicrucian-dev/icons-react/24/outline'

export function Example() {
  return <MercuryIcon className="size-6 text-zinc-500" />
}
```

Each component renders the SVG with `fill="none"`, `stroke="currentColor"`,
`aria-hidden` unless given a `title`, and spreads the rest of its props.
An `ink` export beside each icon (or on the manifest) for optical centring:

```tsx
import { mercury } from '@rosicrucian-dev/icons' // manifest entry
```

## 7. Gallery on rosicrucian.dev

A page at `/icons`, not a separate site, reading the published manifest:

- Every icon on a grid, at 24 and 48 px, light and dark.
- Search by name, category and keyword; filter by category.
- Click an icon: copy SVG, copy JSX, copy the import line; show its
  codepoint and ink centre.
- A short "how they're drawn" section (the grid, the stroke, the shared
  sizes), with the grid template to download.

It imports `@rosicrucian-dev/icons` like any consumer, so it is in sync
with each release without work. If the set grows past the org site, it can
move to its own domain later.

## 8. Documentation

- `README.md`: what it is, install, SVG and React usage, the categories,
  optical centring, credits and licence.
- `CONTRIBUTING.md`: the style rules (the header of `astroSymbols.ts`, as
  it stands, is most of this), the template, `npm run new-icon <name>`, how
  the tests enforce the rules, how to propose a new category.
- `CHANGELOG.md`: icons added or changed per version.

## 9. Licence and credits

MIT, copyright Rosicrucian Developers, as the org's site is. LICENSE also
carries Heroicons' notice for the house path while it remains, and the
README credits Astronomicon as the reference for the symbols' forms.

## 10. Starscroll afterwards

1. Add `@rosicrucian-dev/icons` and `-react` as dependencies.
2. `AstroSymbol` and `SymbolGroup` read path and ink centre from the
   manifest; `symbolFor(glyph)` becomes a lookup from Unicode to name.
3. `DignityIcon`, the numerals (`AstroNumber`) and the angle letters come
   from the package.
4. Delete `src/lib/astroSymbols.ts`.
5. The map's glyph textures (`sphere.ts`) draw from the manifest paths too.

## 11. Milestones

| Step | What                                                                                | Effort     |
| ---- | ----------------------------------------------------------------------------------- | ---------- |
| M1   | Repo, licence, the 36 symbols plus numerals and letters as SVG files, grid template | an evening |
| M2   | Build script, manifest, React package, rules as tests, CI                           | a day      |
| M3   | Publish 0.1.0 of both packages (provenance), CHANGELOG                              | an hour    |
| M4   | `/icons` gallery on rosicrucian.dev                                                 | a day      |
| M5   | Starscroll switched to the packages, `astroSymbols.ts` deleted                      | half a day |
| M6   | README and CONTRIBUTING polished, a short post or README section announcing it      | an evening |

## 12. Decisions to make first

- Keep Heroicons' house for domicile, or redraw it to own the whole set.
- Ship the numerals and letters as icons (they are drawn in the family) or
  keep them Starscroll's.
- Whether `fall` is its own file or the crown rendered turned (a file: the
  gallery and the manifest want one icon per name).
- Which categories to declare now for later sets (tarot, kabbalah, sacred
  geometry, alchemy) so names don't collide later.

## 13. Next steps, in order

1. **You:** create the empty repo `rosicrucian-dev/icons` on GitHub (MIT,
   no template), and make sure the `@rosicrucian-dev` npm scope exists
   (create the org at npmjs.com if it doesn't; it's free for public
   packages). Add an `NPM_TOKEN` secret to the repo, or set up trusted
   publishing from GitHub Actions.
2. **You:** settle the three remaining decisions (§12): keep or redraw the
   Heroicons house; ship numerals and letters; `fall` as its own file.
3. **Me, M1:** clone the repo beside the others, write the skeleton (§3),
   extract the symbols from Starscroll's `astroSymbols.ts` into one SVG
   each on the 24 grid, write the grid template, commit.
4. **Me, M2:** the build script, the manifest, the React package, the
   rules as tests, CI on push.
5. **You:** look at the SVGs in the repo and at a throwaway local page
   listing them, and say what's off.
6. **Me, M3:** tag `v0.1.0`; CI publishes both packages with provenance.
   Install them in a scratch project to prove the exports work.
7. **Me, M4:** the `/icons` page on rosicrucian.dev reading the published
   manifest, with search and copy.
8. **Me, M5:** Starscroll switched to the packages; `astroSymbols.ts`,
   `DignityIcon`'s paths and the numerals deleted there.
9. **Both, M6:** README and CONTRIBUTING; a line on the org site's front
   page; a note wherever the org announces things.
