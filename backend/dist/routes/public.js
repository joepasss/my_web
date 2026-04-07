import { Router } from 'express';
import { getPhotos, getPhoto } from "../controllers";
export const publicRouter = Router();
publicRouter.get('/photos', getPhotos);
publicRouter.get('/photos/:id', getPhoto);
//# sourceMappingURL=public.js.map