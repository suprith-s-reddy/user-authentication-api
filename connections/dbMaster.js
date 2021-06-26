const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../common/middlewares/logger').logger;

// eslint-disable-next-line no-unused-vars
const db = mongoose.createConnection(
  config.db.master,
  config.db.options,
  function (err, _db) {
    if (err) {
      console.log(
        'Unable to connect to MongoDB cluster. Please start the server. Error:',
        err
      );
    } else {
      console.log('Connected to MongoDB cluster successfully');
    }
  }
);

// When successfully connected
db.on('connected', function () {
  logger.info('Mongoose connection open to master DB');
});

// If the connection throws an error
db.on('error', function (err) {
  logger.debug('Mongoose connection error for master DB: ' + err);
});

// When the connection is disconnected
db.on('disconnected', function () {
  logger.debug('Mongoose connection disconnected for master DB');
});

//When connection is reconnected
db.on('reconnected', function () {
  logger.info('Mongoose connection reconnected for master DB');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  db.close(function () {
    logger.debug(
      'Mongoose connection disconnected for master DB through app termination'
    );
    process.exit(0);
  });
});

module.exports = db;
