const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const { UserValidator } = require('../validators');
const authCheckMiddleware = require('../common/middlewares/authCheck');
// const multer = require('multer');

router.post(
  '/',
  validator.body(UserValidator.registerUserReqSchema),
  userController.register
);

router.get(
  '/unique/:username',
  validator.params(UserValidator.userNameParamsSchema),
  userController.validateUniqueUserName
);

router.patch(
  '/account-verification/:id',
  validator.params(UserValidator.idParamsSchema),
  validator.body(UserValidator.accountVerificationReqSchema),
  userController.verifyUserAccount
);

router.patch(
  '/resend-otp-for-verification/:id',
  validator.params(UserValidator.idParamsSchema),
  userController.resendOTPforVerification
);

router.post(
  '/login',
  validator.body(UserValidator.loginReqSchema),
  userController.login
);

router.post(
  '/forgot-password',
  validator.body(UserValidator.forgotPasswordReqSchema),
  userController.sendPasswordResetCode
);

router.patch(
  '/change-password-with-otp/',
  validator.body(UserValidator.changePasswordWithOTPSchema),
  userController.changePasswordWithOTP
);

router.patch(
  '/change-password/:id',
  validator.params(UserValidator.idParamsSchema),
  validator.body(UserValidator.changePasswordSchema),
  authCheckMiddleware.isAuthenticated,
  userController.changePassword
);

router.put(
  '/:id',
  validator.params(UserValidator.idParamsSchema),
  validator.body(UserValidator.updateUserReqSchema),
  authCheckMiddleware.isAuthenticated,
  userController.update
);

router.get(
  '/:id',
  validator.params(UserValidator.idParamsSchema),
  authCheckMiddleware.isAuthenticated,
  userController.getUser
);

router.get(
  '/verify/:id',
  validator.params(UserValidator.idParamsSchema),
  userController.userCheckForMS
);

module.exports = router;
