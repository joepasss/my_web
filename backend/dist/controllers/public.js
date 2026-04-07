import {} from "express";
import { sendResponse } from "../utils";
import { PORT, SERVER_URL } from "../config.js";
import { pool } from "../db.js";
export const getPhotos = async (_, res) => {
    try {
        const result = await pool.query("SELECT * FROM photos ORDER BY created_at DESC");
        const photos = result.rows.map((photo) => ({
            ...photo,
            url: `${SERVER_URL}:${PORT}/files/photos/${photo.filename}`,
        }));
        sendResponse(res, 200, "success", photos);
    }
    catch (err) {
        sendResponse(res, 500, "cannot get DB", null);
    }
};
export const getPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM photos WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return sendResponse(res, 404, `cannot find photo ${id}`, null);
        }
        const photo = {
            ...result.rows[0],
            url: `${SERVER_URL}:${PORT}/files/photos/${result.rows[0].filename}`,
        };
        sendResponse(res, 200, "success", photo);
    }
    catch (err) {
        sendResponse(res, 500, "SERVER ERROR, cannot get photo", null);
    }
};
//# sourceMappingURL=public.js.map