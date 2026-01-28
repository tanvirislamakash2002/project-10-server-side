import express from "express"
import multer from "multer"
import uploadImageToImgBB from "./image.controller.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(), 
  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 1
  }
});

router.post('/upload-image', upload.single('image'), uploadImageToImgBB
);

export const imageRoutes = router;
