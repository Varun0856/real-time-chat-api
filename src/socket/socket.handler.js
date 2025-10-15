import registerConnectionEvent from "./events/connection.event.js";
import registerMessageEvents from "./events/message.event.js";
import registerRoomEvents from "./events/room.event.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import logger from "../utils/winstonLogger.js";

const setupSocket = (io) => {
    io.use(authMiddleware);

    io.on('connection', (socket) => {
        logger.info(`User connected, ${socket.user.userId}`);

        registerConnectionEvent(io, socket);
        registerRoomEvents(io, socket);
        registerMessageEvents(io, socket);
    });
};

export {setupSocket};