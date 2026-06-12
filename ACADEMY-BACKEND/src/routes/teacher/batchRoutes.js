const express = require("express");

const router = express.Router();

const {

  protect,
  authorizeRoles

} = require(
  "../../middlewares/authMiddleware"
);

const {

  getAssignedBatches,getBatchDetails

} = require(
  "../../controllers/teacher/batchController"
);


router.use(
  protect,
  authorizeRoles("TEACHER")
);



router.get(
  "/:id",
  getBatchDetails
);

// GET MY BATCHES

router.get(
  "/",
  getAssignedBatches
);


module.exports = router;