
const { logEvents} = require("./logEvents")
const errorHandler = (err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).send(err.message)
    logEvents(`${err.name}: ${err.message}`, "errLog.txt")
    next();
}
const notFound = (req, res, next) => {
    res.status(404).json({"message": "Not Found", "success": false});
    next()

}
module.exports = { errorHandler, notFound}