const express = require("express");

const router = express.Router();

const {

  createAssignment,

  getTeacherAssignments,

  getSingleAssignment,

  updateAssignment,

  publishAssignment,

  closeAssignment,

  deleteAssignment,

  getAssignmentSubmissions,

  getSingleSubmission,
  
  gradeSubmission

} = require(
  "../../controllers/teacher/assignmentController"
);


const {

  protect,

  authorizeRoles

} = require(
  "../../middlewares/authMiddleware"
);



// CREATE
router.post(
  "/",
  protect,
  authorizeRoles("TEACHER"),
  createAssignment
);



// GET ALL
router.get(
  "/",
  protect,
  authorizeRoles("TEACHER"),
  getTeacherAssignments
);



// GET SINGLE
router.get(
  "/:id",
  protect,
  authorizeRoles("TEACHER"),
  getSingleAssignment
);



// UPDATE
router.put(
  "/:id",
  protect,
  authorizeRoles("TEACHER"),
  updateAssignment
);



// PUBLISH
router.patch(
  "/:id/publish",
  protect,
  authorizeRoles("TEACHER"),
  publishAssignment
);



// CLOSE
router.patch(
  "/:id/close",
  protect,
  authorizeRoles("TEACHER"),
  closeAssignment
);


router.get(
  "/submissions/:submissionId",
  protect,
  authorizeRoles("TEACHER"),
  getSingleSubmission
);

router.get(
  "/:assignmentId/submissions",
  protect,
  authorizeRoles("TEACHER"),
  getAssignmentSubmissions
);


router.patch(
  "/submissions/:submissionId/grade",
  protect,
  authorizeRoles("TEACHER"),
  gradeSubmission
);


// DELETE
router.delete(
  "/:id",
  protect,
  authorizeRoles("TEACHER"),
  deleteAssignment
);



module.exports = router;