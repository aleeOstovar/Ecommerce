// const createError = require('http-errors');
/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// const globalErrorHandler = require('./controllers/errorController');
const routes = require('./routes/index');

const app = express();

//* set security HTTP headers
app.use(helmet());

//* view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 500,
  window: 60 * 60 * 1000,
  message: 'too many requests from this ip, please try again later',
});
app.use('/', limiter);

//* body parser
app.use(express.json());

//* data sanitization for NoSQL query injection
app.use(mongoSanitize());

//* data sanitization for XSS
app.use(xss());

//prevent http patameter polution
app.use(hpp({ whitelist: ['price'] }));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//*serving statics files
app.use(express.static(path.join(__dirname, 'public')));

const swaggeroptions = {
  swaggerDefinition: {
    openai: '3.0.0',
    info: {
      title: 'Ninazbaby API',
      version: '1.0.0',
      description: 'Ninazbaby API description',
    },
    components: {
      securitySchema: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFromat: 'JWT',
        },
      },
    },
    security: {
      bearerAuth: [],
    },
  },
  apis: [
    path.resolve(__dirname, './routes/*.js'),
    path.resolve(__dirname, './models/*.'),
  ],
};

const specs = swaggerJsdoc(swaggeroptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', routes);
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `can't find ${req.originalUrl} on this server`,
  });
});
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
