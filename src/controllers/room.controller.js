import { Room } from "../models/room.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const createRoom = asyncHandler(async(req, res) => {
    const { roomName, roomType, description } = req.body;
    if([roomName, roomType].some((fields) => {
        return !fields || fields?.trim() === ""
    })){
        throw new ApiError(400, "The required fields must be filled")
    }
    
    const newRoom = await Room.create({
        roomName,
        roomType,
        description,
        createdBy: req.user._id,
        members: [req.user._id]
    })

    res.status(201).json(
        new ApiResponse(201, newRoom, "Room created successfully")
    );
})

const joinRoom = asyncHandler(async(req, res) => {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
     if(!room){
        throw new ApiError(404, "Room not found")
    }

    if(room.roomType === 'private') throw new ApiError(404, "Cannot join private room");

    const userId = req.user._id;
    const exists = room.members.some(
        memberId => memberId.toString() === userId.toString()
    );

    if(exists){
        throw new ApiError(409, "Already a part of the room");
    }
    room.members.push(userId);
    await room.save();

    res.status(200).json(
        new ApiResponse(201, room.members, "Room joined successfully")
    )
})

const leaveRoom = asyncHandler(async(req, res) => {
    const {roomId} = req.params;
    const userId = req.user._id;
    const room = await Room.findById(roomId);
    if(!room){
        throw new ApiError(404, "Room not found");
    }
    const exists = room.members.some(
        memberId => memberId.toString() === userId.toString()
    );

    if(!exists){
        throw new ApiError(403, "User not part of group");
    }
    if(userId.toString() === room.createdBy.toString()){
        await Room.findByIdAndDelete(roomId);
        return res.status(200).json(
            new ApiResponse(200, {}, "Room deleted successfully")
        );
    } else {
        room.members.pull(userId);
        await room.save();
        return res.status(200).json(
            new ApiResponse(200, room.members, "Left room successfully")
        );
    }
})

const updateRoom = asyncHandler(async (req, res) => {
    const {roomId} = req.params;
    const {roomName, description} = req.body;

    if(!roomName && !description){
        throw new ApiError(400, "Provide at least one field to update")
    }

    const room = await Room.findById(roomId);

    if(!room) throw new ApiError(404, "Room not found");

    if(req.user._id.toString() !== room.createdBy.toString()){
        throw new ApiError(403, "Only room creator can update");
    }

    room.roomName = roomName || room.roomName;
    room.description = description || room.description;

    await room.save();
    res.status(200).json(
        new ApiResponse(200, {
            roomName: room.roomName,
            description: room.description
        }, "Details updated successfully")
    )
})

const getUserRooms = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const room = await Room.find({
        $or: [
            {createdBy: userId},
            {members: userId}
        ]
    }).populate('members', 'username email').populate('createdBy', 'username email');

    res.status(200).json(
        new ApiResponse(200, room, "Fetched user rooms successfully")
    );
})

const getRoomById = asyncHandler(async(req, res) => {
    const {roomId} = req.params;
    const room = await Room.findById(roomId);
    if(!room) throw new ApiError(404, "Room not found");
    if(room.roomType === 'private'){
        const isMember = room.members.some(
            memberID => memberID.toString() === req.user?._id.toString() 
        );
        const isCreator = room.createdBy.toString() === req.user?._id;
        if(!isMember && !isCreator){
            throw new ApiError(403, "Access Denied");
        }
    }

    res.status(200).json(
        new ApiResponse(200, room, "Room fetched successfully")
    );
});

const getPublicRooms = asyncHandler(async(req, res) => {
    const rooms = await Room.find({roomType: 'public'}).populate('createdBy', 'username');

    res.status(200).json(
        new ApiResponse(200, rooms, "Public rooms fetched")
    );
});

export {createRoom, joinRoom, leaveRoom, updateRoom, getUserRooms,getRoomById, getPublicRooms};

