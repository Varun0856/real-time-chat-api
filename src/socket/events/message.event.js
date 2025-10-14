import Message from "../../models/message.model.js";

export default function registerMessageEvents(io, socket) {
    socket.on('send-message', async ({roomId, content, messageType}) => {
        if(!content?.trim()) return;

        const message = await Message.create({
            chatRoom: roomId,
            sender: socket.user.userId,
            content,
            messageType
        });

        io.to(roomId).emit('new-message', {
            _id: message._id,
            sender: socket.user.userId,
            content,
            messageType,
            createdAt: message.createdAt,
        });
    });
}