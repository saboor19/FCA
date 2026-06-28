const express = require("express");

const router = express.Router();

const {
  protect,
  authorizeRoles
} = require("../../middlewares/authMiddleware");

const {
createSalesTeamMember
} = require("../../controllers/admin/salesteamController");

router.use(
  protect,
  authorizeRoles("ADMIN")
);


router.post("/", createSalesTeamMember);



module.exports = router;