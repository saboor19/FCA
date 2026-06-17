const express = require("express");

const router =
  express.Router();

const {
  getMyAttendance,
  getAttendanceStats,
  getAttendanceOverview,
  markOfflineAttendance,
  markOnlineAttendance,
  submitLeaveRequest,
  getMyLeaveRequests
} =
require("../../controllers/student/attendanceController");

const {
  protect,
  authorizeRoles
} =
require("../../middlewares/authMiddleware");

router.use(
  protect,
  authorizeRoles("STUDENT")
);

router.get(
  "/",
  getMyAttendance
);

router.get(
  "/stats",
  getAttendanceStats
);

router.get(
  "/overview",
  getAttendanceOverview
);

router.post(
  "/offline",
  markOfflineAttendance
);

router.post(
  "/online",
  markOnlineAttendance
);

router.post(
  "/leaves",
  submitLeaveRequest
);

router.get(
  "/leaves",
  getMyLeaveRequests
);

module.exports =
router;