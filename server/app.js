const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./controllers/error.controller');

// Routers
const fileHandleRouter = require('./routes/fileHandle.routes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
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
