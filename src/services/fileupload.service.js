const CloudinaryService= require("./cloudinary.service");

class FileUploadService {
    uploadSvc;
constructor (cloudinarySvc){
    this.uploadSvc =cloudinarySvc
}
async uploadFile(filepath, dir='/'){
    try{
       return await this.uploadSvc.fileUpload(filepath, dir);
    }
    catch(exception){
        throw exception
    }
}
}
const fileUploadSvc= new FileUploadService(
    new CloudinaryService()
)

module.exports= fileUploadSvc;