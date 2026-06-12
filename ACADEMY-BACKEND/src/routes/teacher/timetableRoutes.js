const express = require("express");

const router = express.Router();

const {

  protect,
  authorizeRoles

} = require(
  "../../middlewares/authMiddleware"
);

const {

  getTeacherTimetable

} = require(
  "../../controllers/teacher/timetableController"
);


router.use(
  protect,
  authorizeRoles("TEACHER")
);


// GET MY TIMETABLE

router.get(
  "/",
  getTeacherTimetable
);


module.exports = router;