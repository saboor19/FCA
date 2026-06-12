const express = require("express");

const {
  protect,
  authorizeRoles
} = require("../middlewares/authMiddleware");


const router = express.Router();


// Protected Route
router.get("/profile", protect, (req, res) => {

  res.json({
    message: "Protected route accessed",
    user: req.user
  });

});

// Admin Only
router.get(
  "/admin",
  protect,
  authorizeRoles("ADMIN"),
  (req, res) => {

    res.json({
      message: "Welcome Admin"
    });

  }
);


// Teacher Only
router.get(
  "/teacher",
  protect,
  authorizeRoles("TEACHER"),
  (req, res) => {

    res.json({
      message: "Welcome Teacher"
    });

  }
);


// Student Only
router.get(
  "/student",
  protect,
  authorizeRoles("STUDENT"),
  (req, res) => {

    res.json({
      message: "Welcome Student"
    });

  }
);

module.exports = router;