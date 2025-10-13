import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createRoom, getPublicRooms, getRoomById, getUserRooms, joinRoom, leaveRoom, updateRoom } from "../controllers/room.controller.js";
import messageRouter from "./message.route.js";
const roomRouter = Router();

roomRouter.post('/', verifyJWT, createRoom);
roomRouter.get('/public', getPublicRooms)
roomRouter.get('/', verifyJWT, getUserRooms);
roomRouter.post('/:roomId/join', verifyJWT, joinRoom);
roomRouter.delete('/:roomId/members', verifyJWT, leaveRoom);
roomRouter.patch('/:roomId', verifyJWT, updateRoom);
roomRouter.get('/:roomId', verifyJWT, getRoomById);

roomRouter.use('/:roomId/messages', verifyJWT, messageRouter);

export default roomRouter;