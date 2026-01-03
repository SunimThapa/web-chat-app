const chatRouter = require("express").Router();
const Joi = require("joi");
const checkLogin = require("../../middlewares/auth.middleware");
const chatCtrl = require("./chat.contoller");
const bodyValidator = require("../../middlewares/validator.middleware");
const isChatMember = require("../../middlewares/ismembers.middleware")

const createGroupChatDTO= Joi.object({
    name: Joi.string().min(3).required(),
    members: Joi.array().items(Joi.string()).min(2).required(),
})

chatRouter.post('/private/:userId',checkLogin(), chatCtrl.createOrGetPrivateChat);
chatRouter.get('/private/:chatId', checkLogin(), isChatMember, chatCtrl.chatDetails)
chatRouter.post("/group", checkLogin(), bodyValidator(createGroupChatDTO), chatCtrl.createGroupChat);
chatRouter.get('/group/:chatId', checkLogin(), isChatMember, chatCtrl.groupDetails)
chatRouter.delete('/group-leave/:chatId', checkLogin(), isChatMember, chatCtrl.groupLeave)
chatRouter.delete('/chat-delete/:chatId', checkLogin(), isChatMember,chatCtrl.deleteChat),

module.exports = chatRouter;