const fs = require("fs");
const multer = require("multer");
const { type } = require("os");


const uploader =()=>{
    const mystorage = multer.diskStorage({
        destination: (req, file, cb)=>{
            let dirPath= "./public/uploads"
            if (!fs.existsSync(dirPath)){
                fs.mkdirSync(dirPath, {recursive: true})
            }
            cb (null, dirPath)
        },
        filename: (req, file, cb)=>{
            const filename= Date.now()+"-"+file.originalname
            cb(null, filename)
        }
    });
    let allowExts= ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'jfif']
    let maxfileSize = 3 * 1024 * 1024;
    if (type ==='doc'){
        allowExts= ['pdf', 'doc', 'docx', 'csv', 'xls', 'xlsx', 'json'];
        maxfileSize= 5 * 1024 * 1024;
    }
    const validateFileType= (req, file, cb)=>{
        const fileExt= file.originalname.split(".").pop()
        if (allowExts.includes(fileExt.toLowerCase()))
            cb (null, true)
        else{
            cb({
                code: 422, 
                message: "Files format not supported",
                status: "UNSUPPORTED_FILE_FORMAT_ERR"
            })
        }
    }
    return multer({
        storage: mystorage,
        fileFilter:validateFileType,
        limits:{
            fileSize: maxfileSize
        }
    });
}
module.exports = uploader;