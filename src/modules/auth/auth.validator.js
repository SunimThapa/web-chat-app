const Joi = require("joi");
const strongPasswordPattern =/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W_])[a-zA-z\d\W_]{8,25}$/

const RegisterUserDTO = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(strongPasswordPattern).required(),
    confirmPassword: Joi.ref('password'),
    address: Joi.string().allow(null, "").optional().default(null),
    gender: Joi.string().regex(/^(male|female|others)$/).required(),
    dob: Joi.date().less("now"),
    profilePicture:Joi.string().allow(null, "").optional().default(null)
})
const LoginDTO = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports ={
    RegisterUserDTO,
    LoginDTO
};
