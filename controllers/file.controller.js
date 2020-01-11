const fs = require('fs');

const multer = require('multer');
const mammoth = require('mammoth');
const replace = require('replace-in-file');
const HtmlDocx = require('html-docx-js');
const pdf = require('html-pdf');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Remove the HTML file that is root of all search and conversion
exports.removeBaseFile = (req, res, next) => {
  if (!req.cookies.filename) return next();

  const file = `${process.cwd()}/files/${
    req.cookies.filename.split('.')[0]
  }.html`;

  fs.unlink(file, err => {
    if (err) return next(new AppError('Something went wrong', 400));

    next();
  });
};

// After succesfull delete sort out the cookies and send the response
exports.deleteSuccess = (req, res, next) => {
  if (!req.cookies.filename)
    return next(new AppError('There is no file to remove', 404));
  signCookie('filename', '', new Date(Date.now() + 1000), res);

  res
    .status(204)
    .json({ status: 'success', message: 'File removed succesfully' });
};

// Multer file upload
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.cwd()}/files`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `file-${Date.now()}-${Math.floor(Math.random() * 100000000) +
        1}.${file.originalname.split('.').pop()}`
    );
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
// End of multer upload

// Get file from cookies
exports.getFile = (req, res, next) => {
  if (!req.cookies.filename)
    return next(new AppError('File not found, please upload a new file', 404));

  const savePath = `${process.cwd()}/files/${
    req.cookies.filename.split('.')[0]
  }.html`;

  // Read the txt file from the cookies and send it's text value
  fs.readFile(savePath, (err, data) => {
    if (err) return next(new AppError('Upload file to continue', 404));

    res.send(data);
  });
};

// Simple function for signing cookies
const signCookie = (cookieName, cookieValue, cookieExpires, res) => {
  const cookieOptions = {
    expires: cookieExpires,
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie(cookieName, cookieValue, cookieOptions);
};

// After file upload return HTML to user and set the filename cookie for later usage
exports.returnRawText = (req, res, next) => {
  signCookie(
    'filename',
    req.file.filename,
    new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    res
  );

  // Take the currently uploaded doc
  const filePath = `${process.cwd()}/files/${req.file.filename}`;
  const savePath = `${process.cwd()}/files/${
    req.file.filename.split('.')[0]
  }.html`;

  // Extract HTML from doc using mammoth npm package
  mammoth
    .convertToHtml({ path: filePath })
    .then(result => {
      const text = result.value;

      // Take the HTML value from word file and save it to the HTML file
      fs.writeFile(savePath, text, err => {
        if (err)
          return next(
            new AppError('Something went wrong saving the file', 400)
          );

        // Delete the uploaded word file
        fs.unlink(filePath, err => {
          if (err) return next(new AppError('Something went wrong Here', 400));

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
    files: `${process.cwd()}/files/${req.cookies.filename.split('.')[0]}.html`,
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

//Convert HTML file to the word document
exports.convertToWord = (req, res, next) => {
  // If there is no cookie, return error
  if (!req.cookies.filename)
    return next(
      new AppError(
        'Please upload the file to download it as word document',
        404
      )
    );
  // Read the html file from the file system
  fs.readFile(
    `${process.cwd()}/files/${req.cookies.filename.split('.')[0]}.html`,
    'utf-8',
    (err, html) => {
      if (err)
        return next(
          new AppError(
            'Something went wrong, reupload the file and try again',
            400
          )
        );

      // Use docx to convert the html to Word document
      var docx = HtmlDocx.asBlob(html);
      // Save file on the file system
      fs.writeFile(
        `${process.cwd()}/files/${req.cookies.filename}`,
        docx,
        err => {
          if (err)
            return next(
              new AppError(
                'Something went wrong, reupload the file and try again',
                400
              )
            );

          next();
        }
      );
    }
  );
};

exports.downloadAsWord = (req, res, next) => {
  // Can put res.download in the if statement and if it is succesfull then we delete the file
  // Use res.download to enable download of the file, then in the frontend in the axios response
  // we use simple way of downloading the file using window.open(apiUrl) and then we download the file we sent
  // using the res.download, and after download, remove all the files that are on fs
  const file = `${process.cwd()}/files/${req.cookies.filename.toString()}`;

  res.download(file, err => {
    if (err) {
      console.log(err);
    } else {
      fs.unlink(file, err => {
        if (err) return next(new AppError('Something went wrong', 400));
      });
    }
  });
};

// Convert file to PDF and save it to the file system
exports.convertToPDF = (req, res, next) => {
  // Read the HTML file
  const html = fs.readFileSync(
    `${process.cwd()}/files/${req.cookies.filename.split('.')[0]}.html`,
    'utf8'
  );

  // Use our html-pdf package to create the PDF file and save it to the FS
  pdf
    .create(html)
    .toFile(
      `${process.cwd()}/files/${req.cookies.filename.split('.')[0]}.pdf`,
      (err, result) => {
        if (err)
          return next(
            new AppError('Something went wrong, please try again', 400)
          );

        next();
      }
    );
};

// Download the word file
exports.downloadAsPDF = async (req, res, next) => {
  const file = `${process.cwd()}/files/${
    req.cookies.filename.split('.')[0]
  }.pdf`;

  res.download(file, err => {
    if (err) {
      console.log(err);
    } else {
      fs.unlink(file, err => {
        if (err) return next(new AppError('Something went wrong', 400));
      });
    }
  });
};
