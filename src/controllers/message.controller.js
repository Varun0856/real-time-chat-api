import Message from "../models/message.model.js";
import Room from "../models/room.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getMessages = asyncHandler(async(req, res) => {
    const { roomId } = req.params;
    const chatRoom = await Room.findById(roomId);
    if(!chatRoom) throw new ApiError(404, "Room not found");

    const userId = req.user?._id;
    const isMember = chatRoom.members.some(
        memberId => memberId.toString() === userId.toString()
    );
    if(!isMember) throw new ApiError(403, "Access Denied");

    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const messages = await Message.find({chatRoom: roomId}).populate('sender', 'username email').sort({createdAt: 1}).limit(limit).skip(skip);

    const totalMessage = await Message.countDocuments({chatRoom: roomId});

    res.status(200).json(
        new ApiResponse(200, {messages, totalMessage}, "Messages fetched successfully")
    );
});



export {getMessages};