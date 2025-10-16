import Message from "../../models/message.model.js";
import Room from "../../models/room.model.js";
import logger from "../../utils/winstonLogger.js";

export default function registerMessageEvents(io, socket) {
    socket.on('send-message', async ({roomId, content, messageType}) => {
        if(!content?.trim()) {
            socket.emit('error', {
                message: 'Message content required'
            });
            return;
        }
        const room = await Room.findById(roomId);
        if(!room){
            socket.emit('error', {message: 'Room not found'});
            return;
        }

        const isMember = room.members.some(
            m => m.toString() === socket.user.userId.toString()
        );

        if(!isMember){
            socket.emit('error', {message: 'Not a member of this room'});
            return;
        }

        try {
            const message = await Message.create({
                chatRoom: roomId,
                sender: socket.user.userId,
                content,
                messageType
            });
    
            socket.to(roomId).emit('new-message', {
                _id: message._id,
                sender: socket.user.userId,
                content,
                messageType,
                createdAt: message.createdAt,
            });
            socket.emit('new-message', {
                _id: message._id,
                sender: socket.user.userId,
                content,
                messageType,
                createdAt: message.createdAt
            })
        } catch (error) {
            logger.error(`Message save failed: ${error.message}`);
            socket.emit('error', {message: 'Failed to send message'});
        }
    });
}