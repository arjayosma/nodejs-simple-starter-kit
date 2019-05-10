const winston = require('winston')
const config = require('config')
const { strings } = require('../constants')

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: config.get(strings.CONFIG_LOGGER_CONSOLE_LEVEL)
    }),
    new winston.transports.File({
      level: config.get(strings.CONFIG_LOGGER_FILE_LEVEL),
      filename: config.get(strings.CONFIG_LOGGER_FILE_FILENAME)
    })
  ]
})

module.exports = logger
