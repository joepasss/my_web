import { type Request, type Response } from "express";

import { sendResponse } from "@utils";
import { ASSET_SERVER_ADDR, STATIC_PATHS } from "@config";
import type { Photo } from "@types";
import { pool } from "@db";

export const getPhotos = async (_: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM photos ORDER BY created_at DESC",
    );
    const photos: Photo[] = result.rows.map((photo: any) => ({
      ...photo,
      url: `${ASSET_SERVER_ADDR}${STATIC_PATHS.PHOTOS}/${photo.filename}`,
    }));

    sendResponse<Photo[]>(res, 200, "success", photos);
  } catch (err) {
    sendResponse(res, 500, "cannot get DB", null);
  }
};

export const getPhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM photos WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return sendResponse(res, 404, `cannot find photo ${id}`, null);
    }

    const photo: Photo = {
      ...result.rows[0],
      url: `${ASSET_SERVER_ADDR}${STATIC_PATHS.PHOTOS}/${result.rows[0].filename}`,
    };

    sendResponse(res, 200, "success", photo);
  } catch (err) {
    sendResponse(res, 500, "SERVER ERROR, cannot get photo", null);
  }
};
