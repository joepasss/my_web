import { type Request, type Response } from "express";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";

import { sendResponse } from "@utils";
import { PORT, SERVER_URL, ADMIN_PASSWORD, JWT_SECRET } from "@config";
import type { Photo } from "@types";
import { pool } from "@db";

export const login = async (req: Request, res: Response) => {
  const { password } = req.body || {};

  if (!password) {
    return sendResponse(res, 400, "Password is required", null);
  }

  if (password !== ADMIN_PASSWORD) {
    return sendResponse(res, 401, "Invalid Password", null);
  }

  if (!JWT_SECRET) {
    return sendResponse(res, 503, "server error, authentication failed", null);
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1d" });

  sendResponse(res, 200, "authentication success", { token });
};

export const updatePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params || {};

    const allowedfields: string[] = [];
    const updateData: Record<string, any> = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedfields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const keys = Object.keys(updateData);

    if (keys.length === 0)
      return sendResponse(res, 400, "no data to update", null);

    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const query = `UPDATE photos SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    const values = [...Object.values(updateData), id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return sendResponse(res, 404, `cannot find photo ${id}`, null);
    }

    const updatedPhoto: Photo = {
      ...result.rows[0],
      url: `${SERVER_URL}:${PORT}/files/photos/${result.rows[0].filename}`,
    };

    sendResponse(res, 200, "update success", updatedPhoto);
  } catch (err) {
    sendResponse(res, 500, "update fail", null);
  }
};

export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, "cannot send file", null);
    }

    const { filename } = req.file;

    const query = "INSERT INTO photos (filename) VALUES ($1) RETURNING *";
    const values = [filename];

    const result = await pool.query(query, values);
    const newPhoto: Photo = {
      ...result.rows[0],
      url: `${SERVER_URL}:${PORT}/files/photos/${result.rows[0].filename}`,
    };

    sendResponse(res, 200, "success", newPhoto);
  } catch (err) {
    sendResponse(res, 500, "server error, cannot upload photo", null);
  }
};

export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params || {};

    const selectQuery = "SELECT filename FROM photos WHERE id = $1";
    const selectResult = await pool.query(selectQuery, [id]);

    if (selectResult.rows.length === 0) {
      return sendResponse(res, 404, "cannot get file", null);
    }

    const { filename } = selectResult.rows[0];
    const filePath = path.join(process.cwd(), "photos", filename);

    await pool.query("DELETE FROM photos WHERE id = $1", [id]);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fileErr) {
      console.error(`file deletion failed for ${filename}:`, fileErr);
    }

    sendResponse(res, 200, "delete", null);
  } catch (err) {
    console.error("DELETE ERROR:", err);
    sendResponse(res, 500, "cannot delete file", null);
  }
};
