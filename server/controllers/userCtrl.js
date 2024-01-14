const path = require("path")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const validateMongoDbId = require(path.join(__dirname, "..", "utils", "validateMongodbid.js"))
const generateAccessToken = require(path.join(__dirname, "..", "config", "jwtToken.js"))
const generateRefreshToken = require(path.join(__dirname, "..", "config", "refreshToken.js"))
const { logEvents } = require(path.join(__dirname, "..", "middlewares", "logEvents.js"))
const User = require(path.join(__dirname, "..", "models", "userModel.js"))
const sendEmail = require(path.join(__dirname, "..", "controllers", "emailCtrl.js"))

//Register A User
const createUser = async (req, res) => {
const {firstname, lastname, email, mobile, password, role} = req.body;
    const user = req.body.email
    if(!user){
        return res.json({"message": "Enter your email", "success": false})
    }
    try{
    const foundUser = await User.findOne({email : user})
    if(!foundUser){
        const hashedPwd = await bcrypt.hash(password, 10);
  const newUser = await User.create(
  {
    firstname,
    lastname,
    email,
    mobile,
    password: hashedPwd,
    role
  }
  );
  res.status(201).json(newUser)
    }else{
        res.json({
            "msg" : "user already exists",
            "success" : false
        })

    }
}catch(error){
    logEvents(`${error.name}: ${error.message}`, "createUserError.txt", "user")

}
}
//Login A User
const loginUser = async (req,res)=> {
    const {email, password} = req.body;
    if(!email){
        return res.json({"message": "Enter your email", "success": false})
    }
    try{
        const foundUser = await User.findOne({ email })
        if(!foundUser) {
            return res.status(401).json({"msg": "User does not exist", "success" : false})  //unAuthorized
           } 
           const match = await bcrypt.compare(password, foundUser.password);
        if(foundUser && match){
const id = foundUser?._id.toString()
const refreshToken = generateRefreshToken(id);
const updateUser = await User.findByIdAndUpdate(id, {refreshToken : refreshToken}, {new: true});
console.log(refreshToken)
res.cookie("refreshToken", refreshToken, {httpOnly : true, maxAge : 72 * 60 * 60 * 1000})
            res.json({
                _id : foundUser?._id,
                firstname : foundUser?.firstname,
                lastname: foundUser?.lastname,
            email : foundUser?.email,
            mobile : foundUser?.mobile,
            token : generateAccessToken(id)
                })
       
        }else{
            return res.status(401).json({"msg": "Invalid Credentials", "success" : false})
        }
       
    }catch(error){
        console.log(error)
        logEvents(`${error.name}: ${error.stack}`, "loginUserError.txt", "user")
    }
}
//handle refresh token
const handleRefreshToken = async (req, res)=>{
    const cookies = req.cookies;
if(!cookies?.refreshToken){
    return res.json({"message": "No refreshToken in cookies", success : false})
}
const refreshToken = cookies.refreshToken;
const user = await User.findOne({refreshToken})
console.log(refreshToken)
if(!user){
    return res.json({"message": "No refreshToken in database or not matched", success : false})
}
const id = user._id.toString();
jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded)=>{
    console.log(decoded)
    if(err || id !== decoded.id){
        return res.json({"message": "Wrong refresh token because it has expired", "success": false})
    }
    const accessToken = generateAccessToken(id)
    res.json({accessToken})
    console.log(decoded)
})
}
//LogOut Functionality
const logout = async (req, res) =>{
    const cookies = req.cookies
    if(!cookies?.refreshToken){
        return res.json({"message": "No refreshToken in cookies", "success" : false})
    }
    const refreshToken = cookies.refreshToken;
    const user = await User.findOne({refreshToken})
    console.log(user)
    if(!user){
        res.clearCookie("refreshToken", {httpOnly: true, secure : true})
        console.log("I Also Got Here");
        return res.sendStatus(204)
    }
    await User.findOneAndUpdate({refreshToken}, {refreshToken: ""})
    res.clearCookie("refreshToken", {httpOnly: true, secure : true})
    return res.sendStatus(204)
    }
