const express = require('express');

const router = express.Router();

const fileController = require('../controllers/file.controller');

// @method GET
// @route /api/v1/files/
// @desc Get file from cookie(cookie is valid for 24h)

// @method POST
// @route /api/v1/files/
// @desc Upload new word file

// @method DELETE
// @route /api/v1/files/
// @desc Remove the file from the FS and the cookie
router
  .route('/')
  .get(fileController.getFile)
  .post(
    fileController.removeBaseFile,
    fileController.uploadSingleFile,
    fileController.returnRawText,
    fileController.getFile
  )
  .delete(fileController.removeBaseFile, fileController.deleteSuccess);

// @method POST
// @route /api/v1/files/text
// @desc Upload new word file
router.route('/text').post(fileController.replaceText, fileController.getFile);

// @method GET
// @route /api/v1/files/word
// @desc Upload new word file for conversion
router
  .route('/word')
  .get(fileController.convertToWord, fileController.downloadAsWord);

// @method GET
// @route /api/v1/files/pdf
// @desc Upload new PDF file
router
  .route('/pdf')
  .get(fileController.convertToPDF, fileController.downloadAsPDF);

module.exports = router;
