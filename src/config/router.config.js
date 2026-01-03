const router = require("express").Router();
const authRouter = require("../modules/auth/auth.router");
const userRouter = require("../modules/user/user.router");
const chatRouter = require("../modules/chat/chat.router");
const messageRouter = require("../modules/messages/message.router");
router.get('/about-us', (req, res, next)=>{
    res.json({
        data: "data here",
        status: "active",
        message: "api route testing",
        options: null
    })
})
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/chat', chatRouter);
router.use('/message', messageRouter);

module.exports = router;