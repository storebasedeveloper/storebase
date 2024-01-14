const jwt = require("jsonwebtoken");
const path = require("path");
const { logEvents } = require(path.join(__dirname, "..", "middlewares", "logEvents.js"))
const User = require(path.join(__dirname, "..", "models", "userModel.js"))
const authMiddleware = async (req, res, next)=>{
let token;
if(req?.headers?.authorization?.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1]
    try{
        if(token){
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded?.id);
            req.user = user;
            next()
        }
    }catch(error){
        logEvents(`${error.name}:${error.message}`, "authenticationErrorLog.txt", "auth")
        console.log("error")
        return res.json({"message": "Authentication token has expired", "success" : "false"})
    }
    //659efb572e740fbc683e648a
}else{
return res.json({"message" : "No Authorization token in the request headers"})
}
} 
const isAdmin = async (req, res, next) => {
const { email } = req.user
const adminUser = await User.findOne({email})
if(adminUser.role !== "admin"){
    return res.json({"message" : "You are not an admin", "success": false})
}else{
    next()
}
}
module.exports = { authMiddleware, isAdmin }