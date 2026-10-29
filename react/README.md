<p align="center">
  <strong>Rosicrucian Icons</strong>
</p>

<p align="center">
  Hand-crafted SVG icons of the symbols of the spiritual traditions, drawn in the manner of <a href="https://heroicons.com">Heroicons</a>, by <a href="https://rosicrucian.dev">Rosicrucian Developers</a>. <br>Available as basic SVG icons and via first-party <a href="#react">React</a> and <a href="#vue">Vue</a> libraries.
<p>

<p align="center">
  <a href="https://rosicrucian.dev/icons"><strong>Browse at rosicrucian.dev/icons &rarr;</strong></a>
</p>

The set starts with astrology: the planets, Chiron and the Moon's nodes, the twelve signs, the aspects, the four elements, the dignities, numerals in the same stroke for house numbers, and the four angles as their letters (AC, MC, DC, IC). Other traditions follow.

## Basic Usage

The quickest way to use these icons is to simply copy the source for the icon you need from [`src/24/outline`](src/24/outline) and inline it directly into your HTML:

```html
<svg
  class="size-6 text-gray-500"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  stroke-width="1.5"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M16.5 8.25a4.5 4.5 0 1 1-9.0 0 4.5 4.5 0 0 1 9.0 0ZM12 12.75v7.5M8.25 16.5h7.5"
  />
</svg>
```

The icons are preconfigured to be stylable by setting the `color` CSS property, either manually or using utility classes like `text-gray-500` in a framework like [Tailwind CSS](https://tailwindcss.com).

The `rosicrucian-icons` package on npm has the same SVG files, under `24/outline`.

## React

First, install `@rosicrucian-icons/react` from npm:

```sh
npm install @rosicrucian-icons/react
```

Now each icon can be imported individually as a React component:

```js
import { VenusIcon } from '@rosicrucian-icons/react/24/outline'

function MyComponent() {
  return (
    <div>
      <VenusIcon className="size-6 text-blue-500" />
      <p>...</p>
    </div>
  )
}
```

The 24x24 outline icons can be imported from `@rosicrucian-icons/react/24/outline`; other sizes and styles follow as they are drawn.

Icons use an upper camel case naming convention and are always suffixed with the word `Icon`.

## Vue

First, install `@rosicrucian-icons/vue` from npm:

```sh
npm install @rosicrucian-icons/vue
```

Now each icon can be imported individually as a Vue component:

```vue
<template>
  <div>
    <VenusIcon class="size-6 text-blue-500" />
    <p>...</p>
  </div>
</template>

<script setup>
import { VenusIcon } from '@rosicrucian-icons/vue/24/outline'
</script>
```

The 24x24 outline icons can be imported from `@rosicrucian-icons/vue/24/outline`.

Icons use an upper camel case naming convention and are always suffixed with the word `Icon`.

## Contributing

New icons are welcome, in the categories that exist and in new ones. See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for how they're drawn.

## License

This library is MIT licensed. `domicile` and `detriment` are built on [Heroicons](https://github.com/tailwindlabs/heroicons) by Tailwind Labs, also MIT; the symbols' conventional forms were drawn with [Astronomicon](https://astronomicon.co) as the reference.
