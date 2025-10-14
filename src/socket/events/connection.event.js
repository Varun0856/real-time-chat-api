import logger from "../../utils/winstonLogger.js"

export default function registerConnectionEvent(io, socket) {
    socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.user.userId}`);
        io.emit('user-disconnected', socket.user.userId);
    });
}