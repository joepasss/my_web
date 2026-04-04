import { Router } from "express";
import multer from "multer";
import { deletePhoto, updatePhoto, uploadPhoto, login } from "@controllers";
import { authenticateToken, loginLimiter } from "@middleware";

export const adminRouter = Router();
const upload = multer({ dest: "files/photos" });

adminRouter.post("/login", loginLimiter, login);

adminRouter.use(authenticateToken);

adminRouter.post("/upload", upload.single("photo"), uploadPhoto);
adminRouter.patch("/photos/:id", updatePhoto);
adminRouter.delete("/photos/:id", deletePhoto);
