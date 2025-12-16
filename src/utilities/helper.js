const crypto = require("crypto");
const fs= require("fs");

const deleteFile= async(filepath)=>{
if (fs.existsSync(filepath)){
    return fs.unlinkSync(filepath)
}
return false;
}
const randomStringGenerator = (length = 64) => {
    return crypto
        .randomBytes(length)
        .toString("hex")
        .slice(0, length);
};

module.exports = {
    randomStringGenerator,
    deleteFile
}