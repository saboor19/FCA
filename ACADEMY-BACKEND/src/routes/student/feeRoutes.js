const express =
require("express");

const router =
express.Router();

const {

  getMyFees,
  getMyFee

} = require(
  "../../controllers/student/feeController"
);

const {

  protect,
  authorizeRoles

} = require(
  "../../middlewares/authMiddleware"
);

router.use(
  protect
);

router.use(
  authorizeRoles("STUDENT")
);

router.get(
  "/",
  getMyFees
);

router.get(
  "/:id",
  getMyFee
);

module.exports =
router;