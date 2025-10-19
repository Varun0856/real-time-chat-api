import Message from "../../models/message.model.js";
import Room from "../../models/room.model.js";
import isValidCloudinaryUrl from "../../utils/verifyImageUrl.js";
import logger from "../../utils/winstonLogger.js";

export default function registerMessageEvents(io, socket) {
    socket.on('send-message', async ({roomId, content, messageType, imageUrl}) => {

        if(!['text', 'image'].includes(messageType)){
            socket.emit('error', {
                message: 'Invalid message type'
            });
            return;
        }

        if(!content?.trim() && messageType == 'text') {
            socket.emit('error', {
                message: 'Text content required'
            });
            return;
        }
        if(messageType == 'image' && !imageUrl?.trim()){
            socket.emit('error', {
                message: 'Image URL required'
            });
            return;
        }
        if(!isValidCloudinaryUrl(imageUrl)){
            socket.emit('error', {
                message: 'Invalid image Url'
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
                messageType,
                imageUrl,
            });
    
            socket.to(roomId).emit('new-message', {
                _id: message._id,
                sender: socket.user.userId,
                content,
                messageType,
                imageUrl,
                createdAt: message.createdAt,
            });
            socket.emit('new-message', {
                _id: message._id,
                sender: socket.user.userId,
                content: message.content,
                messageType: message.messageType,
                imageUrl: message.imageUrl,
                createdAt: message.createdAt
            })
        } catch (error) {
            logger.error(`Message save failed: ${error.message}`);
            socket.emit('error', {message: 'Failed to send message'});
        }
    });
}