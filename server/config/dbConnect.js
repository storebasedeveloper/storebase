const mongoose = require("mongoose") //mongoDB
const connectDB = async () =>{
    try{
   await mongoose.connect(process.env.MONGODB_URL
)
console.log("database connected successfully");
    }catch(err){
        console.log("Database Error")
        console.error(err)
    }
}
module.exports = connectDB 