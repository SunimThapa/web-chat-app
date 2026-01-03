const messageSvc = require("./message.service")
const CloudinaryService = require('../../services/cloudinary.service');
const chatSvc = require("../chat/chat.service");
const cloudinaryService = new CloudinaryService();

class MessageController{
async sendMessage(req, res, next) {
    
    try {
      const { chatId, content, messageType, replyTo } = req.body;
      const sender = req.loggedInUser._id;


      const messageData = {
        chatId,
        sender,
        content,
        messageType,
        replyTo
      };

      const message = await messageSvc.createMessage(messageData);

      res.json({
        success: true,
        message: 'Message sent successfully',
        data: message
      });
    } catch (error) {
      next(error); 
    }
  }
  async sendMessageWithFile(req, res, next){
    try{
      const { chatId, content, messageType, replyTo } = req.body;

      if (!chatId) {
      throw { status: 400, message: "chatId is required" };
    }

    if (!req.file) {
      throw { status: 400, message: "Image file is required" };
    }
      const sender = req.loggedInUser._id;
      const uploadedImage = await cloudinaryService.fileUpload(req.file.path, '/messages');
      const image = {
      publicId: uploadedImage.publicId,
      url: uploadedImage.url,
      thumbUrl: uploadedImage.thumbUrl
    };
      const imageData = {
        chatId,
        sender,
        content,
        messageType,
        replyTo,
        image
      }
      const imageMessage = await messageSvc.createImageMessage(imageData);
      res.json({
        success: true,
        data: imageMessage,
        message: 'Image sent successfully',
        option: null
      })
    }catch(exception){
      next(exception)
    }
  }
  async getMessages(req, res, next){
    try{
      const chatId = req.params.chatId; 
      const chatDetails = await chatSvc.findPrivateChat(chatId)
      const messagesDetail = await messageSvc.getAllRowsBYFilter(chatId);
      if(!messagesDetail){
        throw{
          status: 404,
          message: "Message not found"
        }
      }

      res.json({
        data: messagesDetail,
        message: "Chat Messages Fetched",
        status: "CHAT_MESSAGES_FETCHED_SUCCESSFULLY",
        option: null
      })

    }catch(exception){
      next(exception);
    }
  }
  async UnreadCount(req, res, next){
    try{
      const chatId = req.params.chatId;
    const loggedInUser = req.loggedInUser._id;
    const unreadMessageCount = await messageSvc.getUnreadMessageCount(chatId, loggedInUser);
    res.json({
      data: {
        chatId,
        unreadMessageCount
      },
      message: "Unread Message Fetched",
      status:"UNREAD_MESSAGE_FETCHED_SUCCESSFULLY",
      option:null
    })
    }catch(exception){
      next(exception)
    }
  }
  async markAsSeen(req, res, next){
    try{
        const chatId = req.params.chatId;
        const loggedInUserId = req.loggedInUser._id;
        const seenMessage = await messageSvc.getSeenMessageByChatId(chatId, loggedInUserId)
        res.json({
          data: {
                chatId,
                updatedMessages: seenMessage.modifiedCount, 
                user: { _id: loggedInUserId, name: req.loggedInUser.name },
                seenAt: new Date()
              },
          message: "Message Seen",
          status: "MESSAGE_SEEN_SUCCESSFULLY"
        })

    }catch(exception){
      next(exception)
    }
  }
 async toggleReaction(req, res, next) {
  try {
    const messageId = req.params.messageId;
    const loggedInUser = req.loggedInUser._id;
    const emoji = req.body.emoji;

    const reaction = await messageSvc.createMessageReaction(messageId, loggedInUser, emoji);

    res.json({
      data: {
        messageId,
        updatedMessages: reaction.modifiedCount,
        user: { _id: loggedInUser, name: req.loggedInUser.name },
      },
      message: "Reaction updated",
      status: "REACTION_UPDATED_SUCCESSFULLY",
      option: null
    });
  } catch (exception) {
    if (exception.message === "Invalid messageId") {
      return res.status(400).json({ message: exception.message });
    }
    if (exception.message === "Message not found") {
      return res.status(404).json({ message: exception.message });
    }
    next(exception);
  }
}
async deleteMessage(req, res, next){
  try{
    const messageId = req.params.messageId;
    const messageDetials = await messageSvc.getAllRowsBYFilter(messageId);
    if(!messageDetials){
      throw{
        status: 404,
        message: "message not found",
      }
    }
    const del = await messageSvc.deleteMessageById(messageId);
    res.json({
      message: "message deleted",
      status:"MESSAGE_DELETED_SUCCESSFULLY"
    })
  }catch(exception){
    next(exception)
  }
}

}

const messageCtrl = new MessageController();
module.exports = messageCtrl;