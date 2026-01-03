const userSvc = require('./user.service');

class UserController{
    async listAllUser(req, res, next) {
        try{
            let filter = {
                _id: {$ne: req.loggedInUser._id }
            }
            if(req.query.search){
                filter = {
                    ... filter,
                    $or: [
                        {name: new RegExp(req.query.search, 'i')},
                        {email: new RegExp(req.query.search, 'i')},
                        {phone: new RegExp(req.query.search, 'i')},
                        {address: new RegExp(req.query.search, 'i')},
                        {dob: new RegExp(req.query.search, 'i')},
                    ]
                }
            }
            const {rows, pagination} = await userSvc.getAllRowsByFilter(filter, req.query)
            res.json({
                data: rows,
                message: 'Users list fetched successfully',
                status: "USERS_LIST_FETCHED",
                option: {
                    pagination
                }
            })
            console.log("User List Filter:", filter);
        }catch(execption){
            next(execption);
        }
    }
    async getDetailById(req, res, next) {

        try{
            const userDetail = await userSvc.getSingleRowByFilter({_id: req.params.userId});
            if (!userDetail){
                throw {
                    status: 422,
                    message: "User not found",
                    status: "USER_DOESNOT_EXIST"
                } 
            }
            res.json({
                data: userSvc.getUserPublicProfile(userDetail),
                message: "User detail",
                status: "USER_DETAIL",
                option: null
            })
        }catch(exception){
            next(exception);
        }
    }
    updateUserById = async (req, res, next)=>{
        try{
            const loggedInUser = req.loggedInUser
            const userDetail = await userSvc.getSingleRowByFilter({_id: req.params.userId});
            if (!userDetail){
                throw {
                    status: 422,
                    message: "User not found",
                    status: "USER_DOESNOT_EXIST"
                } 
            }else{
                if(loggedInUser._id.toString() !== userDetail._id.toString()){
                    throw{
                        status: 401,
                        message: "User unauthorized",
                        status:"USER_UNAUTORIZED"
                    }
                }
            const payload = await userSvc.transformUserUpdate(req, userDetail);
            const update =await userSvc.updateUserById({_id: userDetail._id}, payload);
            res.json({
                data: userSvc.getUserPublicProfile(update),
                message: "Profile updated successfully",
                status: "PROFILE_UPDATED",
                option: null
            })
        }
            
        }catch (exception){
            next(exception)
        }
 };
 async deleteUserById(req, res, next){
    try{
        const userDetail = await userSvc.getSingleRowByFilter({_id: req.params.userId});
        if (!userDetail){
            throw {
                status: 422,
                message: "User not found",
                status: "USER_DOESNOT_EXIST"
            } 
        }
        const del = await userSvc.deleteUserById({_id: userDetail._id});
        res.json({
            data: userSvc.getUserPublicProfile(del),
            message: "User deleted successfully",
            status: "USER_DELETED",
            option: null
        })
    }catch(exception){
        next(exception);
    }
}
}

const userCtrl = new UserController();
module.exports = userCtrl;