const express = require("express");

const router = express.Router();

const {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher
} = require("../../controllers/admin/teacherController");

const {
  protect,
  authorizeRoles
} = require("../../middlewares/authMiddleware");



router.use(protect);



router.post(
  "/",
  authorizeRoles("ADMIN"),
  createTeacher
);

router.get(
  "/",
  authorizeRoles("ADMIN"),
  getTeachers
);

router.get(
  "/:id",
  authorizeRoles("ADMIN"),
  getTeacher
);

router.put(
  "/:id",
  authorizeRoles("ADMIN"),
  updateTeacher
);

router.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  deleteTeacher
);


module.exports = router;