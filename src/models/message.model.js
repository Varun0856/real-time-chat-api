import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  messageType: {
    type: String,
    enum: ['text', 'audio', 'video'],
    default: 'text',
  },
  deliveredAt: {
    type: Date,
    default: Date.now
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
