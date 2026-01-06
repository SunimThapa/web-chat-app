const nodemailer = require("nodemailer");
const { SMTPConfig } = require("../config/config");
class EmailService{
    #transport;
    constructor(){
        try{
            this.#transport= nodemailer.createTransport({
                host: SMTPConfig.Host,
                port: SMTPConfig.Port,
                service: SMTPConfig.Provider,
                auth: {
                    user: SMTPConfig.User,
                    pass: SMTPConfig.Password
                }
            })
            console.log("********* SMTP server connected successfully *********")
        }catch(exception){
            console.error("********* Error Connecting SMTP Server *********")
            throw{
                code: 500,
                message: "SMTP server connection error",
                status: "SMTP_CONNECTION_ERROR"
            }
        }
    }
    sendEmail = async ({to, sub, message, attachments=null, cc= null, bcc=null})=>{
    try{
        let emailBody={
            to:to,
            from:SMTPConfig.From,
            subject: sub,
            html:message,
        }
        if(cc){
                emailBody('cc')=cc;
            }
            if(bcc){
                emailBody('bcc')=bcc;
            }
            if(attachments){
                emailBody('attachments')=attachments;
            }
        return await this.#transport.sendMail(emailBody)
    }catch(exception){
        throw exception
    }
}
}

module.exports = EmailService;

