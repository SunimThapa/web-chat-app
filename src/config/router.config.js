const router = require("express").Router();
const authRouter = require("../modules/auth/auth.router")
router.get('/about-us', (req, res, next)=>{
    res.json({
        data: "data here",
        status: "active",
        message: "api route testing",
        options: null
    })
})
router.use('/auth', authRouter);

module.exports = router;