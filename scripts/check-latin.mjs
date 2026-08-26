#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

/**
 * Guards the Serbian copy against accidental Cyrillic.
 *
 * The site is written in Serbian Latin. Cyrillic characters slip in when text
 * is copied from another source, and the result renders as a word that looks
 * almost right but is unsearchable and, in a URL slug, broken. Latin and
 * Cyrillic homoglyphs (о/o, а/a, с/c, е/e) make this invisible on review, so it
 * is checked mechanically instead.
 */

const ROOT = new URL('..', import.meta.url).pathname
const SCAN_DIRS = ['src', 'scripts']
const EXTENSIONS = ['.ts', '.tsx', '.mjs', '.js', '.css', '.json', '.md']
// This file necessarily contains the very characters it looks for.
const SELF = 'scripts/check-latin.mjs'
const CYRILLIC = /[Ѐ-ӿԀ-ԯ]/

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      yield* walk(path)
    } else if (EXTENSIONS.some((extension) => entry.name.endsWith(extension))) {
      yield path
    }
  }
}

const problems = []

for (const dir of SCAN_DIRS) {
  for await (const path of walk(join(ROOT, dir))) {
    if (relative(ROOT, path) === SELF) continue
    const content = await readFile(path, 'utf8')
    if (!CYRILLIC.test(content)) continue

    content.split('\n').forEach((line, index) => {
      const match = line.match(CYRILLIC)
      if (!match) return
      problems.push({
        file: relative(ROOT, path),
        line: index + 1,
        column: (match.index ?? 0) + 1,
        text: line.trim().slice(0, 100),
      })
    })
  }
}

if (problems.length === 0) {
  console.log('check-latin: nema ćiriličnih karaktera.')
  process.exit(0)
}

console.error(
  `check-latin: pronađeno ${problems.length} ćiriličnih karaktera u latiničnom tekstu:\n`,
)
for (const problem of problems) {
  console.error(`  ${problem.file}:${problem.line}:${problem.column}  ${problem.text}`)
}
process.exit(1)
