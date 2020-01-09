const express = require('express');

const router = express.Router();

const fileHandleController = require('../controllers/fileHandle.controller');

// @method GET
// @route /api/v1/files/
// @desc Get file from cookie(cookie is valid for 24h)

// @method POST
// @route /api/v1/files/
// @desc Upload new word file
router
  .route('/')
  .get(fileHandleController.getFile)
  .post(
    fileHandleController.uploadSingleFile,
    fileHandleController.returnRawText,
    fileHandleController.getFile
  );

// @method POST
// @route /api/v1/files/text
// @desc Upload new word file
router
  .route('/text')
  .post(fileHandleController.replaceText, fileHandleController.getFile);

module.exports = router;
