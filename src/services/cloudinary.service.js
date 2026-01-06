const {CloudinaryConfig} = require("../config/config")
const fs = require("fs")


const cloudinary = require('cloudinary').v2;

class CloudinaryService{
    constructor (){
    cloudinary.config({
    cloud_name : CloudinaryConfig.cloudName,
    api_key : CloudinaryConfig.apiKey,
    api_secret: CloudinaryConfig.apiSecret
})
}
fileUpload =async (filepath, dir='/')=>{
    try{
   const {public_id, secure_url} = await cloudinary.uploader.upload(filepath, {
    unique_filename: true,
    folder: "/web_chat_app"+dir,
   })
   const response= cloudinary.url(public_id, 
    { transformation: [
      { responsive: true, width: 1024, crop: "scale", fetch_format: "auto" }, 
    ]})
        fs.unlinkSync(filepath);
      return{
        publicId:public_id,
        url: secure_url,
        thumbUrl:response
    }
    }
    catch (exception) {
        console.error(exception);
    throw{
        code:500,
        message: "file upload error",
        status: "CLOUDINARY_ERR"
    }
    }
    
}
}

module.exports =CloudinaryService;