const express = require("express");

const router = express.Router();

const {
  protect,
  authorizeRoles
} = require("../../middlewares/authMiddleware");

const {
  createStudent,
  getStudents,
  deleteStudent,getStudent,updateStudent
} = require("../../controllers/admin/studentController");

router.use(
  protect,
  authorizeRoles("ADMIN")
);

router.post("/", createStudent);

router.get("/", getStudents);

router.delete("/:id", deleteStudent);

router.get("/:id",getStudent);

router.put("/:id",updateStudent);

module.exports = router;