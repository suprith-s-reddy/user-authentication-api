const Joi = require('joi');

exports.registerUserReqSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
  firstName: Joi.string(),
  lastName: Joi.string(),
  userName: Joi.string().required(),
  phoneNumber: Joi.string().max(20),
  gender: Joi.string().lowercase(),
  areTermsAgreed: Joi.boolean(),
  profilePicUrl: Joi.string(),
  profilePicThumbUrl: Joi.string(),
  termsAndConditionsUrl: Joi.string(),
  lang: Joi.string(),
});

exports.userNameParamsSchema = Joi.object({
  userName: Joi.string().required(),
});

exports.loginReqSchema = Joi.object({
  username: Joi.string().required().email(),
  password: Joi.string().required().min(6),
});

exports.facebookAuthSchema = Joi.object({
  token: Joi.string,
});

exports.updateUserReqSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  phoneNumber: Joi.string().max(20),
  gender: Joi.string().lowercase(),
  profilePicUrl: Joi.string(),
  profilePicThumbUrl: Joi.string(),
  termsAndConditionsUrl: Joi.string(),
  lang: Joi.string(),
});

exports.idParamsSchema = Joi.object({
  id: Joi.string(),
});

exports.forgotPasswordReqSchema = Joi.object({
  email: Joi.string().required().email(),
});

exports.changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().min(6),
  newPassword: Joi.string().required().min(6),
});

exports.changePasswordWithOTPSchema = Joi.object({
  email: Joi.string().required().email(),
  oneTimePassword: Joi.string().required().min(5).max(8),
  password: Joi.string().required().min(6),
});

exports.accountVerificationReqSchema = Joi.object({
  oneTimePassword: Joi.string().required(),
  isAccountVerified: Joi.boolean().required().invalid(false),
});
