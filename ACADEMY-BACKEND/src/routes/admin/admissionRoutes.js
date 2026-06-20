const express =
require("express");

const router =
express.Router();

const {
  getEnrollmentRequests,
  getEnrollmentRequest,
  approveEnrollmentRequest,
  rejectEnrollmentRequest
} = require(
  "../../controllers/admin/admissionController"
);

const {
  protect,
  authorizeRoles
} = require("../../middlewares/authMiddleware");

router.use(
  protect,
  authorizeRoles("ADMIN")
);

router.get(
  "/",
  getEnrollmentRequests
);

router.get(
  "/:id",
  getEnrollmentRequest
);

router.post(
  "/:id/approve",
  approveEnrollmentRequest
);

router.post(
  "/:id/reject",
  rejectEnrollmentRequest
);

module.exports =
router;