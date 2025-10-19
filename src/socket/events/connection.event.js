import Room from "../../models/room.model.js";
import User from "../../models/user.model.js";
import logger from "../../utils/winstonLogger.js"

export default function registerConnectionEvent(io, socket) {
    socket.on('disconnect', async () => {
        const userId = socket.user.userId;
        // const user = await User.findById(userId);
        // if(!user) {
        //     logger.error(`User not found on disconnect: ${userId}`)
        //     return;
        // }
        // user.isOnline = false;
        // await user.save();
        await User.findByIdAndUpdate(userId, {isOnline: false});
        // io.emit('user-disconnected', socket.user.userId);
        const rooms = await Room.find({members: userId});
        
        rooms.forEach(room => {
            io.to(room._id.toString()).emit('user-offline', {
                userId,
                roomId: room._id
            });
        });
        logger.info(`User disconnected: ${socket.user.userId}`);
    });
}