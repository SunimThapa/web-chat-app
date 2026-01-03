 const mongoose = require("mongoose");
const MessageModel= require("./message.model");
const ChatModel = require("../chat/chat.model");
 class MessageService{
    async createMessage(data){
        try{
            const message = await MessageModel.create(data);
      const populatedMessage = await MessageModel.findById(message._id)
        .populate('sender', 'name email profilePicture')
        .populate('replyTo', 'content sender messageType imageUrl')
        .populate({
          path: 'replyTo',
          populate: {
            path: 'sender',
            select: 'name profilePicture'
          }
        });
        await ChatModel.findByIdAndUpdate(data.chatId, {
        lastMessage: message._id,
        updatedAt: Date.now()
      });

      return populatedMessage;

        }catch(exception){
            throw exception;
        }
    }
    async createImageMessage(imgData){
      try{
        const message = await MessageModel.create(imgData);
      const populatedMessage = await MessageModel.findById(message._id)
        .populate('sender', 'name email profilePicture')
        .populate('replyTo', 'content sender messageType imageUrl')
        .populate({
          path: 'replyTo',
          populate: {
            path: 'sender',
            select: 'name profilePicture'
          }
        });
        await ChatModel.findByIdAndUpdate(imgData.chatId, {
        lastMessage: message._id,
        updatedAt: Date.now()
      });

      return populatedMessage;
      }catch(exception){
        throw exception;
      }
    }
    async getAllRowsBYFilter(chatId){
      try{
        const messagesDetail = await MessageModel.find({chatId})
        .populate('sender', 'name email profilePicture')
        .populate('replyTo', 'content sender messageType image')
        .populate({
        path: 'replyTo',
        populate: { path: 'sender', select: 'name profilePicture' }
    })
        .sort({ createdAt: 1 });
        return messagesDetail;

      }catch(exception){
        throw exception;
      }
    }
    async getUnreadMessageCount(chatId, loggedInUser){
      try{
        const result = await MessageModel.aggregate([
          {
          $match:{
            chatId: new mongoose.Types.ObjectId(chatId),
            sender: {$ne: new mongoose.Types.ObjectId(loggedInUser)},
            "seenBy.user": {$ne: new mongoose.Types.ObjectId(loggedInUser)}
          }
        },
        {
          $count: "unreadMessageCount"
        }
      ])
      return result[0]?.unreadMessageCount || 0;
      }catch(exception){
        throw exception;
      }
    }
    async getSeenMessageByChatId(chatId, loggedInUserId){
      try{
        const result = await MessageModel.updateMany(
  {
    chatId: chatId,
    sender: { $ne: loggedInUserId },
    "seenBy.user": { $ne: loggedInUserId } 
  },
  {
    $push: {
      seenBy: {
        user: loggedInUserId,
        seenAt: new Date()
      }
    }
  }
);
      return result;
      }catch(exception){
        throw exception;
      }
    }
    async createMessageReaction(messageId, loggedInUser, emoji) {
  // 1️⃣ Validate messageId
  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    throw new Error("Invalid messageId");
  }

  // 2️⃣ Try updating reactions
  const reactionMessage = await MessageModel.updateOne(
    { _id: messageId },
    [
      {
        $set: {
          reactions: {
            $let: {
              vars: {
                // Find reaction object(s) containing this user
                existingReaction: {
                  $filter: {
                    input: "$reactions",
                    as: "r",
                    cond: { $in: [loggedInUser, "$$r.users"] }
                  }
                }
              },
              in: {
                $cond: [
                  { $gt: [{ $size: "$$existingReaction" }, 0] }, // user already reacted
                  {
                    $cond: [
                      { $eq: [{ $arrayElemAt: ["$$existingReaction.emoji", 0] }, emoji] },
                      // REMOVE user from users array
                      {
                        $filter: {
                          input: {
                            $map: {
                              input: "$reactions",
                              as: "r",
                              in: {
                                emoji: "$$r.emoji",
                                users: {
                                  $filter: {
                                    input: "$$r.users",
                                    as: "u",
                                    cond: { $ne: ["$$u", loggedInUser] }
                                  }
                                }
                              }
                            }
                          },
                          as: "r",
                          cond: { $gt: [{ $size: "$$r.users" }, 0] } // remove empty reactions
                        }
                      },
                      // CHANGE emoji → remove from old, add to new
                      {
                        $let: {
                          vars: {
                            removedUser: {
                              $map: {
                                input: "$reactions",
                                as: "r",
                                in: {
                                  emoji: "$$r.emoji",
                                  users: {
                                    $filter: {
                                      input: "$$r.users",
                                      as: "u",
                                      cond: { $ne: ["$$u", loggedInUser] }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          in: {
                            $concatArrays: [
                              {
                                $filter: {
                                  input: "$$removedUser",
                                  as: "r",
                                  cond: { $gt: [{ $size: "$$r.users" }, 0] }
                                }
                              },
                              [{ emoji, users: [loggedInUser] }]
                            ]
                          }
                        }
                      }
                    ]
                  },
                  // User never reacted → add new reaction or push user to existing
                  {
                    $let: {
                      vars: {
                        targetReaction: {
                          $filter: {
                            input: "$reactions",
                            as: "r",
                            cond: { $eq: ["$$r.emoji", emoji] }
                          }
                        }
                      },
                      in: {
                        $cond: [
                          { $gt: [{ $size: "$$targetReaction" }, 0] },
                          // Emoji exists → push user
                          {
                            $map: {
                              input: "$reactions",
                              as: "r",
                              in: {
                                emoji: "$$r.emoji",
                                users: {
                                  $cond: [
                                    { $eq: ["$$r.emoji", emoji] },
                                    { $concatArrays: ["$$r.users", [loggedInUser]] },
                                    "$$r.users"
                                  ]
                                }
                              }
                            }
                          },
                          // Emoji doesn't exist → add new reaction
                          { $concatArrays: ["$reactions", [{ emoji, users: [loggedInUser] }]] }
                        ]
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    ]
  );

  // 3️⃣ Check if message exists
  if (reactionMessage.matchedCount === 0) {
    throw new Error("Message not found");
  }

  return reactionMessage;
}
    async deleteMessageById(filter){
      try{
        const result = await MessageModel.deleteOne({_id: filter})
      }catch(exception){
        throw exception;
      }
    }

 }

 const messageSvc = new MessageService();
 module.exports = messageSvc;