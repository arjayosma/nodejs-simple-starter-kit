const http = require('http')
const normalizePort = require('normalize-port')
const { logger } = require('./src/util')
const app = require('./app')
const port = normalizePort(process.env.PORT)
app.set('port', port)
const server = http.createServer(app)

server.listen(port, () => {
  logger.info(`Starting application on: ${port}`)
  const uri = process.env.DB_URI
  logger.info(`Connecting to: ${uri}`)
})
