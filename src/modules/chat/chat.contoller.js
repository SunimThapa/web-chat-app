const mongoose = require("mongoose");
const MessageModel = require("../messages/message.model");
const messageSvc = require("../messages/message.service");
const chatSvc = require("./chat.service");
const ChatModel = require("./chat.model");


class ChatController{
 async createOrGetPrivateChat(req, res, next){
    try{
        const user1 = req.loggedInUser._id.toString();
        const user2= req.params.userId;
        console.log('user1:', user1, typeof user1);
console.log('user2:', user2, typeof user2);
        const privatechatDetail= await chatSvc.findPrivateChat(user1, user2)
        if(!privatechatDetail){
            const newPrivateChat = await chatSvc.createPrivateChat(user1, user2)
            res.json({
                data: newPrivateChat,
                message: "one to one chat created",
                stauts: "ONE_TO_ONE_CHAT_CREATED_SUCCESSFULLY",
                options:null
            })
        }else{
            res.json({
                data: privatechatDetail,
                message: "chat fetched",
                status:"CHAT_FETCHED_SUCCESSFULLY",
                options:null
            })
        }

    }catch(exception){
        next(exception);
    }
 }
 async chatDetails(req, res, next){
    try{
        const chatId = req.params.chatId;
        const chatDetails= await chatSvc.getChatDetailsById(chatId);
        res.json({
            data: chatDetails,
            message: "Chat details fetched",
            status: "CHAT_FETCHED_SUCCESSFULLY",
        })
    }catch(exception){
        next(exception)
    }
 }
 async createGroupChat(req, res, next){
    try{
        const adminId = req.loggedInUser._id;
        const { name, members}= req.body;
        if (!name || !Array.isArray(members) || members.length < 2) {
      return res.status(400).json({
        message: "Group must have name and at least 3 members"
      });
    }
    // convert all ids to string
    const memberIds = [...new Set(
      members.map(id => id.toString()).concat(adminId)
    )];

        const groupDetails = await chatSvc.createGroupChat(adminId, name, memberIds);
    res.json({
      data: groupDetails,
      message: "Group chat created",
      status: "GROUP_CREATED"
    });
    }catch(exception){
        next(exception)
    }
 }
 async groupDetails(req, res, next){
    try{
        const chatId= req.params.chatId;
        const result = await chatSvc.getGroupDetailsById(chatId);
        if(!result){
            throw{
                status: 404,
                message: "group not found"
            }
        }
        res.json({
            data:result,
            message:"group data fetched",
            status:"GROUP_DATA_FETCHED_SUCCESSFULLY"
        })

    }catch(exception){
        next(exception)
    }
 }
 async deleteChat(req, res, next) {
  try {
    const chatId = req.params.chatId;

    const chatDetails = await chatSvc.getChatDetailsById(chatId);
    if (!chatDetails) {
      throw {
        status: 404,
        message: "Chat not found",
      };
    }

    
    await MessageModel.deleteMany({ chatId: new mongoose.Types.ObjectId(chatId) });

    await chatSvc.deleteChatById(chatId);

    res.json({
      status: 200,
      message: "Chat and messages deleted successfully",
    });

  } catch (exception) {
    next(exception);
  }
}
async groupLeave(req, res, next) {
  try {
    const loggedInUser = req.loggedInUser._id;
    const chatId = req.params.chatId;

    const groupDetails = await chatSvc.getGroupDetailsById(chatId);
    if (!groupDetails) {
      throw { status: 404, message: "Group not found" };
    }

   
    if (groupDetails.admin.toString() === loggedInUser.toString()) {
    await MessageModel.deleteMany({ chatId: new mongoose.Types.ObjectId(chatId) });
      await chatSvc.deleteChatById(chatId);
      return res.json({ message: "Group deleted" });
    }

   
    if (groupDetails.members.includes(loggedInUser)) {
      await ChatModel.updateOne(
        { _id: chatId },
        { $pull: { members: loggedInUser } }
      );

      return res.json({
        data: { chatId, userId: loggedInUser },
        message: "Group left successfully"
      });
    }

  
    throw {
      status: 403,
      message: "User is not a member of this group"
    };

  } catch (exception) {
    next(exception);
  }
}
async addMembers(req, res, next){
  try{
    const chatId = req.params.chatId;
    const loggedInUserId= req.loggedInUser._id;
    const newMemberId= req.body.id;
    if (!Array.isArray(newMemberId) || !newMemberId.length) {
    throw { status: 400, message: "No members to add" };
}

    const result = await chatSvc.getNewAddedMembersById(chatId, newMemberId);
    res.json({
      data: result,
      message:"Members added",
      status: "MEMBERS_ADDED_SUCCESSFULLY"
    })
  }catch(exception){
    next(exception)
  }
}
async removeMembers(req, res,next){
  try{
    const chatId = req.params.chatId;
    const loggedInUserId = req.loggedInUser._id;
    const delmemberId = req.body.id;
    if (loggedInUserId.toString() === delmemberId) {
  throw {
    status: 400,
    message: "Admin cannot remove itself from the group"
  };
}
    const groupDetails= await chatSvc.getGroupDetailsById(chatId);
    if(groupDetails.admin.toString()===loggedInUserId.toString()){
      const result = await chatSvc.deleteMembersById(chatId, delmemberId)
      res.json({
        data: result,
        message: "Member removed",
        status: "MEMBER_REMOVED_SUCCESSFULY"
      })
    }
    throw{
      status: 403,
      message: "access denied"
    }

  }catch(exception){
    next(exception);
  }
}
}
const chatCtrl = new ChatController();
module.exports = chatCtrl;