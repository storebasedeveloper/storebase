const path = require("path")
const Brand = require(path.join(__dirname,  "..", "models", "brandModel.js"))
const validateMongodbid = require(path.join(__dirname, "..", "utils", "validateMongodbid.js"))
const { logEvents } = require(path.join(__dirname, "..", "middlewares", "logEvents.js"))
const createBrand = async(req, res) => {
    try{
const newBrand = await Brand.create(req.body);
res.status(201).json(newBrand)
    }catch(error){
        logEvents(`${error.name}:${error.message}`, "createBrandError.txt", "brand")
    }
}
const updateBrand = async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id)
    try{
const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {new : true});
res.status(201).json(updatedBrand)
    }catch(error){
        logEvents(`${error.name}:${error.message}`, "updatateBrandError.txt","brand")
    }
}
const deleteBrand = async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id)
    try{
const deletedBrand = await Brand.findByIdAndDelete(id);
res.status(200).json(deletedBrand)
    }catch(error){
        logEvents(`${error.name}:${error.message}`, "deleteBrandError.txt", "brand")
    }
}
const getBrand = async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id)
    try{
const getaBrand = await Brand.findById(id);
res.status(200).json(getaBrand)
    }catch(error){
        logEvents(`${error.name}:${error.message}`, "getBrandError.txt", "brand")
    }
}
const getAllBrand = async(req, res) => {
    try{
const getAllBrand = await Brand.find();
res.status(200).json(getAllBrand)
    }catch(error){
        logEvents(`${error.name}:${error.message}`, "getBrandError.txt", "brand")
    }
}
module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand }
