const mongoose = require('mongoose');
const db = require('../connections/dbMaster');
mongoose.Promise = require('bluebird');
const defaultSchemaAttr = require('../common/plugins/defaultSchemaAttr');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      email: true,
      trim: true,
      sparse: true,
      index: true,
      required: true,
    },
    password: {
      type: String,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
    },
    gender: {
      type: String,
      lowercase: true,
      trim: true,
    },
    birthDate: {
      type: Date,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    areTermsAgreed: {
      type: Boolean,
      default: false,
    },
    profilePicUrl: {
      type: String,
    },
    profilePicThumbUrl: {
      type: String,
    },
    termsAndConditionsUrl: {
      type: String,
    },
    lang: {
      type: String,
      enum: config.allowedLanguages,
      default: config.defaultLanguage,
    },
    hasOptedForAds: {
      type: Boolean,
      default: false,
    },
    adOptOutIds: {
      type: String,
    },
    token: {
      type: String,
    },
    tokenExpiryTime: {
      type: Date,
    },
    oneTimePassword: {
      token: {
        type: String,
      },
      tokenExpiryTime: {
        type: Date,
      },
    },
    profileDescription: {
      type: String,
    },
  },
  {
    minimize: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

userSchema.methods.verifyPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      // console.log(isMatch);
      if (err) reject(err);
      else resolve(isMatch);
    });
  });
};

userSchema.plugin(defaultSchemaAttr);

module.exports = db.model('User', userSchema, 'users');
