const fs = require('fs');

const multer = require('multer');
const mammoth = require('mammoth');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.initRes = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Route connection succesful'
  });
};

// Multer file upload stuff
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.cwd()}/files/uploadedWord`);
  },
  filename: (req, file, cb) => {
    cb(null, `file-${Date.now()}.${file.originalname.split('.')[1]}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split('.').includes('wordprocessingml')) {
    cb(null, true);
  } else cb(new AppError('You can only upload word documents', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadSingleFile = upload.single('wordfile');

exports.returnRawText = (req, res, next) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('filename', req.file.filename, cookieOptions);

  // Take the currently uploaded doc
  const filePath = `${process.cwd()}/files/uploadedWord/${req.file.filename}`;

  // Extract raw text from doc using mammoth npm package
  mammoth
    .extractRawText({ path: filePath })
    .then(result => {
      const text = result.value;

      return res.status(200).json({
        status: 'success',
        text
      });
    })
    .catch(err =>
      res.status(400).json({
        status: 'fail',
        message: 'Something went wrong'
      })
    );
};
