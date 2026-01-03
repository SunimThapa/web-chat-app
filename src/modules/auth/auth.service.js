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
    async getSingleRowByFilter (filter) {
        try {
            const sessionData = await SessionModel.findOne(filter);
            return sessionData;
        } catch (exception) {
            throw exception;
        }
    }
    async deleteMultipleSessionData (filter) {
        try {
            const del = await SessionModel.deleteMany(filter);
            return del;
        } catch (exception) {
            throw exception;
        }
    }
}
const authSvc = new AuthService();
module.exports = authSvc;