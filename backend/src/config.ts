import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const ENV_VARS = [
  "DB_USER",
  "DB_HOST",
  "DB_NAME",
  "DB_PASSWORD",
  "DB_PORT",
  "PORT",
  "SERVER_URL",
  "JWT_SECRET",
  "ADMIN_PASSWORD",
  "UPLOAD_PATH",
  "ASSET_SERVER_ADDR",
];

const missingVars = ENV_VARS.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error("missing env variables:");
  missingVars.forEach((varName) => console.error(`  - ${varName}`));
  process.exit(1);
}

export const DB_CONFIG = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
};

export const UPLOAD_ROOT = process.env.UPLOAD_PATH!;
export const PORT = process.env.PORT;
export const SERVER_URL = process.env.SERVER_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const ASSET_SERVER_ADDR = process.env.ASSET_SERVER_ADDR;

if (!fs.existsSync(UPLOAD_ROOT)) {
  console.error("${UPLOAD_ROOT} not found");
  process.exit(1);
}

export const STATIC_PATHS = {
  PHOTOS: path.join(UPLOAD_ROOT, "photos"),
  AUDIOS: path.join(UPLOAD_ROOT, "audios"),
  ARTICLES: path.join(UPLOAD_ROOT, "articles"),
};

Object.values(STATIC_PATHS).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir);
    } catch (err) {
      console.error(`Failed to create directory ${dir}:`, err);
      process.exit(1);
    }
  }
});
