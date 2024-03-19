require('dotenv').config()

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const NODE_ENV = process.env.NODE_ENV || ""
const dev = process.env.NODE_ENV !== 'production'

const hostname = 'localhost'
const port = process.env.PORT || 5000

console.log("NODE_ENV ->", NODE_ENV);
console.log("Development Build ->", dev);
console.log("PORT ->", port);

console.log("dbHost: ", dbHost)
console.log("dbUser: ", dbUser)
console.log("dbName: ", dbName)
console.log("dbPassword: ", dbPassword)
console.log("dbInstance: ", dbInstance)


// when using middleware `hostname` and `port` must be provided below
const app = next({ dev: dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {

    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }

    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})