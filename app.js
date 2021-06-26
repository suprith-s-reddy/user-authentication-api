const express = require('express');
const helmet = require('helmet');
const path = require('path');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config/config');
const interceptor = require('./common/middlewares/interceptor');
const logger = require('./common/middlewares/logger');
const routes = require('./routes/index');
const app = express();

app.set('trust proxy', true);
app.use(helmet());
app.use(interceptor);

// eslint-disable-next-line no-undef
blockHTTP = (req, res, next) => {
  if (
    req.headers['x-forwarded-proto'] &&
    req.headers['x-forwarded-proto'] === 'http'
  ) {
    return res.status(403).send({
      msg: 'Cannot access via HTTP',
    });
  } else {
    next();
  }
};

if (config.blockHttp === true) {
  // eslint-disable-next-line no-undef
  app.use(blockHTTP);
}

app.options('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type,Authorization, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, PATCH, DELETE, OPTIONS'
  );
  res.status(200).end();
});
app.use(
  require('morgan')('combined', {
    stream: logger.stream,
  })
);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(
  bodyParser.json({
    limit: '10mb',
  })
);
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    res.status(400).json({
      code: 400, // will be "query" here, but could be "headers", "body", or "params"
      msg: err.error.toString(),
    });
  } else {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
    });
  }
});

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
