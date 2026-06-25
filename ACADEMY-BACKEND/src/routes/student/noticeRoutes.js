const express = require("express");

const router =
  express.Router();

const {

  getNotices,
  getNotice,
  markNoticeAsRead

} = require(
  "../../controllers/student/noticeController"
);


const {
  downloadNoticePdf
} = require("../../controllers/common/noticePdfController");

const {

  protect,
  authorizeRoles

} = require(
  "../../middlewares/authMiddleware"
);

router.use(
  protect,
  authorizeRoles("STUDENT")
);

router.get(
  "/",
  getNotices
);

router.get(
  "/:id",
  getNotice
);

router.post(
  "/:id/read",
  markNoticeAsRead
);
router.get(
  "/:id/pdf",
  protect,
  authorizeRoles("STUDENT"),
  downloadNoticePdf
);

module.exports =
  router;