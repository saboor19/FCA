const express = require("express");

const router = express.Router();

const {
    protect,
    authorizeRoles
} = require("../../middlewares/authMiddleware");

const {
    getSalesTeam,
    getSalesTeamMember
} = require("../../controllers/sales/salesTeamController");

// ======================================================
// SALES TEAM
// ======================================================

router.get(
    "/",
    protect,
    authorizeRoles("SALES_TEAM", "ADMIN"),
    getSalesTeam
);

router.get(
    "/:id",
    protect,
    authorizeRoles("SALES_TEAM", "ADMIN"),
    getSalesTeamMember
);

module.exports = router;