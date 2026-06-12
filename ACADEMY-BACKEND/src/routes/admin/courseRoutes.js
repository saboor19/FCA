
const express = require("express");

const router = express.Router();

const {
  protect,
  authorizeRoles
} = require("../../middlewares/authMiddleware");

const validate =
  require("../../middlewares/validateMiddleware");

const {
  createCourseValidation,
  updateCourseValidation
} = require("../../validations/courseValidation");

const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse
} = require("../../controllers/admin/courseController");

// ---------------- PROTECTED ROUTES ----------------

router.use(
  protect,
  authorizeRoles("ADMIN")
);

// ---------------- COURSE ROUTES ----------------

router.post(
  "/",
  validate(createCourseValidation),
  createCourse
);

router.get("/", getCourses);

router.get("/:id", getCourse);

router.put(
  "/:id",
  validate(updateCourseValidation),
  updateCourse
);

router.delete("/:id", deleteCourse);

module.exports = router;
