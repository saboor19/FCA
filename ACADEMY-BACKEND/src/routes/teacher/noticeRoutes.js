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

module.exports =
router;