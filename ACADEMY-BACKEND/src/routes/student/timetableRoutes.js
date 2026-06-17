const express =
require("express");

const router =
express.Router();

const {

  getMyTimetable

} = require(
  "../../controllers/student/timetableController"
);

const {

  protect,
  authorizeRoles

} = require(
  "../../middlewares/authMiddleware"
);



router.get(
  "/",
  protect,
  authorizeRoles("STUDENT"),
  getMyTimetable
);



module.exports =
router;