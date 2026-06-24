import fs from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve('./')
const clientDist = path.join(root, 'dist/client')
const serverDist = path.join(root, 'dist/server')

const files = [
  path.join(clientDist, 'index.html'),
  path.join(serverDist, 'src/entry-server.js')
]

async function assertExists(file) {
  try {
    await fs.access(file)
  } catch (error) {
    throw new Error(`Missing expected build file: ${file}`)
  }
}

async function assertHtmlContains(file, fragment) {
  const content = await fs.readFile(file, 'utf-8')
  if (!content.includes(fragment)) {
    throw new Error(`Expected ${file} to contain ${JSON.stringify(fragment)}`)
  }
}

async function run() {
  for (const file of files) {
    await assertExists(file)
  }

  await assertHtmlContains(path.join(clientDist, 'index.html'), '<!--ssr-outlet-->')
  await assertHtmlContains(path.join(serverDist, 'src/entry-server.js'), 'export function render')

  console.log('✅ Static CI/CD validation passed.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
