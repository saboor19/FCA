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

module.exports =
  router;