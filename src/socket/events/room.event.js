export default function registerRoomEvents(io, socket) {
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        logger.info(`User ${socket.user.userId} joined room ${roomId}`);
        socket.to(roomId).emit('user-joined', {
            userId: socket.user.userId,
            roomId,
        });
    });

    socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        logger.info(`User ${socket.user.userId} left room ${roomId}`);
        socket.to(roomId).emit('user-left', {
            userId: socket.user.userId,
            roomId,
        });
    });
}