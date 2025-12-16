const SessionModel = require('./session.module');
class AuthService {
    async storeSession (data) {
        try{
            const session = new SessionModel(data)
            return await session.save();
        }
        catch (exception){
            throw exception;
        }   
    }
}
const authSvc = new AuthService();
module.exports = authSvc;