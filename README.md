# Rosicrucian Icons

The symbols of the spiritual traditions, drawn in one family, in the manner
of [Heroicons](https://heroicons.com): a 24-unit grid, one 1.5 stroke, round
caps and joins, every symbol the same height. Heroicons is the base we build
on: its icons are welcome here where they serve, and ours are drawn to stand
beside them.

It starts with astrology, the symbols
[Starscroll](https://starscroll.net) draws: the planets, Chiron and the
Moon's nodes, the twelve signs, the aspects, the four elements, the
dignities, and numerals and letters in the same stroke for house numbers
and the angles. Other traditions follow: tarot, kabbalah, alchemy, sacred
geometry.

An open source project of [Rosicrucian Developers](https://rosicrucian.dev).
MIT.

## Using the icons

Two packages (coming with the first release):

- **`@rosicrucian-dev/icons`**: the SVG files, and `icons.json`, a manifest
  with each icon's name, category, Unicode codepoint, keywords, path and
  the centre of its ink. For any framework, or none.
- **`@rosicrucian-dev/icons-react`**: a component per icon.

```tsx
import { MercuryIcon, TrineIcon } from '@rosicrucian-dev/icons-react/24/outline'

<MercuryIcon className="size-6 text-zinc-500" />
```

Until then, the SVGs are in [`icons/24/outline`](icons/24/outline), each a
single path on the 24 grid, ready to paste.

### Set by the ink, not the box

Heroicons centre an icon in its box. These do too, but a symbol's ink is
rarely centred: the Moon's bow sits to one side, a crown's weight is low.
The manifest gives each icon the centre of its ink (`ink.x`, `ink.y`), so
an app that places symbols precisely, on a chart wheel or in a grid of
discs, can set the ink where it wants it. Starscroll does.

## The set

| Category  | Icons                                                                                                                                   |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| planets   | sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto                                                                |
| points    | north-node, south-node, chiron                                                                                                          |
| signs     | aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces                                     |
| aspects   | conjunction, opposition, square, trine, quincunx, sextile                                                                               |
| elements  | fire, earth, air, water                                                                                                                 |
| dignities | domicile, exaltation, detriment, fall, retrograde                                                                                       |
| numerals  | numeral-0 … numeral-9                                                                                                                   |
| letters   | letter-a, letter-c, letter-d, letter-i, letter-m (the angles: AC, MC, DC, IC)                                                           |

[`icons/meta.json`](icons/meta.json) has each icon's category, codepoint,
keywords, ink centre and source.

## How they're drawn

See [CONTRIBUTING.md](CONTRIBUTING.md) for the rules, and
[`template/grid.svg`](template/grid.svg) for the grid to draw on.

## Credits

- [Heroicons](https://github.com/tailwindlabs/heroicons) by Tailwind Labs,
  MIT: the manner, and the icons marked `"source": "heroicons"`.
- The symbols' forms follow the conventions of the tradition, drawn fresh
  on this grid; [Astronomicon](https://astronomicon.co) was the reference
  for how the conventional forms are constructed.
