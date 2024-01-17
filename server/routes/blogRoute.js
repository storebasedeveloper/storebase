const path = require("path")
const express = require("express")
const router = express.Router()
const { isAdmin, authMiddleware } = require(path.join(__dirname, "..", "middlewares", "authMiddleware.js"))
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog } = require(path.join(__dirname, "..", "controllers", "blogCtrl"))
router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id",  getBlog);
router.get("/",  getAllBlog);
router.delete("/:id",  authMiddleware, isAdmin, deleteBlog);
module.exports = router
