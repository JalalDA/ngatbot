
const { createServer } = require('http')
const next = require('next')
const express = require('express')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = process.env.PORT || 5000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // Parse JSON bodies
  server.use(express.json())
  server.use(express.urlencoded({ extended: false }))

  // Import and register backend routes
  const { registerRoutes } = require('./server/routes')
  const httpServer = registerRoutes(server)

  // Handle Next.js requests
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  httpServer.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
