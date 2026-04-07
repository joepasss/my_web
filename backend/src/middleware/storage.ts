import { STATIC_PATHS } from "@config";
import multer from "multer";
import path from "path";

const photoStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, STATIC_PATHS.PHOTOS);
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const photoUpload = multer({
  storage: photoStorage,
});
