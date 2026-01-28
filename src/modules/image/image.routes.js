import express from "express"
import multer from "multer"
import uploadImageToImgBB from "./image.controller.js";

const router = express.Router();

// const upload = multer(); 

const upload = multer({
  storage: multer.memoryStorage(), // This creates req.file.buffer
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  }
});

router.post('/upload-image', upload.single('image'), uploadImageToImgBB
);

export const imageRoutes = router;
