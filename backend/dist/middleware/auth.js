import {} from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { sendResponse } from "../utils";
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return sendResponse(res, 401, "Access Denied: No Token Provided", null);
    }
    if (!JWT_SECRET) {
        return sendResponse(res, 503, "server error, authentication failed", null);
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return sendResponse(res, 403, "Invalid or Expired Token", null);
        }
        req.user = user;
        next();
    });
};
//# sourceMappingURL=auth.js.map