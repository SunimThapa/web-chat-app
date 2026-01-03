const userRouter = require("express").Router();
const checkLogin = require('../../middlewares/auth.middleware');
const bodyValidator = require('../../middlewares/validator.middleware');
const userCtrl = require('./user.controller')
const uploader = require("../../middlewares/uploader.middleware");
const Joi = require("joi");

const UserUpdateDTO= Joi.object({
    name:Joi.string().min(2).max(50).required(),
    status: Joi.string().regex(/^(active|inactive)$/).default("active"),
    address:Joi.string().allow(null, "").optional().default(null),
    gender:Joi.string().regex(/^(male|female|others)$/).required(),
    dob:Joi.date().less("now"),
    profilePicture: Joi.string().allow(null, "").optional().default(null)
});



userRouter.get('/', checkLogin(),userCtrl.listAllUser);
userRouter.get('/:userId', checkLogin(), userCtrl.getDetailById);
userRouter.put('/:userId', checkLogin(),uploader().single("profilePicture"),bodyValidator(UserUpdateDTO), userCtrl.updateUserById);
userRouter.delete('/:userId', checkLogin(), userCtrl.deleteUserById);

module.exports = userRouter;








