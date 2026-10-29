# Contributing

Icons are welcome: new symbols in the categories that exist, and new
categories where a tradition has a set of symbols worth drawing well. Open
an issue first for a new category, so names are agreed before the drawing.

## The rules

Every icon is one `<path>` on a 24-unit grid, in the manner of Heroicons,
and in one family with the rest:

- **One stroke of 1.5**, round caps and joins, no fill. Strokes that meet,
  meet: no near misses.
- **One height.** The ink runs from 3.75 to 20.25 (16.5 tall), so symbols
  side by side stand alike. Bodies sit on the 4.5–19.5 baseline; a part
  that overhangs (a crown's points, a roof's eaves) may reach 2.25 or
  21.75. Width follows the shape, no wider than 19.5.
- **Slants at 45°** where a slant is free.
- **Shared sizes** where symbols share a part, so they read as kin:
  circles small (2.25: Pluto's, Uranus's, the nodes', Cancer's, Leo's, the
  opposition's), medium (4.5: Venus's, Mars's, the conjunction's), large
  (8.25: the Sun, the Moon); long bows of radius 15 (Gemini, Pisces,
  Uranus); cups of 6 (Pluto, Neptune); hooks of 3.75 (Saturn, Jupiter,
  Aries); crossbars 7.5 wide.
- **Grid units**, not pixels: coordinates on quarters and eighths of a
  unit where they can be (3.75, 4.5, 8.25), so icons scale cleanly.
- **The file is the drawing.** No transforms, no groups, no ids, no fill or
  stroke colour but `currentColor`:

  ```svg
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
    <path stroke-linecap="round" stroke-linejoin="round" d="…" />
  </svg>
  ```

The tests (`npm test`) check these for every file in `icons/`.

## Drawing one

1. Copy [`template/grid.svg`](template/grid.svg) to
   `icons/24/outline/<name>.svg` (`npm run new-icon <name>` does this). The
   name is words in kebab case, never the Unicode character: `north-node`,
   not `☊`.
2. Draw on the grid in any SVG editor, or by hand in the path. Delete the
   guides when done: the file holds the one path.
3. Add the icon to `icons/meta.json`: its category, the Unicode codepoint
   it stands for if there is one (and the character), a few keywords for
   search, and its source (`original`, or `heroicons` with the Heroicon's
   name when it is one or builds on one). The ink's bounds and centre are
   measured from the drawing at build time.
4. `npm test`, and `npm run sheet` for a contact sheet of the whole set
   (`docs/sheet.html`) to see the new icon beside its kin, light and
   dark, at 64, 24, 20 and 16 px; then a pull request with the icon drawn
   at 24 and 48 px in the description.

## From Heroicons

Heroicons is the base. An icon of theirs that serves a tradition's meaning
may come in as it is, or adapted, named for the meaning here (`domicile` is
their `home`), with `"source": "heroicons"` in the metadata. Their MIT
notice is in [LICENSE](LICENSE).
