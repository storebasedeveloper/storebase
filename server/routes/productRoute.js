const path = require("path")
const express = require("express")
const { isAdmin, authMiddleware } = require(path.join(__dirname, "..", "middlewares", "authMiddleware.js"))
const router = express.Router()
const { 
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
 } = require(path.join(__dirname, "..", "controllers", "productCtrl.js"))
router.post("/", authMiddleware, isAdmin, createProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.get("/", getAllProduct)
router.get("/:id",getaProduct)
module.exports = router