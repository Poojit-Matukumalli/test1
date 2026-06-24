import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientDist = path.join(__dirname, 'dist/client')
const serverDist = path.join(__dirname, 'dist/server')
const port = process.env.PORT ? Number(process.env.PORT) : 4174

const { render } = await import(path.join(serverDist, 'src/entry-server.js'))
const template = await fs.readFile(path.join(clientDist, 'index.html'), 'utf-8')

function getContentType(filePath) {
  if (filePath.endsWith('.js')) return 'application/javascript'
  if (filePath.endsWith('.css')) return 'text/css'
  if (filePath.endsWith('.html')) return 'text/html'
  if (filePath.endsWith('.json')) return 'application/json'
  if (filePath.endsWith('.png')) return 'image/png'
  return 'application/octet-stream'
}

const server = http.createServer(async (req, res) => {
  const url = req.url || '/'

  if (url.startsWith('/assets/') || url.endsWith('.js') || url.endsWith('.css') || url.endsWith('.png')) {
    const filePath = path.join(clientDist, url)
    try {
      const data = await fs.readFile(filePath)
      res.writeHead(200, { 'Content-Type': getContentType(filePath) })
      res.end(data)
      return
    } catch (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found')
      return
    }
  }

  const appHtml = render()
  const html = template.replace('<div id="app"><!--ssr-outlet--></div>', `<div id="app">${appHtml}</div>`)
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(html)
})

server.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`)
})
