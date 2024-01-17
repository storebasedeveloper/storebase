const path = require("path")
const Category = require(path.join(__dirname,  "..", "models", "blogCategoryModel.js"))
const validateMongodbid = require(path.join(__dirname, "..", "utils", "validateMongodbid.js"))
const { logEvents } = require(path.join(__dirname, "..", "middlewares", "logEvents.js"))
const createCategory = async(req, res) => {
    try{
const newCategory = await Category.create(req.body);
res.status(201).json(newCategory)
    }catch(error){
        logEvents(`${error.name}:${error.message}`, "createCategoryError.txt", "category")
    }
}
const updateCategory = async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id)
    try{
const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {new : true});
res.status(201).json(updatedCategory)
    }catch(error){
        logEvents(`${error.name}:${error.message}`, "updatateCategoryError.txt", "category")
    }
}
const deleteCategory = async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id)
    try{
const deletedCategory = await Category.findByIdAndDelete(id);
res.status(200).json(deletedCategory)
    }catch(error){
        logEvents(`${error.name}:${error.message}`, "deleteCategoryError.txt", "category")
    }
}
const getCategory = async(req, res) => {
    const {id} = req.params;
    validateMongodbid(id)
    try{
const getaCategory = await Category.findById(id);
res.status(200).json(getaCategory)
    }catch(error){
        logEvents(`${error.name}:${error.message}`, "getCategoryError.txt", "category")
    }
}
const getAllCategory = async(req, res) => {
    try{
const getAllCategory = await Category.find();
res.status(200).json(getAllCategory)
    }catch(error){
        logEvents(`${error.name}:${error.message}`, "getCategoryError.txt", "category")
    }
}
module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory }
