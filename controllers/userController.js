const statusCodes = require('../common/constants/statusCodes');
const statusMessages = require('../common/constants/statusMessages');
const { UserService } = require('../services/mongo');
const { MailerService } = require('../services/mailer');
const { UserQueryBuilderService } = require('../services/query-builder');
const Util = require('../common/util');
const moment = require('moment');

exports.register = async (req, res, next) => {
  try {
    let queryObj = UserQueryBuilderService.getByEmailOrUserNameQuery(
      req.body.email,
      req.body.userName
    );
    let registeredUser = await UserService.findOneByQuery(
      queryObj.query,
      queryObj.projection
    );
    if (!registeredUser) {
      req.body.password = await Util.encryptPassword(req.body.password);
      let newUser = await UserService.addOne(req.body);
      if (newUser) {
        let tokenObj = await Util.generateToken(newUser.id);
        newUser.token = tokenObj.token;
        newUser.tokenExpiryTime = tokenObj.tokenExpiryTime;
        newUser.password = undefined;
        newUser.oneTimePassword = undefined;
        let oneTimePassword = Util.getOneTimePassword();
        let oneTimePasswordExpiryTime = Util.getOneTimePasswordValidity();
        let data = {
          oneTimePassword: {
            token: oneTimePassword,
            tokenExpiryTime: oneTimePasswordExpiryTime,
          },
        };
        let updateQueryObj = UserQueryBuilderService.getByIdQuery(newUser.id);
        await UserService.updateOneByQuery(
          updateQueryObj.query,
          data,
          updateQueryObj.projection
        );
        MailerService.sendWelcomeEmailWithOTPVerification(
          newUser,
          oneTimePassword
        );
        return res.status(statusCodes.SUCCESS).send({
          code: statusCodes.successCodes.USER_REGISTERED_SUCCESSFULLY,
          msg: statusMessages.successMessages.USER_REGISTERED_SUCCESSFULLY,
          data: newUser,
        });
      } else {
        return res.status(statusCodes.BAD_REQUEST).send({
          code: statusCodes.errorCodes.USER_REGISTRATION_FAILED,
          msg: statusMessages.errorMessages.USER_REGISTRATION_FAILED,
        });
      }
    } else {
      return res.status(statusCodes.BAD_REQUEST).send({
        code: statusCodes.errorCodes.USER_ALREADY_EXISTS,
        msg: statusMessages.errorMessages.USER_ALREADY_EXISTS,
      });
    }
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      code: statusCodes.NO_RECORDS,
      msg: err || err.message || statusMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.validateUniqueUserName = async (req, res, next) => {
  try {
    let queryObj = UserQueryBuilderService.getByUserNameQuery(
      req.body.userName
    );
    let user = await UserService.findOneByQuery(
      queryObj.query,
      queryObj.projection
    );
    if (user) {
      return res.status(statusCodes.BAD_REQUEST).send({
        code: statusCodes.errorCodes.USERNAME_NOT_AVAILABLE,
        msg: statusMessages.successMessages.USERNAME_NOT_AVAILABLE,
      });
    } else {
      return res.status(statusCodes.SUCCESS).send({
        code: statusCodes.successCodes.USERNAME_AVAILABLE,
        msg: statusMessages.successMessages.USERNAME_AVAILABLE,
      });
    }
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      code: statusCodes.NO_RECORDS,
      msg: err || err.message || statusMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.verifyUserAccount = async (req, res, next) => {
  try {
    let queryObj = UserQueryBuilderService.getByIdQuery(req.params.id);
    let user = await UserService.findOneByQuery(
      queryObj.query,
      queryObj.projection
    );
    if (user.oneTimePassword.token === req.body.oneTimePassword) {
      if (moment(user.oneTimePassword.tokenExpiryTime).isAfter(Date.now())) {
        if (req.body.isAccountVerified === true) {
          let data = { isAccountVerified: true };
          let verifiedUser = await UserService.updateOneByQuery(
            queryObj.query,
            data,
            queryObj.projection
          );
          if (verifiedUser) {
            verifiedUser.password = undefined;
            verifiedUser.oneTimePassword = undefined;
            MailerService.sendAccountVerificationConfirmationEmail(
              verifiedUser
            );
            res.status(statusCodes.SUCCESS).send({
              code: statusCodes.successCodes.USER_ACCOUNT_VERIFIED,
              msg: statusMessages.successMessages.USER_ACCOUNT_VERIFIED,
              data: verifiedUser,
            });
          } else {
            res.status(statusCodes.BAD_REQUEST).send({
              code: statusCodes.errorCodes.USER_ACCOUNT_VERIFICATION_FAILED,
              msg: statusMessages.errorMessages
                .USER_ACCOUNT_VERIFICATION_FAILED,
            });
          }
        } else {
          res.status(statusCodes.BAD_REQUEST).send({
            code: statusCodes.errorCodes.USER_ACCOUNT_VERIFICATION_FAILED,
            msg: statusMessages.errorMessages.USER_ACCOUNT_VERIFICATION_FAILED,
          });
        }
      } else {
        res.status(statusCodes.BAD_REQUEST).send({
          code: statusCodes.errorCodes.OTP_IS_EXPIRED,
          msg: statusMessages.errorMessages.OTP_IS_EXPIRED,
        });
      }
    } else {
      res.status(statusCodes.BAD_REQUEST).send({
        code: statusCodes.errorCodes.INVALID_OTP,
        msg: statusMessages.errorMessages.INVALID_OTP,
      });
    }
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      code: statusCodes.NO_RECORDS,
      msg: err || err.message || statusMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.resendOTPforVerification = async (req, res, next) => {
  try {
    let queryObj = UserQueryBuilderService.getByIdQuery(req.params.id);
    let user = await UserService.findOneByQuery(
      queryObj.query,
      queryObj.projection
    );
    if (user) {
      let oneTimePassword = Util.getOneTimePassword();
      let oneTimePasswordExpiryTime = Util.getOneTimePasswordValidity();
      let data = {
        oneTimePassword: {
          token: oneTimePassword,
          tokenExpiryTime: oneTimePasswordExpiryTime,
        },
      };
      await UserService.updateOneByQuery(
        queryObj.query,
        data,
        queryObj.projection
      );
      MailerService.sendResendOTPEmail(user, oneTimePassword);
      res.status(statusCodes.SUCCESS).send({
        code: statusCodes.successCodes.OTP_RESENT_SUCCESSFULLY,
        msg: statusMessages.successMessages.OTP_RESENT_SUCCESSFULLY,
      });
    } else {
      return res.status(statusCodes.BAD_REQUEST).send({
        code: statusCodes.errorCodes.USER_DOES_NOT_EXIST,
        msg: statusMessages.errorMessages.USER_DOES_NOT_EXIST,
      });
    }
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      code: statusCodes.NO_RECORDS,
      msg: err || err.message || statusMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    let queryObj = UserQueryBuilderService.getLoginQuery(req.body.userName);
    let user = await UserService.findOneByQuery(
      queryObj.query,
      queryObj.projection
    );
    if (user) {
      if (user.password && (await user.verifyPassword(req.body.password))) {
        let tokenObj = await Util.generateToken(user.id);
        // set token validity values
        user.token = tokenObj.token;
        user.tokenExpiryTime = tokenObj.tokenExpiryTime;
        user.password = undefined;
        user.oneTimePassword = undefined;

        return res.status(statusCodes.SUCCESS).send({
          code: statusCodes.successCodes.USER_LOGGED_IN_SUCCESSFULLY,
          msg: statusMessages.successMessages.USER_LOGGED_IN_SUCCESSFULLY,
          data: user,
        });
      } else {
        return res.status(statusCodes.BAD_REQUEST).send({
          code: statusCodes.errorCodes.INVALID_CREDENTIALS,
          msg: statusMessages.errorMessages.INVALID_CREDENTIALS,
        });
      }
    } else {
      return res.status(statusCodes.BAD_REQUEST).send({
        code: statusCodes.errorCodes.USER_DOES_NOT_EXIST,
        msg: statusMessages.errorMessages.USER_DOES_NOT_EXIST,
      });
    }
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      code: statusCodes.NO_RECORDS,
      msg: err || err.message || statusMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.update = async (req, res, next) => {
  try {
    let queryObj = UserQueryBuilderService.getByIdQuery(req.params.id);
    let data = req.body;
    let user = await UserService.findOneByQuery(
      queryObj.query,
      queryObj.projection
    );
    if (user) {
      // add picture upload option here using multer
      let updatedUser = await UserService.updateOneByQuery(
        queryObj.query,
        data,
        queryObj.projection
      );
      if (updatedUser) {
        updatedUser.password = undefined;
        updatedUser.oneTimePassword = undefined;
        res.status(statusCodes.SUCCESS).send({
          code: statusCodes.successCodes.USER_INFO_UPDATED_SUCCESSFULLY,
          msg: statusMessages.successMessages.USER_INFO_UPDATED_SUCCESSFULLY,
          data: updatedUser,
        });
      } else {
        res.status(statusMessages.BAD_REQUEST).send({
          code: statusCodes.errorCodes.USER_INFO_UPDATE_FAILED,
          msg: statusMessages.errorMessages.USER_INFO_UPDATE_FAILED,
        });
      }
    } else {
      res.status(statusCodes.NOT_FOUND).send({
        code: statusCodes.errorCodes.USER_DOES_NOT_EXIST,
        msg: statusMessages.errorMessages.USER_DOES_NOT_EXIST,
      });
    }
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      code: statusCodes.NO_RECORDS,
      msg: err || err.message || statusMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.sendPasswordResetCode = async (req, res, next) => {
  try {
    let queryObj = UserQueryBuilderService.getByEmailQuery(req.body.email);
    let user = await UserService.findOneByQuery(
      queryObj.query,
      queryObj.projection
    );
    if (user) {
      let oneTimePassword = Util.getOneTimePassword();
      let oneTimePasswordExpiryTime = Util.getOneTimePasswordValidity();
      let data = {
        oneTimePassword: {
          token: oneTimePassword,
          tokenExpiryTime: oneTimePasswordExpiryTime,
        },
      };
      await UserService.updateOneByQuery(
        queryObj.query,
        data,
        queryObj.projection
      );
      MailerService.sendForgotPasswordOTPEmail(user, oneTimePassword);
      res.status(statusCodes.SUCCESS).send({
        code: statusCodes.successCodes.OTP_SENT_SUCCESSFULLY,
        msg: statusMessages.successMessages.OTP_SENT_SUCCESSFULLY,
      });
    } else {
      res.status(statusCodes.BAD_REQUEST).send({
        code: statusCodes.errorCodes.USER_DOES_NOT_EXIST,
        msg: statusMessages.errorMessages.USER_DOES_NOT_EXIST,
      });
    }
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      code: statusCodes.NO_RECORDS,
      msg: err || err.message || statusMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.userCheckForMS = async (req, res, next) => {
  try {
    let queryObj = UserQueryBuilderService.getByIdQuery(req.params.id);
    let user = await UserService.findOneByQuery(
      queryObj.query,
      queryObj.projection
    );
    if (user) {
      user.password = undefined;
      user.oneTimePassword = undefined;
      return res.status(statusCodes.SUCCESS).send({
        code: statusCodes.successCodes.USER_VERIFIED_SUCCESSFULLY,
        msg: statusMessages.successMessages.USER_VERIFIED_SUCCESSFULLY,
      });
    } else {
      return res.status(statusCodes.BAD_REQUEST).send({
        code: statusCodes.errorCodes.USER_DOES_NOT_EXIST,
        msg: statusMessages.errorMessages.USER_DOES_NOT_EXIST,
      });
    }
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      code: statusCodes.NO_RECORDS,
      msg: err || err.message || statusMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    let queryObj = UserQueryBuilderService.getByIdQuery(req.params.id);
    let user = await UserService.findOneByQuery(
      queryObj.query,
      queryObj.projection
    );
    if (user) {
      if (user.password && (await user.verifyPassword(req.body.oldPassword))) {
        req.body.newPassword = await Util.encryptPassword(req.body.newPassword);
        let data = { password: req.body.newPassword };
        let updatedUser = await UserService.updateOneByQuery(
          queryObj.query,
          data,
          queryObj.projection
        );
        if (updatedUser) {
          MailerService.sendChangePasswordConfirmationMail(updatedUser);
          updatedUser.password = undefined;
          updatedUser.oneTimePassword = undefined;
          res.status(statusCodes.SUCCESS).send({
            code: statusCodes.successCodes.PASSWORD_CHANGED_SUCCESSFULLY,
            msg: statusMessages.successMessages.PASSWORD_CHANGED_SUCCESSFULLY,
            data: updatedUser,
          });
        } else {
          res.status(statusCodes.BAD_REQUEST).send({
            code: statusCodes.errorCodes.PASSWORD_UPDATE_FAILED,
            msg: statusMessages.errorMessages.PASSWORD_UPDATE_FAILED,
          });
        }
      } else {
        return res.status(statusCodes.BAD_REQUEST).send({
          code: statusCodes.errorCodes.INVALID_OLD_PASSWORD,
          msg: statusMessages.errorMessages.INVALID_OLD_PASSWORD,
        });
      }
    } else {
      return res.status(statusCodes.BAD_REQUEST).send({
        code: statusCodes.errorCodes.USER_DOES_NOT_EXIST,
        msg: statusMessages.errorMessages.USER_DOES_NOT_EXIST,
      });
    }
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      code: statusCodes.NO_RECORDS,
      msg: err || err.message || statusMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.changePasswordWithOTP = async (req, res, next) => {
  try {
    let queryObj = UserQueryBuilderService.getByEmailQuery(req.body.email);
    let user = await UserService.findOneByQuery(
      queryObj.query,
      queryObj.projection
    );
    if (user) {
      if (user.oneTimePassword.token === req.body.oneTimePassword) {
        if (moment(user.oneTimePassword.tokenExpiryTime).isAfter(Date.now())) {
          req.body.password = await Util.encryptPassword(req.body.password);
          let data = {
            password: req.body.password,
          };
          let updatedUser = await UserService.updateOneByQuery(
            queryObj.query,
            data,
            queryObj.projection
          );
          if (updatedUser) {
            MailerService.sendChangePasswordConfirmationMail(updatedUser);
            updatedUser.password = undefined;
            updatedUser.oneTimePassword = undefined;
            res.status(statusCodes.SUCCESS).send({
              code: statusCodes.successCodes.PASSWORD_UPDATED_SUCCESSFULLY,
              msg: statusMessages.successMessages.PASSWORD_UPDATED_SUCCESSFULLY,
              data: updatedUser,
            });
          } else {
            res.status(statusCodes.BAD_REQUEST).send({
              code: statusCodes.errorCodes.PASSWORD_UPDATE_FAILED,
              msg: statusMessages.errorMessages.PASSWORD_UPDATE_FAILED,
            });
          }
        } else {
          res.status(statusCodes.BAD_REQUEST).send({
            code: statusCodes.errorCodes.OTP_IS_EXPIRED,
            msg: statusMessages.errorMessages.OTP_IS_EXPIRED,
          });
        }
      } else {
        res.status(statusCodes.BAD_REQUEST).send({
          code: statusCodes.errorCodes.INVALID_OTP,
          msg: statusMessages.errorMessages.INVALID_OTP,
        });
      }
    } else {
      return res.status(statusCodes.BAD_REQUEST).send({
        code: statusCodes.errorCodes.USER_DOES_NOT_EXIST,
        msg: statusMessages.errorMessages.USER_DOES_NOT_EXIST,
      });
    }
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      code: statusCodes.NO_RECORDS,
      msg: err || err.message || statusMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let queryObj = UserQueryBuilderService.getByIdQuery(req.params.id);
    let user = await UserService.findOneByQuery(
      queryObj.query,
      queryObj.projection
    );
    if (user) {
      user.password = undefined;
      user.oneTimePassword = undefined;
      return res.status(statusCodes.SUCCESS).send({
        code: statusCodes.successCodes.USER_FETCHED_SUCCESSFULLY,
        msg: statusMessages.successMessages.USER_FETCHED_SUCCESSFULLY,
        data: user,
      });
    } else {
      return res.status(statusCodes.BAD_REQUEST).send({
        code: statusCodes.errorCodes.USER_DOES_NOT_EXIST,
        msg: statusMessages.errorMessages.USER_DOES_NOT_EXIST,
      });
    }
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      code: statusCodes.NO_RECORDS,
      msg: err || err.message || statusMessages.INTERNAL_SERVER_ERROR,
    });
  }
};
