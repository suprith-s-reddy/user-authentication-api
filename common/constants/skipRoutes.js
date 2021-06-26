module.exports = [
  {
    path: '/users/',
    method: 'POST',
    isAllowedWithToken: false,
  },
  {
    path: '/users/login',
    method: 'POST',
    isAllowedWithToken: false,
  },
  {
    path: '/users/account-verification',
    method: 'POST',
    isAllowedWithToken: false,
  },
  {
    path: '/users/forgot-password',
    method: 'POST',
    isAllowedWithToken: false,
  },
  {
    path: '/users/verify/:id',
    method: 'POST',
    isAllowedWithToken: false,
  },
];
