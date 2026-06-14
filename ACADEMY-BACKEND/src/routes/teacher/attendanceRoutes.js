const express = require("express");

const router = express.Router();

const {
  protect,
  authorizeRoles
} = require("../../middlewares/authMiddleware");

const {
  getBatchAttendance,
  markStudentAttendance
} = require("../../controllers/teacher/attendanceController");

router.get(
  "/batch/:batchId",
  protect,
  authorizeRoles("TEACHER"),
  getBatchAttendance
);

router.post(
  "/",
  protect,
  authorizeRoles("TEACHER"),
  markStudentAttendance
);

module.exports = router;