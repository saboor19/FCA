const express = require("express");

const router = express.Router();

const {
  protect,
  authorizeRoles
} = require("../../middlewares/authMiddleware");

const {
  getBatchAttendance,
  markStudentAttendance,  
  createAttendanceSession,
  closeAttendanceSession,
  getPendingLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
  getActiveAttendanceSession
} = require("../../controllers/teacher/attendanceController");


router.use(protect,authorizeRoles("TEACHER"));

router.get(
  "/batch/:batchId",
  getBatchAttendance
);

router.post(
  "/",
  markStudentAttendance
);

router.post(
  "/session",
  createAttendanceSession
);

router.put(
  "/session/:sessionId/close",
  closeAttendanceSession
);

router.get(
  "/leaves/pending",
  getPendingLeaveRequests
);

router.put(
  "/leaves/:leaveId/approve",
  approveLeaveRequest
);

router.put(
  "/leaves/:leaveId/reject",
  rejectLeaveRequest
);

router.get(
  "/session/:batchId",
  getActiveAttendanceSession
);


module.exports = router;