//Get All Users
const getAllUsers = async (req, res) => {
try{
const gotUsers = await User.find()
res.status(200).json(gotUsers)
}
catch(error){
    console.log(error)
}
}
//Get a single user
const getAUser = async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
try{
const gotUser = await User.findById(id)
res.json({gotUser});
}catch(error){
    console.log(error)
}
}
//Delete a single user
const deleteAUser = async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
try{
const deleteUser = await User.findByIdAndDelete(id)
res.json({ deleteUser })
}catch(error){
throw new Error(error)
}
}
//Update A User
const updateAUser = async(req, res)=>{
    const {_id} = req.user;
    validateMongoDbId(_id)
const id = _id.toString();
    const updatedUser =  await User.findByIdAndUpdate(id, {
firstname:req?.body?.firstname,
lastname: req?.body?.lastname,
email :req?.body?.email,
mobile :req?.body?.mobile,
    },
    {
        new : true
    })
    res.status(201).json(updatedUser)
}
const blockUser = async (req, res)=> {
const { id } = req.params;
validateMongoDbId(id)
try{
    const block = await User.findByIdAndUpdate(id, {
        isBlocked : true
    }, {
        new : true
    }
    )
    res.status(201).json({"message": "User is blocked", "success":true})
}
catch(error){
    logEvents(`${error.name}: ${error.stack}`, "blockUserError.txt", "user")
}
}
const unblockUser = async (req, res)=> {
    const {id} = req.params;
    validateMongoDbId(id)
try{
    const block = await User.findByIdAndUpdate(id, {
        isBlocked : false
    }, {
        new : true
    }
    )
    res.status(201).json({"message": "User is unblocked", "success":true})
}
catch(error){
    logEvents(`${error.name}: ${error.stack}`, "unblockUserError.txt", "user")
}
}
const updatePassword = async (req, res) => {
const { _id } = req.user;
const {password} = req.body;
validateMongoDbId(_id)
const user = await User.findById(_id);
if(password){
    const hashedPwd = await bcrypt.hash(password, 10);
    user.password = hashedPwd
    const updatedPassword = await user.save();
    res.status(201).json(updatedPassword)
}else{
    res.status(200).json(user)
}
}
const forgotPasswordToken = async(req, res) =>{
const {email} = req.body
console.log(email)
    const user = await User.findOne({email})
    if(!user){
        return res.json({"message": "No user found with this email", "success": "false"} )
    }
    try{
const token = await user.createPasswordResetToken();
await user.save();
const resetURL = `Hi, please folllow this link to reset your password. This link is valid till 10 minutes from now 
<a href="http://localhost:5000/api/user/reset-password/${token}">Click Here</a>`
const data = {
    to : email,
    subject : "Forgot Password Link",
    html : resetURL,
    text : "Hey User"
}
sendEmail(data)
.catch((error)=>{
    logEvents(`${error.name}: ${error.message}`, "sendEmailError.txt", "user")
})
res.json(token)
    }catch(error){
        logEvents(`${error.name}: ${error.message}`, "forgotPasswordTokenError.txt", "user")
    }

}
//install code greeper
const resetPassword = async(req, res) => {
    const {token} = req.params;
    const {password} = req.body;
    console.log(token)
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const user = await User.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires : { $gt : Date.now()}
        // This part ensures that the user's passwordResetExpires property is greater than the current date and time. This is a check to see if the password reset token is still valid and has not expired.
    })
    if(!user){
        return res.json({"message": "Token expired, please try again later", "success": false})
    }
    const hashedPwd = await bcrypt.hash(password, 10);
    user.password = hashedPwd;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user)

}

module.exports = {
createUser,
loginUser,
getAllUsers,
getAUser,
deleteAUser,
updateAUser,
blockUser,
unblockUser,
handleRefreshToken,
logout,
updatePassword,
forgotPasswordToken,
resetPassword}