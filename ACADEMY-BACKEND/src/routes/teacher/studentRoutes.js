const express = require("express");

const router = express.Router();

const {

  protect,
  authorizeRoles

} = require(
  "../../middlewares/authMiddleware"
);
const {getStudents,getStudentById} = require(
  "../../controllers/teacher/studentController"
);


router.use(
  protect,
  authorizeRoles("TEACHER")
);

router.get(
  "/:id",
  getStudentById
);

router.get("/", getStudents);

router.get(
  "/:id",
  getStudentById
);

module.exports = router;