const EmailService = require("../../services/mail.service")

class AuthMail{
    svc;
    constructor(){
        this.svc = new EmailService();
    }
    async notifyUserRegistration(user){
        const activationLink = `http://localhost:5173/activation/${user.activationToken}`;
        const messageTemplate=  `<div style="font-family: Arial, sans-serif; color: #333;">
                <div style="background-color: #1E3A8A; padding: 20px; text-align: center; color: #FFFFFF;">
                    <h1>Welcome to Web Chat App!</h1>
                </div>
                <div style="padding: 20px; background-color: #F3F4F6; color: #1E3A8A;">
                    <p>Dear ${user.name},</p>
                    <p>We are thrilled to have you join our community! Web Chat App is designed to connect you with your friends, family, and colleagues in a seamless and efficient way. With our platform, you can enjoy real-time communication, share your thoughts, and build meaningful connections.</p>
                    <p>By activating your account, you unlock the full potential of our platform, including exclusive features that make communication more engaging and productive. We are committed to providing you with the best experience possible.</p>
                    <p>Click the button below to activate your account and get started:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${activationLink}" style="background-color: #10B981; color: #FFFFFF; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Activate Your Account</a>
                    </div>
                    <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                    <p>Welcome aboard!</p>
                </div>
                <div style="background-color: #1E3A8A; padding: 10px; text-align: center; color: #FFFFFF; font-size: 12px;">
                    <p>&copy; 2023 Web Chat App. All rights reserved.</p>
                </div>
            </div>`
           try{
            this.svc.sendEmail({
                to: user.email,
                sub: "Activate your account",
                message:messageTemplate
            
            })
        }catch(exception){
            throw exception;
        }
    }
}

const authMailSvc= new AuthMail();
module.exports= authMailSvc;