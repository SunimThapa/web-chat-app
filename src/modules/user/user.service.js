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
             data.image = await fileUploadSvc.uploadFile(req.file.path, '/users');
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
        getUserPublicProfile(user) {
        return {
                
                    name:user.name,
                    email: user.email,
                    gender: user.gender,
                    address: user.address,
                    dob: user.dob,
                    status: user.status,
                    _id: user._id,
                    publicProfile:user?.publicProfile?.thumbUrl,
        }
    }
}

const userSvc = new UserService();
module.exports = userSvc
    
