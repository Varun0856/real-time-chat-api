import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        trim: true,
        required: [true, "Room name is required"],
        minlength: 2,
        maxlength: 25
    },
    roomType: {
        type: String,
        trim: true,
        required: [true, "Room type is required"],
        enum: ["private", "public"],
        default: "public"
    },
    description: {
        type: String,
        trim: true,
        maxlength: 350
    },
    //roomAvatarUrl: {
      //  type: String,
    //},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true
})

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;