const path = require("path")
const express = require("express")
const { authMiddleware, isAdmin } = require(path.join(__dirname, "..", "middlewares", "authMiddleware.js"))
const {
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
      resetPassword
    } = require(path.join(__dirname, "..", "controllers", "userCtrl.js"))
const router = express.Router()
router.post("/register", createUser)
router.post("/forgot-password-token", forgotPasswordToken)
router.put("/reset-password/:token", resetPassword)
router.put("/password", authMiddleware, updatePassword)
router.post("/login", loginUser)
router.get("/refresh", handleRefreshToken)
router.get("/logout", logout)
router.get("/all-users", getAllUsers)
router.delete("/:id", deleteAUser)
router.get("/:id", authMiddleware, isAdmin,  getAUser)
router.put("/edit-user", authMiddleware, updateAUser)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)
module.exports = router