require("dotenv").config()
const path = require("path")
const express =  require("express")
const app = express()
const connectDB = require(path.join(__dirname, "config", "dbConnect.js"))
connectDB()
const cookieParser = require("cookie-parser")
const morgan = require("morgan");
const { errorHandler, notFound } = require(path.join(__dirname, "middlewares", "errorHandler.js"))
// Middleware to parse JSON data
app.use(express.json());
// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
//cookie-parser
app.use(cookieParser())
app.use(morgan("dev"))
const authRouter = require(path.join(__dirname, "routes", "authRoute.js"))
const productRouter = require(path.join(__dirname, "routes", "productRoute.js"))
const blogRouter = require(path.join(__dirname, "routes", "blogRoute.js"))
const PORT = process.env.PORT || 5000
app.use("/api/user", authRouter)
app.use("/api/product", productRouter)
app.use("/api/blog", blogRouter)
app.use(notFound)
app.use(errorHandler)
app.listen(PORT, ()=>{
    console.log("Your server is runnung on port 5000")
})
