import rateLimit from 'express-rate-limit';
import { sendResponse } from "../utils";
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: (_, res) => {
        sendResponse(res, 429, "Too many login attempts.", null);
    },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimit.js.map