// routes/student/studyMaterialRoutes.js
const express = require("express");
const router = express.Router();

const {
  getStudentStudyMaterials,
  getStudentStudyMaterialById,
  previewStudyMaterialAttachment,
  downloadStudyMaterialAttachment,
} = require("../../controllers/student/studyMaterialController");

const { protect, authorizeRoles } = require("../../middlewares/authMiddleware");

router.get("/", protect, authorizeRoles("STUDENT"), getStudentStudyMaterials);
router.get("/:id", protect, authorizeRoles("STUDENT"), getStudentStudyMaterialById);
router.get(
  "/:id/attachments/:attachmentId/preview",
  protect,
  authorizeRoles("STUDENT"),
  previewStudyMaterialAttachment
);
router.get(
  "/:id/attachments/:attachmentId/download",
  protect,
  authorizeRoles("STUDENT"),
  downloadStudyMaterialAttachment
);

module.exports = router;