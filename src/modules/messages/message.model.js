const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  content: {
    type: String,
    trim: true,
    required: function () {
    return this.messageType === 'text';
  }
  },

  messageType: {
    type: String,
    enum: ['text', 'image'],
    required: true,
    default: 'text'
  },

  image: {
    publicId: String,
    url: String,
    thumbUrl: String
  },

  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },

  seenBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    seenAt: {
      type: Date,
      default: Date.now
    }
  }],

  reactions: [{
    emoji: {
      type: String,
      required: true
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],

  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
});

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;
