const mongoose = require('mongoose');
const Gender = require('../../config/constant').Gender;
const Status = require('../../config/constant').Status;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 2,
        max: 50,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
    },
    address: String,
    dob: Date,
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.ACTIVE, 
    },
    activationToken: String ,
    expiryTime: Date,
   profilePicture:{ 
       publicId:String,
        url: String,
        thumbUrl:String
   }
},{
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
    
})

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;