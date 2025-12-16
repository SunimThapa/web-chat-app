const express = require("express");
require("./mongo.config")

const router = require("./router.config");
const app = express();

const cors = require("cors"); 
const helmet = require("helmet");
const {rateLimit}= require("express-rate-limit")

app.use(cors(
    {
        origin:"*"
    }
))
 app.use(rateLimit({
    windowMs: 30000,
    limit: 60,
    standardHeaders: "draft-8",
    legacyHeaders: "false" 
 }));
 app.use(helmet())
 app.use (express.json())
app.use (express.urlencoded())

app.use("/api/v1", router)
app.use ((req, res, next)=>{
    next ({
       code: 404,
       error: null,
       message:"Resource not found",
       status:"NOT_FOUND",
       option: null
});
})
app.use ((error, req, res, next)=>{
    console.log("Error Occured", error)
   let statusCode = error.code || 500;
    let details = error.details || null;
    let msg = error.message || "Internal Server Error.."
    let status = error.status || "SERVER_ERROR"


    if ((error.name === "MongoServerError" )) {
        statusCode = 400;
        status = "DUPLICATE_KEY";
        msg = "Duplicate field error";
        details = {};
        
        if(+error.code === 11000) {
            // MongoDB duplicate key error
            Object.keys(error.keyPattern).map((field) => {
        
                details[field] = `${field} already exists`;
            });
        }
        
    }
    
    res.status(statusCode).json({
        error: details,
        message: msg,
        status: status,
        option: null
    });
});


module.exports = app;