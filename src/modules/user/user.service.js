const fileUploadSvc = require("../../services/fileupload.service");
const bcrypt = require("bcryptjs");
const {randomStringGenerator} = require("../../utilities/helper");
const { Status } = require("../../config/constant");
const UserModel = require("./user.model");

class UserService {
    async transformUserRegister(req){
        try{
            const data =req.body
            if (req.file) {
             data.profilePicture = await fileUploadSvc.uploadFile(req.file.path, '/users');
            }
            data.password = bcrypt.hashSync(data.password, 12);
            data.activationToken = randomStringGenerator(150);
            data.expiryTime = new Date(Date.now() + 3600000);
            data.status = Status.ACTIVE ;
            return data;
        }catch(exception){
            throw exception;
        }
    }
    async transformUserUpdate(req, user){
        try{
            const data =req.body
            if (req.file) {
             data.profilePicture = await fileUploadSvc.uploadFile(req.file.path, '/users');
            }else {
                data.profilePicture = user.profilePicture;
            }
            return data;
        }catch(exception){
            throw exception;
        }
    }
    async userRegister (data) {
        try {
            const user = new UserModel(data);
            return await user.save();
        }catch(exception){
            console.log("Error in user registration", exception);
            throw exception
        }
    }
    async getSingleRowByFilter(filter) {
            try {
                const userDetail= await UserModel.findOne(filter)
                return userDetail;
            } catch (exception) {
                throw exception;
            }
        }
        async getAllRowsByFilter(filter, {page = 1, limit = 15}) {
            try{
                let skip = (page - 1) * limit;
                const data = await UserModel.find(filter)
                .sort({name: "asc"})
                .skip(skip)
                .limit(limit)
                const count = await UserModel.countDocuments(filter);
                return {
                    rows: data.map(this.getUserPublicProfile),
                    pagination: {
                        page: page,
                        limit: limit,
                        total: count,
                    }
                }
    
            }catch(exception){
                throw exception;
            }
        }
    async updateUserById(filter,data){
            try{
                const update= await UserModel.findOneAndUpdate(filter, {$set: data}, {new: true})
                return update;
            }
            catch(exception){
                throw exception;
            }
        }
    async deleteUserById(filter){
            try{
                const deleted = await UserModel.findOneAndDelete(filter);
                return deleted;
            }
            catch(exception){
                throw exception;
            }
        }
    
        getUserPublicProfile(user) {
        return {
                    name:user.name,
                    email: user.email,
                    gender: user.gender,
                    address: user.address,
                    dob: user.dob,
                    status: user.status,
                    _id: user._id,
                    profilePicture:user?.profilePicture?.thumbUrl,
        }
    }
}

const userSvc = new UserService();
module.exports = userSvc
    
