const mongoose = require("mongoose");
const { mongoDBConfig } = require('./config');

(async()=>{
    try {
        await mongoose.connect(mongoDBConfig.url,{
            dbName: mongoDBConfig.dbName,
            autoCreate: true,
            autoIndex: true,
        })
        console.log("MongoDB connected successfully");
    }catch(expection){
        console.error("Error connecting to MongoDB:");
        console.log(expection)
    }
})();

