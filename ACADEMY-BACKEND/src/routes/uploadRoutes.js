const express = require("express");

const router = express.Router();

const upload =
  require("../middlewares/uploadMiddleware");

const {

  uploadFile,

  getFile,

  deleteFile

} = require(
  "../controllers/uploadController"
);

router.post(
  "/",
  upload.single("file"),
  uploadFile
);

router.get(
  "/:id",
  getFile
);

router.delete(
  "/:id",
  deleteFile
);

module.exports = router;