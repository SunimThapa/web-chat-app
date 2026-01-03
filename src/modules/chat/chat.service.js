const MessageModel = require("../messages/message.model");
const ChatModel = require("./chat.model")
const mongoose = require("mongoose")
class ChatService{
async findPrivateChat(user1, user2){
    try{
        const chat = await ChatModel.findOne({
    isGroup: false,
    members: { $all: [user1, user2] },
    $expr: { $eq: [{ $size: "$members" }, 2] } 
  }).populate('members', 'name profilePicture');
        return chat;
    }catch(execption){
        throw execption;
    }
}
async createPrivateChat(user1, user2){
    try{
        let newChat= await ChatModel.create({
            isGroup: false,
  members: [user1, user2]
        })
        newChat = await ChatModel.findById(newChat._id)
  .populate('members', 'name profilePicture');
        return newChat;
    }catch(exception){
        throw exception;
    }
}
async getChatDetailsById(chatId){
    try{
        const details = await ChatModel.findOne({_id: chatId, isGroup:false});
        return details;
    }catch(exception){
        throw exception;
   }
}
async createGroupChat(adminId, name, memberIds){
    try{
        let groupChat = await ChatModel.create({
            isGroup: true,
            name: name,
            admin: adminId,
            members: memberIds,
        })
       groupChat = await ChatModel.findById(groupChat._id)
    .populate("members", "name profilePicture")
    .populate("admin", "name profilePicture");
    return groupChat;
    }catch(exception){
        throw exception;
    }
}
async getGroupDetailsById(chatId){
    try{
        const groupDetails= await ChatModel.findOne({_id: chatId, isGroup:true}) 
        return groupDetails;
    }catch(exception){
        throw exception
    }
}
async deleteChatById(chatId){
    try{
        const del = await ChatModel.deleteOne({_id: chatId});
        return del;
    }catch(exception){
        throw exception;
    }
}
}
const chatSvc = new ChatService();
module.exports = chatSvc;