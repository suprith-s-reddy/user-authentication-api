const Promise = require('bluebird');
const config = require('../config/config');
const bcrypt = require('bcryptjs');
// const validator = require('validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const base64 = require('base-64');

// generates a hash from a raw password using bcrypt salting
exports.encryptPassword = async (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
};

// checks for a valid email
// exports.validateEmail = (email) => {
//     return validator.isEmail(email);
// };

// generates a token with a valid expiry for a particular userId using jwt
exports.generateToken = async (userId) => {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    resolve({
      token: jwt.sign(
        {
          userId: userId,
        },
        config.apiSecret,
        {
          expiresIn: config.tokenValidity.api,
        }
      ),
      tokenExpiryTime: moment().add(config.tokenValidity.api, 's')._d,
    });
  });
};

exports.getOneTimePassword = () => {
  let digits = '0123456789';
  let val = '';
  for (let i = 0; i < 6; i++) {
    val += digits[Math.floor(Math.random() * 10)];
  }
  return val;
};

exports.getOneTimePasswordValidity = () => {
  let pwdValidity = moment().add(config.OTPValidity.api, 's')._d;
  return pwdValidity;
};

exports.toBase64 = (data) => {
  let base64EncodedString = base64.encode(data);
  return base64EncodedString;
};
