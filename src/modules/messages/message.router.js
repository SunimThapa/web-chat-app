const messageRouter = require("express").Router();
const { SendMessageDTO, SendMessageWithFileDTO, ToggleReactionDTO } = require("./message.validator");
const checkLogin = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const messageCtrl = require('./message.controller');
const uploader = require("../../middlewares/uploader.middleware");



messageRouter.post('/', checkLogin(), bodyValidator(SendMessageDTO), messageCtrl.sendMessage)
messageRouter.post(
  '/upload',
  checkLogin(),
  uploader().single("image"), 
  bodyValidator(SendMessageWithFileDTO),
  messageCtrl.sendMessageWithFile
);
messageRouter.get('/chat/:chatId', checkLogin(), messageCtrl.getMessages);
messageRouter.get('/chat/:chatId/unread-count',checkLogin(), messageCtrl.UnreadCount);
messageRouter.patch('/chat/:chatId/seen', checkLogin(), messageCtrl.markAsSeen);
messageRouter.post(
  '/:messageId/reaction',
  checkLogin(),
  bodyValidator(ToggleReactionDTO),
  messageCtrl.toggleReaction
);
messageRouter.delete('/:messageId', checkLogin(), messageCtrl.deleteMessage);


module.exports = messageRouter;