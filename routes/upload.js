const express = require('express');
const router = express.Router();

const multer = require('multer');
const { storage, fileFilter } = require('../config/multer');
const upload = multer({ storage: storage, fileFilter: fileFilter });

const uploadController = require('../controllers/upload');
const validations = require('../validations/upload');
const authenticate = require('../middlewares/authenticate');

router.post(
    '/',
    authenticate,
    upload.single('document'),
    validations.checkFileUpload,
    uploadController.postUploadFile
);

router.get(
    '/:id',
    authenticate,
    validations.checkGetData,
    validations.handleValidation,
    uploadController.getUploadedData
);

router.post(
    '/commit',
    authenticate,
    validations.checkCommitData,
    validations.handleValidation,
    uploadController.postCommitData
);

module.exports = router;
