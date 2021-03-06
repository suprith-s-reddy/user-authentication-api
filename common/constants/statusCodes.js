module.exports = {
  OK: 1,
  NO_RECORDS: 0,
  SUCCESS: 200,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  PARAMETERS_MISSING: 1012,
  UNAUTHORIZED: 401,

  successCodes: {
    USER_REGISTERED_SUCCESSFULLY: 'auth-01',
    USER_LOGGED_IN_SUCCESSFULLY: 'auth-02',
    PASSWORD_CHANGED_SUCCESSFULLY: 'auth-03',
    PASSWORD_UPDATED_SUCCESSFULLY: 'auth-04',
    USER_INFO_UPDATED_SUCCESSFULLY: 'auth-05',
    OTP_SENT_SUCCESSFULLY: 'auth-06',
    USER_VERIFIED_SUCCESSFULLY: 'auth-07',
    USER_FETCHED_SUCCESSFULLY: 'auth-08',
    OTP_RESENT_SUCCESSFULLY: 'auth-09',
    USERNAME_AVAILABLE: 'auth-10',
  },
  errorCodes: {
    USER_ALREADY_EXISTS: 'auth-101',
    USER_LOGIN_FAILED: 'auth-102',
    USER_DOES_NOT_EXIST: 'auth-103',
    INVALID_CREDENTIALS: 'auth-104',
    PASSWORD_CHANGE_FAILED: 'auth-105',
    PASSWORD_UPDATE_FAILED: 'auth-106',
    INVALID_OTP: 'auth-107',
    USER_INFO_UPDATE_FAILED: 'auth-108',
    AUTH_TOKEN_MISSING: 'auth-109',
    AUTH_FAILED: 'auth-110',
    INVALID_OLD_PASSWORD: 'auth-111',
    OTP_IS_EXPIRED: 'auth-112',
    USER_ACCOUNT_VERIFICATION_FAILED: 'auth-113',
    USERNAME_NOT_AVAILABLE: 'auth-114',
  },
};
