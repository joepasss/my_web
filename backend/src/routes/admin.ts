import { Router } from "express";
import { deletePhoto, updatePhoto, uploadPhoto, login } from "@controllers";
import { authenticateToken, loginLimiter, photoUpload } from "@middleware";

export const adminRouter = Router();

adminRouter.post("/login", loginLimiter, login);

adminRouter.use(authenticateToken);

adminRouter.post("/upload", photoUpload.single("photo"), uploadPhoto);
adminRouter.patch("/photos/:id", updatePhoto);
adminRouter.delete("/photos/:id", deletePhoto);
