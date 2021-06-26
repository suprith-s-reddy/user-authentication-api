const Promise = require('bluebird');
const config = require('../../config/config');
const fetch = require('node-fetch');
const formData = require('form-data');

exports.sendWelcomeEmailWithOTPVerification = (user, oneTimePassword) => {
  return new Promise((resolve, reject) => {
    let uri = config.mailerService;
    let form = new formData();
    form.append('to', user.email);
    form.append(
      'templateName',
      config.mailTemplates.WELCOME_WITH_OTP_VERIFICATION
    );
    form.append('subject', '');
    form.append('bodyContent[firstName]', user.firstName);
    form.append('bodyContent[lastName]', user.lastName);
    form.append('bodyContent[oneTimePassword]', oneTimePassword);
    form.append('attachment', '');
    let options = {
      method: 'POST',
      headers: {
        'accept-language': user.lang,
      },
      body: form,
    };
    fetch(uri, options)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.sendResendOTPEmail = (user, oneTimePassword) => {
  return new Promise((resolve, reject) => {
    let uri = config.mailerService;
    let form = new formData();
    form.append('to', user.email);
    form.append('templateName', config.mailTemplates.RESEND_OTP);
    form.append('subject', '');
    form.append('bodyContent[firstName]', user.firstName);
    form.append('bodyContent[lastName]', user.lastName);
    form.append('bodyContent[oneTimePassword]', oneTimePassword);
    form.append('attachment', '');
    let options = {
      method: 'POST',
      headers: {
        'accept-language': user.lang,
      },
      body: form,
    };
    fetch(uri, options)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.sendAccountVerificationConfirmationEmail = (user) => {
  return new Promise((resolve, reject) => {
    let uri = config.mailerService;
    let form = new formData();
    form.append('to', user.email);
    form.append(
      'templateName',
      config.mailTemplates.ACCOUNT_VERIFICATION_CONFIRMATION
    );
    form.append('subject', '');
    form.append('bodyContent[firstName]', user.firstName);
    form.append('bodyContent[lastName]', user.lastName);
    form.append('attachment', ''); // if attachment exists just use fs.createFileStream for file
    let options = {
      method: 'POST',
      headers: {
        'accept-language': user.lang, // only add custom headers,
      },
      body: form,
    };
    fetch(uri, options)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.sendForgotPasswordOTPEmail = (user, oneTimePassword) => {
  return new Promise((resolve, reject) => {
    let uri = config.mailerService;
    let form = new formData();
    form.append('to', user.email);
    form.append('templateName', config.mailTemplates.FORGOT_PASSWORD);
    form.append('subject', '');
    form.append('bodyContent[firstName]', user.firstName);
    form.append('bodyContent[lastName]', user.lastName);
    form.append('bodyContent[oneTimePassword]', oneTimePassword);
    form.append('attachment', '');
    let options = {
      method: 'POST',
      headers: {
        'accept-language': user.lang,
      },
      body: form,
    };
    fetch(uri, options)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.sendChangePasswordConfirmationMail = (user) => {
  return new Promise((resolve, reject) => {
    let uri = config.mailerService;
    let form = new formData();
    form.append('to', user.email);
    form.append(
      'templateName',
      config.mailTemplates.CHANGE_PASSWORD_CONFIRMATION
    );
    form.append('subject', '');
    form.append('bodyContent[firstName]', user.firstName);
    form.append('bodyContent[lastName]', user.lastName);
    form.append('attachment', '');
    let options = {
      method: 'POST',
      headers: {
        'accept-language': user.lang,
      },
      body: form,
    };
    fetch(uri, options)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
