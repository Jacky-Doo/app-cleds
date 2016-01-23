'use strict';

var winston = require('winston');

var fileTransport = new winston.transports.File({
  level:'info',
  filename: './log/all-log.log',
  stream: '',
  handleException: true,
  json: true,
  maxsize: 5242880,
  maxFiles: 5,
  colorize: false
});
var consoleTransport = new winston.transports.Console({
  level: 'debug',
  handleExceptions: true,
  json: false,
  colorize: true
});

var logger = new winston.Logger({
  //transports: [consoleTransport, fileTransport],
  transports: [consoleTransport],
  exitOnError: false,
});

logger.stream = {
  write: function(message, encoding){
    logger.info(message.slice(0, (message.length-1)));
  }
}

module.exports = logger;