import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";
const uploadRouter = Router();
uploadRouter.post('/image', verifyJWT, upload.single('image'), uploadImage);

export default uploadRouter;