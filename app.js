const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const express = require('express')
const helmet = require('helmet')
const routes = require('./src/api/routes')
const app = express()

dotenv.config()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(`${__dirname}/src/public`))
app.use(helmet())
routes(app)

module.exports = app
