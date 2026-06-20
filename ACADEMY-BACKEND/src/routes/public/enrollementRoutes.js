const express =
require("express");

const router =
express.Router();

const {
  submitEnrollmentRequest
} = require(
  "../../controllers/public/enrollmentController"
);

router.post(
  "/apply",
  submitEnrollmentRequest
);

module.exports =
router;