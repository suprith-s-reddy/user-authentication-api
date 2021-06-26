const interceptor = require('express-interceptor');
const logger = require('./logger').logger;

module.exports = interceptor((req, res) => {
  return {
    isInterceptable: () => {
      if (res && (res.statusCode == 400 || res.statusCode == 500)) {
        logger.error(
          'Request path: %s',
          req.originalUrl || req.url || req.baseUrl
        );
        logger.error('Request object: %s', JSON.stringify(req.body));
        return true;
      }
      return false;
    },
    // eslint-disable-next-line no-unused-vars
    afterSend: (oldBody, newBody) => {
      logger.error('Response object: %s', JSON.stringify(oldBody));
    },
  };
});
