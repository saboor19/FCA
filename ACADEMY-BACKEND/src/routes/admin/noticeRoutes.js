const express = require("express");

const router = express.Router();

const {

  protect,
  authorizeRoles

} = require(
  "../../middlewares/authMiddleware"
);

const {

  createNotice,
  getNotices,
  getNotice,
  updateNotice,
  deleteNotice,
  markNoticeAsRead

} = require(
  "../../controllers/admin/noticeController"
);


// ADMIN ONLY ROUTES

router.use(
  protect
);


// CREATE NOTICE

router.post(
  "/",
  authorizeRoles("ADMIN"),
  createNotice
);


// GET ALL NOTICES

router.get(
  "/",
  getNotices
);


// GET SINGLE NOTICE

router.get(
  "/:id",
  getNotice
);


// UPDATE NOTICE

router.put(
  "/:id",
  authorizeRoles("ADMIN"),
  updateNotice
);


// DELETE NOTICE

router.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  deleteNotice
);


// MARK AS READ

router.put(
  "/:id/read",
  markNoticeAsRead
);


module.exports = router;