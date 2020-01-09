const fs = require('fs');

const multer = require('multer');
const mammoth = require('mammoth');
const replace = require('replace-in-file');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Read the file and send plain text as response
const uploadFileAsRawText = (filename, res, next) => {
  // Take the currently uploaded doc
  const filePath = `${process.cwd()}/files/uploadedWord/${filename}`;
  const savePath = `${process.cwd()}/files/uploadedWord/${
    filename.split('.')[0]
  }.html`;

  // Extract raw text from doc using mammoth npm package
  mammoth
    .convertToHtml({ path: filePath })
    .then(result => {
      const text = result.value;

      // Take the text value from word file and save it to the txt file
      fs.writeFile(savePath, text, err => {
        if (err) return next(new AppError('Something went wrong', 400));

        // Delete the uploaded word file
        fs.unlink(filePath, err => {
          if (err) return next(new AppError('Something went wrong', 400));

          return res.status(200).json({
            status: 'success',
            message: 'File loaded succesfully',
            text
          });
        });
      });
    })
    .catch(err =>
      res.status(400).json({
        status: 'fail',
        message: 'Something went wrong'
      })
    );
};

// Multer file upload
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.cwd()}/files/uploadedWord`);
  },
  filename: (req, file, cb) => {
    cb(null, `file-${Date.now()}.${file.originalname.split('.').pop()}`);
  }
});

// ${file.originalname.split('.').pop()}?

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
// End of multer upload

// Get file from cookies
exports.getFile = (req, res, next) => {
  if (!req.cookies.filename)
    return next(new AppError('File not found, please upload a new file', 404));

  const savePath = `${process.cwd()}/files/uploadedWord/${
    req.cookies.filename.split('.')[0]
  }.html`;

  // Read the txt file from the cookies and send it's text value
  fs.readFile(savePath, (err, data) => {
    if (err) return next(new AppError('Something went wrong', 400));

    res.send(data);
  });
};

// After file upload return text to user and set the filename cookie for later usage
exports.returnRawText = (req, res, next) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('filename', req.file.filename, cookieOptions);

  //Use our function to return text from word file
  uploadFileAsRawText(req.file.filename, res, next);
};

// Replace text in the current file
exports.replaceText = catchAsync(async (req, res, next) => {
  // Regex to change all the occurances of the text in the file
  const searchTerm = new RegExp(req.body.forReplace, 'g');

  if (!req.body.forReplace || !req.body.replaceWith)
    return next(
      new AppError(
        'You have to put both search term and text to replace with',
        400
      )
    );

  // Set up replace options
  const replaceOptions = {
    files: `${process.cwd()}/files/uploadedWord/${
      req.cookies.filename.split('.')[0]
    }.html`,
    from: searchTerm,
    to: req.body.replaceWith,
    countMatches: true
  };

  // Replace the text in the file
  const results = await replace(replaceOptions);
  // If there was no change return the error
  if (results[0].hasChanged === false)
    return next(
      new AppError(
        'Could not make changes, are you sure that text you typed is inside the file',
        404
      )
    );

  // If there was a change move to the next middleware(getFile so we get our changed file text)
  next();
});
