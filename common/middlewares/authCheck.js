const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const User = require('../../models/userModel');
const statusCodes = require('../constants/statusCodes');
const statusMessages = require('../constants/statusMessages');

exports.isAuthenticated = (req, res, next) => {
  try {
    if (req.headers['authorization']) {
      let token = req.headers['authorization'];
      // jwt verify the token
      jwt.verify(token, config.apiSecret, function (err, decoded) {
        if (err) {
          return res.status(statusCodes.BAD_REQUEST).send({
            code: statusCodes.errorCodes.AUTH_FAILED,
            msg: statusMessages.errorMessages.AUTH_FAILED,
          });
        } else {
          User.findOne({ _id: decoded.userId }, function (err, result) {
            if (err) {
              return res.status(statusCodes.BAD_REQUEST).send({
                code: statusCodes.errorCodes.AUTH_FAILED,
                msg: err.message,
              });
            } else {
              if (result) {
                next();
              } else {
                return res.status(statusCodes.BAD_REQUEST).send({
                  code: statusCodes.errorCodes.USER_DOES_NOT_EXIST,
                  msg: statusMessages.errorMessages.USER_DOES_NOT_EXIST,
                });
              }
            }
          });
        }
      });
    } else {
      return res.status(statusCodes.BAD_REQUEST).send({
        code: statusCodes.errorCodes.AUTH_TOKEN_MISSING,
        msg: statusMessages.errorMessages.AUTH_TOKEN_MISSING,
      });
    }
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      code: statusCodes.NO_RECORDS,
      msg: err || err.message || statusMessages.INTERNAL_SERVER_ERROR,
    });
  }
};
