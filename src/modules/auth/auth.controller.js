const userSvc = require('../user/user.service')
const { AppConfig } = require("../../config/config");
const { Status } = require("../../config/constant");
const { randomStringGenerator } = require("../../utilities/helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const authSvc=require("./auth.service");
const authMailSvc = require('./auth.mail');

class AuthController {
     registeruser= async (req, res, next)=>{
        try {
        const data = await userSvc.transformUserRegister(req);
        const user = await userSvc.userRegister(data);
        
        await authMailSvc.notifyUserRegistration(data);
        res.json({
            data: user,
            message: "Your account has been registered successflly",
            status: "ok",
            option: null
        });
    }
    catch (exception){
           next(exception)
    }
    };
    activateUserProfile =  async (req, res, next)=>{
        try{
            let token = req.params.token;
            const userDetail = await userSvc.getSingleRowByFilter({
                 activationToken: token
            })
        if (!userDetail){
            throw {
                status: Status.NOT_FOUND,
                message: "User not found",
                status: "USER_DOESNOT_EXIST"
            }
        }
        let expiryTime = userDetail.expiryTime.getTime();
        let todayTime= Date.now();
        if (expiryTime < todayTime){
            userDetail.activationToken = randomStringGenerator(150);
            userDetail.expiryTime = new Date(Date.now() + 1000 * 60 * 60 * 3);
            await userDetail.save();
            res.json({
                data: null,
                message: "A new verififacation link has been sent to your email",
                status: "RESENT_VERIFICATION_LINK",
                option: null
            });
        }
        else{
            userDetail.activationToken = null;
            userDetail.expiryTime = null;
            userDetail.status = Status.ACTIVE;
            await userDetail.save()
            res.json({
                data: null,
                message: "Your account has been activated successfully",
                status: "ACCOUNT_ACTIVATED",
                option: null
            });
        }
        }
        catch (exception){
            next(exception)
        }
    };
    login = async (req, res, next)=>{
        try{
            const {email, password} = req.body;
            const userInfo = await userSvc.getSingleRowByFilter({
                email: email,
            })
            if (!userInfo){
                throw {
                    code: 422,
                    message: "User not registered yet",
                    status: "USER_NOT_REGISTERED"
                }
            }
            console.log("Entered password:", `"${password}"`);
            console.log("Stored hashed password:", userInfo.password);

            if (!bcrypt.compareSync(password, userInfo.password)){
                    throw {
                        code: 422,
                        message: "Crentials do not match",
                        status: "CREDENTIALS_DO_NOT_MATCH"
                    }
                }
            if (userInfo.status !== Status.ACTIVE || userInfo.activationToken !== null){
               
                throw{
                    
                    code: 422,
                    message: "Please activate your account first",
                    status: "ACCOUNT_NOT_ACTIVE"
                }
            }
            const accessToken = jwt.sign({
                sub: userInfo._id,
                type: "Bearer",
            }, AppConfig.jwtSecret, {expiresIn: "5hr"})
            const refreshToken = jwt.sign({
                sub: userInfo._id,
                type: "Refresh",
            }, AppConfig.jwtSecret, {expiresIn: "7d"})

            let sessionData = {
                user: userInfo._id,
                token: {
                    access: accessToken,
                    refresh: refreshToken
                },
                accessDevice: "web",
                ip: req.socket.remoteAddress || req.headers['x-forwarded-for'] 
            }
            await authSvc.storeSession(sessionData);

            res.json({
                data:{
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                },
                message: "You have logged in successfully",
                status: "LOGIN_SUCCESS",
                option: null
            })
        }catch (exception){
            next(exception)
        }
    };
    getLogInUserProfile = (req, res, next)=>{
            res.json({
                data: req.loggedInUser,
                message: "Your profile",
                status: "sucessful",
                option: null
            })
    };
    logout = async (req, res, next)=>{
        try{
            const loggedInUser = req.loggedInUser;
            let filter ={}
            if (req.query.logoutFromAll ){
                filter = {
                    user: loggedInUser._id
                }
                
                }else{
                const token = (req.headers['authorization']).replace("Bearer ", "");
                filter = {
                    ...filter,
                    "token.access": token
                };
            }
            await authSvc.deleteMultipleSessionData(filter);
            res.json({
                data: null,
                message: "You have logged out successfully",
                status: "LOGOUT_SUCCESS",
                option: null
            })
            }catch (exception){
            next(exception)
        }
    }
}
const authctrl = new AuthController();
module.exports = authctrl;