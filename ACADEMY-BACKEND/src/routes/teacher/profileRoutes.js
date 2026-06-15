const express = require("express");

const router = express.Router();

const {
  getMyProfile,
  updateMyProfile
} = require(
  "../../controllers/teacher/profileController"
);

const {
  uploadProfileImage
} = require(
  "../../controllers/teacher/uploadController"
);

const {
  protect,
  authorizeRoles
} = require(
  "../../middlewares/authMiddleware"
);

const upload =
  require("../../middlewares/uploadMiddleware");



router.get(
  "/me",
  protect,
  authorizeRoles("TEACHER"),
  getMyProfile
);

router.put(
  "/update",
  protect,
  authorizeRoles("TEACHER"),
  updateMyProfile
);

router.post(
  "/upload-image",
  protect,
  authorizeRoles("TEACHER"),
  upload.single("image"),
  uploadProfileImage
);

module.exports = router;