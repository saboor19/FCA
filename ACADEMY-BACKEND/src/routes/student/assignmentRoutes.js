const express = require("express");

const router = express.Router();

const {  
  startAssignmentAttempt,
  getStudentAssignmentById,
  getStudentAssignments ,
  submitAssignment,
  saveAssignmentAnswers,
  getStudentSubmission  
} = require("../../controllers/student/assignmentController");

const { protect,authorizeRoles } = require("../../middlewares/authMiddleware");


router.get("/",protect,authorizeRoles("STUDENT"),getStudentAssignments);

router.get("/:assignmentId",protect,authorizeRoles("STUDENT"),getStudentAssignmentById);

router.post("/:assignmentId/start",protect,authorizeRoles("STUDENT"),startAssignmentAttempt);

router.patch("/submissions/:submissionId/save",protect,authorizeRoles("STUDENT"),saveAssignmentAnswers);

router.post("/submissions/:submissionId/submit",protect, authorizeRoles("STUDENT"),submitAssignment);

router.get( "/submissions/:id", protect, authorizeRoles("STUDENT"), getStudentSubmission);

module.exports = router;