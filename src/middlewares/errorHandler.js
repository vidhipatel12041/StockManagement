const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
  logger.error(err.message || 'Server error', { stack: err.stack });
  const status = err.status || 500;
  if (req.accepts('html')) return res.status(status).render('errors/500', { error: err });
  res.status(status).json({ error: err.message || 'Internal Server Error' });
}

module.exports = errorHandler;
