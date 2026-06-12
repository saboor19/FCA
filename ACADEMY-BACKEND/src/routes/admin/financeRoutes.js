const express = require("express");

const router = express.Router();

const {

  getFinanceOverview

} = require(
  "../../controllers/admin/financeController"
);

const {

  protect,
  authorizeRoles

} = require(
  "../../middlewares/authMiddleware"
);

// ---------------------------------------------------
// FINANCE OVERVIEW
// GET /api/admin/finance/overview
//
// Optional query params:
//   batchId      — filter by batch ObjectId
//   status       — PENDING | PARTIAL | PAID | OVERDUE
//   paymentType  — FULL | EMI
//   month        — 1-12
//   year         — e.g. 2025  (defaults to current year)
// ---------------------------------------------------

router.get(
  "/overview",
  protect,
  authorizeRoles("ADMIN"),
  getFinanceOverview
);

module.exports = router;