const { AppConfig } = require('../config/config');
const authSvc = require('../modules/auth/auth.service');
const jwt = require('jsonwebtoken');
const userSvc = require('../modules/user/user.service');

const checkLogin =() =>{
    return async (req, res, next)=>{
        try {
            let token = req.headers['authorization'] || null;
            if (!token) {
                throw {
                    code: 401,
                    message: "login first",
                    status: "Unauthorized"
                }
            }
            token = token.replace("Bearer ", "");
            const sessionData = await authSvc.getSingleRowByFilter({
                "token.access": token
            })
            if (!sessionData) {
                throw {
                    code: 401,
                    message: "Session not found",
                    status: "SESSION_NOT_FOUND"
            }
        }
        const payload = jwt.verify(token, AppConfig.jwtSecret)
            if(payload.type !== "Bearer"){
                throw {
                    code: 401,
                    message: "Invalid Token Type",
                    status: "INVALID_TOKEN_TYPE"
                }
            }
        const userDetail = await userSvc.getSingleRowByFilter({
            _id: payload.sub,
        })
        if (!userDetail){
            throw {
                code: 403,
                message: "User already deleted or does not exist",
                status: "USER_NOT_FOUND"
            }
        } 
        req.loggedInUser = userSvc.getUserPublicProfile(userDetail);
        next ();
        }
        catch(expection){
            let error = expection

            if (expection instanceof jwt.JsonWebTokenError) {
                error ['code']= 401;
                error ['message']= "Token_Expired";
            } else if (expection instanceof jwt.JsonWebTokenError){
                error ['code']= 401;
                error ['status']= "JWT_TOKEN_ERR";
            }
            next (error);
        }
    }
    
}
 module.exports= checkLogin;