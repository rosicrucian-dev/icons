// Heroicons' lint (tailwindlabs/heroicons, scripts/verify-names.js): every
// style holds the same icons, and every file name is words in kebab case.
// One style so far; the check between styles starts mattering with the
// second.

const fs = require('fs').promises
const path = require('path')
const { deprecated } = require('./deprecated')

const srcPaths = {
  outline: path.resolve(__dirname, '../src/24/outline/'),
}

async function main() {
  let files = await Promise.all(
    Object.entries(srcPaths).map(async ([name, path]) => {
      return { name, files: (await fs.readdir(path)).filter((file) => file.endsWith('.svg')) }
    })
  )

  let diffs = []
  for (let current of files) {
    for (let file of current.files) {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*\.svg$/.test(file)) {
        diffs.push({ package: current.name, file, 'Missing in?': '(not kebab case)' })
      }
    }
    for (let other of files) {
      if (current === other) continue

      for (let file of current.files) {
        if (!other.files.includes(file)) {
          if (deprecated.includes(file)) continue

          diffs.push({
            package: current.name,
            file: file,
            'Missing in?': other.name,
          })
        }
      }
    }
  }
  if (diffs.length > 0) {
    console.table(diffs)
    process.exit(1)
  } else {
    console.log('All good!')
  }
}

main()
