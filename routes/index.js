const express = require('express');
const router = express.Router();
const users = require('./users');

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'User Authentication API',
  });
});

router.use('/users', users);

module.exports = router;
