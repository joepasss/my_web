import dotenv from "dotenv";
import path from "path";
dotenv.config();

export const DB_CONFIG = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
};

export const UPLOAD_ROOT = process.env.UPLOAD_PATH || "";
export const PORT = process.env.PORT;
export const SERVER_URL = process.env.SERVER_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const STATIC_PATHS = {
  PHOTOS: path.join(UPLOAD_ROOT, "photos"),
  AUDIOS: path.join(UPLOAD_ROOT, "audios"),
  ARTICLES: path.join(UPLOAD_ROOT, "articles"),
};
