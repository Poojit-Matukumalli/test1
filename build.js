#!/usr/bin/env node

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Build client
console.log('Building client...')
execSync('vite build', { cwd: __dirname, stdio: 'inherit' })

// Create server dist directory and copy entry-server.js
const serverDistDir = path.join(__dirname, 'dist/server/src')
const entryServerSrc = path.join(__dirname, 'src/entry-server.js')
const entryServerDist = path.join(serverDistDir, 'entry-server.js')

console.log('Setting up server bundle...')
fs.mkdirSync(serverDistDir, { recursive: true })
fs.copyFileSync(entryServerSrc, entryServerDist)

console.log('✅ Build complete')
