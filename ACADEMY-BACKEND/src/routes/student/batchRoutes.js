const express = require("express");

const router = express.Router();

const {
  getMyBatches,
  getMyBatchDetails
} = require("../../controllers/student/batchController");

const {

  protect,
  authorizeRoles

} = require(
  "../../middlewares/authMiddleware"
);




router.get(
  "/",
  protect,
  authorizeRoles("STUDENT"),
  getMyBatches
);

router.get(
  "/:batchId",
  protect,
  authorizeRoles("STUDENT"),
  getMyBatchDetails
);

module.exports = router;