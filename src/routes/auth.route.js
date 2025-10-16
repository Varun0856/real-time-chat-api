import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const authRouter = Router();

authRouter.post('/register',upload.single('avatar'),registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', verifyJWT, logoutUser);
authRouter.post('/refreshToken', refreshAccessToken);

export default authRouter;
