import { copyFileSync, mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

// IMPORTANT: This script exists because automatic GitHub Pages Jekyll builds
// do not run npm scripts. See .docs/sticky-headings-delivery.md for rationale.
// Yes, committing assets/js/vendor/sticky-headings.js is intentional.

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const source = resolve(root, "node_modules/@chadonsom/sticky-headings/dist/browser.js")
const target = resolve(root, "assets/js/vendor/sticky-headings.js")

mkdirSync(dirname(target), { recursive: true })
copyFileSync(source, target)

console.log("Synced sticky headings browser bundle to", target)
