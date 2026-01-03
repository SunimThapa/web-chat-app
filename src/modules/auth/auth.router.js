const authrouter= require("express").Router()
const bodyValidator = require("../../middlewares/validator.middleware")
const {RegisterUserDTO, LoginDTO} = require("./auth.validator")
const uploader = require("../../middlewares/uploader.middleware")
const authctrl = require("./auth.controller")
const checkLogin= require("../../middlewares/auth.middleware")

authrouter.post("/register",uploader().single("profilePicture"),bodyValidator(RegisterUserDTO),authctrl.registeruser)
authrouter.get ("/activation/:token",authctrl.activateUserProfile)
authrouter.post ("/login",bodyValidator(LoginDTO),authctrl.login)
authrouter.get ('/me', checkLogin(), authctrl.getLogInUserProfile)
authrouter.post ("/logout",checkLogin(),authctrl.logout)

module.exports = authrouter;