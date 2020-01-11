const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const proxy = require('http-proxy-middleware');
const cors = require('cors');

const globalErrorHandler = require('./controllers/error.controller');

// Routers
const fileHandleRouter = require('./routes/fileHandle.routes');

const app = express();

// Heroku build path setup
app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build', 'index.html'));
});

app.use(proxy(['/api/v1'], { target: 'http://localhost:5000' }]));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
// Initial cors setup, can be changed, but leave it here for now
app.use(
  cors({
    origin: [`${process.env.CORS_ALLOWED_ORIGIN}`, 'http://localhost:3000'],
    credentials: true
  })
);
// prevent CORS problems
app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header(
    'Access-Control-Allow-Origin',
    `${process.env.CORS_ALLOWED_ORIGIN}`
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH ,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
// Cookie middleware
app.use(cookieParser());

// Routes
app.use('/api/v1/files', fileHandleRouter);
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

app.use(globalErrorHandler);

module.exports = app;
