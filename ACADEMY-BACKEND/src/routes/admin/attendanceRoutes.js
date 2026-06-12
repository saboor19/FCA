const express = require("express");

const router = express.Router();

const {
  protect,
  authorizeRoles
} = require("../../middlewares/authMiddleware");

const {

  markStudentAttendance,
  getBatchAttendance,
  updateStudentAttendance,
  markTeacherAttendance,
  getTeacherAttendance,getStudentAttendance

} = require(
  "../../controllers/admin/attendanceController"
);

router.use(
  protect,
  authorizeRoles("ADMIN")
);

// ------------------STUDENT ATTENDANCE

router.post(
  "/students",
  markStudentAttendance
);

router.get(
  "/students/batch/:batchId",
  getBatchAttendance
);

router.put(
  "/students/:id",
  updateStudentAttendance
);

router.get(
  "/students/student/:studentId",
  getStudentAttendance
);

// --------------TEACHER ATTENDANCE

router.get(
  "/teachers",
  getTeacherAttendance
);

router.post(
  "/teachers",
  markTeacherAttendance
);

module.exports = router;
