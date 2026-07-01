const express = require("express");

const router = express.Router();

const {
  protect,
  authorizeRoles
} = require("../../middlewares/authMiddleware");

const {

  createSalesTeamMember,

  getSalesTeamMembers,

  getSalesTeamMember,

  updateSalesTeamMember,

  deleteSalesTeamMember,

  toggleSalesTeamStatus

} = require("../../controllers/admin/salesteamController");

// ======================================================
// MIDDLEWARE
// ======================================================

router.use(
  protect,
  authorizeRoles("ADMIN")
);

// ======================================================
// SALES TEAM
// ======================================================

router
  .route("/")
  .post(createSalesTeamMember)
  .get(getSalesTeamMembers);

router
  .route("/:id")
  .get(getSalesTeamMember)
  .put(updateSalesTeamMember)
  .delete(deleteSalesTeamMember);

router.patch(
  "/:id/toggle-status",
  toggleSalesTeamStatus
);

module.exports = router;