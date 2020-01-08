const express = require('express');

const router = express.Router();

const fileHandleController = require('../controllers/fileHandle.controller');

router
  .route('/')
  .get(fileHandleController.initRes)
  .post(
    fileHandleController.uploadSingleFile,
    fileHandleController.returnRawText
  );

module.exports = router;
