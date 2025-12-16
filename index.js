const http = require("http");
const app = require('./src/config/express.config');

(()=>{
const httpServer= http.createServer(app);
const PORT = 9005;
const HOST = 'localhost';

httpServer.listen(PORT, HOST, ()=>{
    console.log(`URL: http://${HOST}:${PORT}`)
    console.log("Server is running on port"+PORT)
    console.log("Press CTRL+c to disconnect server...")
});
})()

