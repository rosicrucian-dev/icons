// The packages, from icons/: @rosicrucian-dev/icons (the SVGs and the
// manifest) and @rosicrucian-dev/icons-react (a component per icon, as
// Heroicons makes them). Run with `npm run build`; writes under packages/,
// which is not committed.

import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { componentName, readIcons, ROOT, type Icon } from './icons.ts'

export function manifest(icons: Icon[]) {
  return Object.fromEntries(
    icons.map(({ svg: _svg, ...icon }) => [icon.name, icon]),
  )
}

/** A component's source, as Heroicons writes theirs: a forwardRef'd svg
 * taking any svg prop, and an optional accessible title. */
export function componentSource(icon: Icon): string {
  const name = componentName(icon.name)
  return `import * as React from "react";
function ${name}({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: ${JSON.stringify(icon.path)}
  }));
}
const ForwardRef = /*#__PURE__*/ React.forwardRef(${name});
export default ForwardRef;
`
}

export function componentTypes(icon: Icon): string {
  const name = componentName(icon.name)
  return `import * as React from 'react';
declare const ${name}: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
    title?: string | undefined;
    titleId?: string | undefined;
} & React.RefAttributes<SVGSVGElement>>;
export default ${name};
`
}

export function indexSource(icons: Icon[], ext: string): string {
  return (
    icons
      .map(
        (i) =>
          `export { default as ${componentName(i.name)} } from './${componentName(i.name)}${ext}'`,
      )
      .join('\n') + '\n'
  )
}

export function build(out = join(ROOT, 'packages')) {
  const icons = readIcons()

  // @rosicrucian-dev/icons
  const svgDir = join(out, 'src/svg/24/outline')
  rmSync(join(out, 'src/svg'), { recursive: true, force: true })
  mkdirSync(svgDir, { recursive: true })
  for (const icon of icons)
    copyFileSync(
      join(ROOT, 'src/24/outline', `${icon.name}.svg`),
      join(svgDir, `${icon.name}.svg`),
    )
  writeFileSync(
    join(out, 'src/icons.json'),
    JSON.stringify(manifest(icons), null, 2) + '\n',
  )
  copyFileSync(join(ROOT, 'README.md'), join(out, 'src/README.md'))

  // @rosicrucian-dev/icons-react
  const reactDir = join(out, 'react/24/outline')
  rmSync(join(out, 'react/24'), { recursive: true, force: true })
  mkdirSync(reactDir, { recursive: true })
  for (const icon of icons) {
    const name = componentName(icon.name)
    writeFileSync(join(reactDir, `${name}.js`), componentSource(icon))
    writeFileSync(join(reactDir, `${name}.d.ts`), componentTypes(icon))
  }
  writeFileSync(join(reactDir, 'index.js'), indexSource(icons, '.js'))
  writeFileSync(join(reactDir, 'index.d.ts'), indexSource(icons, '.js'))
  copyFileSync(join(ROOT, 'README.md'), join(out, 'react/README.md'))

  return icons
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const icons = build()
  console.log(`${icons.length} icons built into packages/`)
}
