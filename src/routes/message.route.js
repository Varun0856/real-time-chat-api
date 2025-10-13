import { Router } from "express";
import { getMessages } from "../controllers/message.controller.js";
const messageRouter = Router({mergeParams: true});

messageRouter.get('/', getMessages);

export default messageRouter;