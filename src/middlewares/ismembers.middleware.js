const Chat = require("../modules/chat/chat.model");

const isChatMember = async (req, res, next) => {
  try {
    const chatExists = await Chat.exists({
      _id: req.params.chatId,
      members: req.loggedInUser._id
    });

    if (!chatExists) {
      return res.status(403).json({
        message: "You are not a member of this group"
      });
    }
    next();
  } catch (exception) {
    next(exception);  
  }
};

module.exports = isChatMember;