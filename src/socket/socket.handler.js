import registerConnectionEvent from "./events/connection.event.js";
import registerMessageEvents from "./events/message.event.js";
import registerRoomEvents from "./events/room.event.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import logger from "../utils/winstonLogger.js";
import User from "../models/user.model.js";
import Room from "../models/room.model.js";

const setupSocket = (io) => {
    io.use(authMiddleware);

    io.on('connection', async (socket) => {
        logger.info(`User connected, ${socket.user.userId}`);
        const userId = socket.user.userId;
        // const user = await User.findById(userId);
        // if(!user){
        //     socket.emit('error', {
        //         message: 'Invalid token'
        //     });
        //     return;
        // }
        // user.isOnline = true;
        // await user.save();
        await User.findByIdAndUpdate(userId, {isOnline: true});

        const rooms = await Room.find({members: userId});
        rooms.forEach(room => {
            io.to(room._id.toString()).emit('user-online', {
                userId,
                roomId: room._id
            })
        })

        registerConnectionEvent(io, socket);
        registerRoomEvents(io, socket);
        registerMessageEvents(io, socket);
    });
};

export {setupSocket};