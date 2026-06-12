const express = require("express");

const { registerUser, loginUser,getMe } = require("../controllers/authController");
const {
  protect,
  authorizeRoles
} = require("../middlewares/authMiddleware");
const router = express.Router();


// Register
router.post("/register", registerUser);


// Login
router.post("/login", loginUser);

//me
router.get("/me",protect,getMe);

module.exports = router;