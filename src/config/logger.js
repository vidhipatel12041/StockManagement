const winston = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '..', '..', 'logs');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDir, 'app.log') })
  ]
});
logger.stream = { write: (message) => logger.info(message.trim()) };
module.exports = logger;
