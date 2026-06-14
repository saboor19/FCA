const express = require("express");

const { registerUser, loginUser,getMe ,logoutUser} = require("../controllers/authController");
const {
  protect,
  authorizeRoles
} = require("../middlewares/authMiddleware");
const router = express.Router();


// Register
router.post("/register", registerUser);


// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", protect, authorizeRoles("STUDENT","TEACHER","ADMIN"), logoutUser);

//me
router.get("/me",protect,getMe);

module.exports = router;