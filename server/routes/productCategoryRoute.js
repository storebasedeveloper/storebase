const express = require("express")
const path = require("path")
const router = express.Router()
const { isAdmin, authMiddleware } = require(path.join(__dirname, "..", "middlewares", "authMiddleware.js"))
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory } = require(path.join(__dirname, "..", "controllers", "productCategoryCtrl"))
router.post("/", authMiddleware, isAdmin, createCategory)
router.put("/:id", authMiddleware, isAdmin, updateCategory)
router.delete("/:id", authMiddleware, isAdmin, deleteCategory)
router.get("/:id", getCategory)
router.get("/", getAllCategory)
module.exports = router