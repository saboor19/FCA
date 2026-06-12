const express = require("express");

const {
  protect,
  authorizeRoles
} = require("../../middlewares/authMiddleware");

const router = express.Router();

const {
  createEnrollment,
  getEnrollments,deleteEnrollment,getBatchEnrollments
} = require("../../controllers/admin/enrollmentController");

router.post("/", protect,
  authorizeRoles("ADMIN"), createEnrollment);

router.get("/",protect,
  authorizeRoles("ADMIN"),getEnrollments);

router.delete( "/:id", protect,
  authorizeRoles("ADMIN"),
  deleteEnrollment
);

router.get(
  "/batch/:batchId",
  protect,
  authorizeRoles(
    "ADMIN",
    "TEACHER"
  ),
  getBatchEnrollments
);

module.exports = router;