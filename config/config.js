module.exports = {
  apiSecret: process.env.API_SECRET,
  db: {
    master: process.env.AUTH_DB_URL,
    options: {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      auto_reconnect: true,
    },
  },
  clientUrl: 'http://localhost:8080/',
  mailerService: process.env.MAILER_SVC,
  tokenValidity: {
    api: 1209600,
  },
  OTPValidity: {
    api: 300,
  },
  blockHttp: false,
  defaultLanguage: 'en-GB',
  fallBackLanguage: 'en-GB',
  allowedLanguages: ['en-GB', 'de-DE'],
  allowedAccountTypes: ['individual', 'brand'],
  defaultAccountType: 'individual',
  defaultQueryOptions: {
    limit: 10,
    page: 1,
  },
  // storage: {
  //   projectId: process.env.PROJECT_ID,
  //   bucketName: process.env.STORAGE_BUCKET_NAME,
  //   keyFileName: process.env.CLOUD_STORAGE_KEY_NAME,
  // },
  facebookAuth: {
    userDetailsUrl:
      'https://graph.facebook.com/me?fields=email,name,birthday,gender,location,first_name,last_name,link,picture.height(800).width(800)&access_token=',
  },
  mailTemplates: {
    WELCOME_WITH_OTP_VERIFICATION: 'welcome-with-otp-verification',
    RESEND_OTP: 'resend-otp',
    ACCOUNT_VERIFICATION: 'account-verification',
    ACCOUNT_VERIFICATION_CONFIRMATION: 'account-verification-confirmation',
    FORGOT_PASSWORD: 'forgot-password',
    CHANGE_PASSWORD_CONFIRMATION: 'change-password-confirmation',
  },
};
