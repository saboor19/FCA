const express = require("express");

const router = express.Router();

const {
  protect,
  authorizeRoles
} = require("../../middlewares/authMiddleware");

const {
  createBatch,
  getBatches,
  getBatch,
  updateBatch,
  deleteBatch,assignStudents, 
  getUnassignedStudents, 
  getAvailableStudents,
  removeStudentsFromBatch,assignTeachers,removeTeachers,getAvailableTeachers
} = require("../../controllers/admin/batchController");

router.use(
  protect,
  authorizeRoles("ADMIN","SALES_TEAM")
);

router.post("/", createBatch);

router.get("/", getBatches);

router.get(
  "/students/unassigned",
  getUnassignedStudents
);

router.get(
  "/students/available/:batchId",
  getAvailableStudents
);

router.get("/:id", getBatch);

router.put("/:id", updateBatch);

router.put( "/:id/students/remove",protect,  authorizeRoles("ADMIN"),  removeStudentsFromBatch);

router.post("/:id/students", assignStudents);

router.put( "/:id/teachers",protect,authorizeRoles("ADMIN"),assignTeachers);

router.put( "/:id/teachers/remove", protect, authorizeRoles("ADMIN"),removeTeachers);

router.get( "/:id/teachers/available", protect, authorizeRoles("ADMIN"), getAvailableTeachers);

router.delete("/:id", deleteBatch);

module.exports = router;