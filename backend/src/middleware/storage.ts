import multer from "multer";
import path from "path";

export const photoUploadDir = "files/photos";

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, photoUploadDir);
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const photoUpload = multer({
  storage,
});
