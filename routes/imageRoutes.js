const express = require('express');
const multer = require('multer');
const { uploadImageToImgBB } = require('../controllers/imageUploadController');
const router = express.Router();

const upload = multer(); 

router.post('/upload-image', upload.single('image'), uploadImageToImgBB
);

module.exports = router;
