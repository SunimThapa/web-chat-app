const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    isGroup: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      trim: true
      // used only for group chat
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
      // only for group chat
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);
const ChatModel = mongoose.model("Chat", ChatSchema)
module.exports= ChatModel;
