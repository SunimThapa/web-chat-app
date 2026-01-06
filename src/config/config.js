require ("dotenv").config();

const CloudinaryConfig ={
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret:process.env.CLOUDINARY_API_SECRET
}
const SMTPConfig={
    Provider: process.env.SMTP_PROVIDER,
    Host: process.env.SMTP_HOST,
    Port: process.env.SMTP_PORT,
    User: process.env.SMTP_USER,
    Password: process.env.SMTP_PASSWORD,
    From: process.env.SMTP_FROM_ADDRESS,

}

const mongoDBConfig = { 
    url: process.env.MONGODB_URL,
    dbName: process.env.MONGODB_NAME,
}
const AppConfig = {
    feURL: process.env.FRONTEND_URL || "http://localhost:3000",
    jwtSecret: process.env.JWT_SECRET,
};

module.exports ={
    mongoDBConfig,
    CloudinaryConfig,
    SMTPConfig,
    AppConfig
}