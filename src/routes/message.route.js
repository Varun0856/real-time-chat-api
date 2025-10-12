import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages } from "../controllers/message.controller.js";
const messageRouter = Router({mergeParams: true});

messageRouter.get('/', verifyJWT, getMessages);

export default messageRouter;