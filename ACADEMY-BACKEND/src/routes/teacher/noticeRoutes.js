const express =
require("express");

const router =
express.Router();

const {

  protect,
  authorizeRoles

} = require(
  "../../middlewares/authMiddleware"
);
const {
  downloadNoticePdf
} = require("../../controllers/common/noticePdfController");

const {

  getTeacherNotices,
  getTeacherNoticeById,
  markNoticeAsRead

} = require(
  "../../controllers/teacher/noticeController"
);

router.use(
  protect,
  authorizeRoles("TEACHER")
);

router.get(
  "/",
  getTeacherNotices
);

router.get(
  "/:id",
  getTeacherNoticeById
);

router.post(
  "/:id/read",
  markNoticeAsRead
);
router.get(
  "/:id/pdf",
  protect,
  authorizeRoles("TEACHER"),
  downloadNoticePdf
);

module.exports =
router;