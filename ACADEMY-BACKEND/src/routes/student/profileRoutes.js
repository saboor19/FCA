const express =
require("express");

const router =
express.Router();

const {

  getMyProfile,
  updateMyProfile

} = require(
  "../../controllers/student/profileController"
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

router.route("/")

.get(
  getMyProfile
)

.patch(
  updateMyProfile
);

module.exports =
router;