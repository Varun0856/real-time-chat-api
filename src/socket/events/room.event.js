import Message from "../../models/message.model.js";
import Room from "../../models/room.model.js";
import logger from "../../utils/winstonLogger.js";
export default function registerRoomEvents(io, socket) {
    socket.on('join-room', async(roomId) => {
        try {
            if(!roomId){
                socket.emit('error', {
                    message: 'Missing roomId'
                });
                return;
            }
            const room = await Room.findById(roomId);
            if(!room){
                socket.emit('error', {
                    message: 'Room not found'
                });
                return;
            }
            const userId = socket.user.userId;
            const isMember = room.members.some(
                memberId => memberId.toString() === userId.toString()
            );
            if(!isMember){
                socket.emit('error', {message: 'Not a member of this room'})
                return;
            }
            socket.join(roomId);
            logger.info(`User ${socket.user.userId} joined room ${roomId}`);
            socket.to(roomId).emit('user-joined', {
                userId: socket.user.userId,
                roomId,
            });
            const recentMessages = await Message.find({chatRoom: roomId}).sort({createdAt: -1}).limit(50).populate('sender', 'username');
            socket.emit('message-history', recentMessages);
        } catch (error) {
            logger.error(`Failed to fetch message: ${error.message}`);
            socket.emit('error', {
                message: 'Failed to load messages'
            });
        }
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