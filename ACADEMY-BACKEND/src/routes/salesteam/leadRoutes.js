const express = require("express");

const router = express.Router();


//---------MIDDLEWARES-----------
const {

    protect,

    authorizeRoles,

} = require("../../middlewares/authMiddleware");

const validate = require("../../middlewares/validateMiddleware");

//------------VALIDATIONS---------
const {
    createLeadActivitySchema,
    updateLeadActivitySchema
} = require("../../validations/sales/leadValidation");


const {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    createLeadActivity,
    getLeadActivities,
    getLeadActivity,
    updateLeadActivity,
    deleteLeadActivity,
    deleteLead,
    convertLead
} = require("../../controllers/sales/leadController");

// ======================================================
// LEADS
// ======================================================

router.post(
    "/",
    protect,
    authorizeRoles("SALES_TEAM"),
    createLead
);

router.get(
    "/",
    protect,
    authorizeRoles("SALES_TEAM"),
    getLeads
);

router.get(
    "/:id",
    protect,
    authorizeRoles("SALES_TEAM"),
    getLeadById
);

router.put(
    "/:id",
    protect,
    authorizeRoles("SALES_TEAM"),
    updateLead
);

// router.delete(
//     "/:id",
//     protect,
//     authorizeRoles("SALES_TEAM"),
//     deleteLead
// );

router.put(
    "/:id/convert",
    protect,
    authorizeRoles("SALES_TEAM"),
    convertLead
);

//----------CREATE AN ACTIVITY FOR LEAD ----------
router.post(
    "/:id/activities",
    protect, authorizeRoles("SALES_TEAM", "ADMIN"),
    validate(createLeadActivitySchema),
    createLeadActivity);

//---------GET ALL ACTIVITIES OF LEAD ----------
router.get("/:id/activities",
    protect, authorizeRoles("SALES_TEAM", "ADMIN"),
    getLeadActivities

);


router.get(
    "/activities/:activityId",
    protect,
    authorizeRoles("SALES_TEAM", "ADMIN"),
    getLeadActivity

);



router.put(
    "/activities/:activityId",
    protect,
    authorizeRoles("SALES_TEAM", "ADMIN"),
    validate(updateLeadActivitySchema),
    updateLeadActivity

);


router.delete(

    "/activities/:activityId",

    protect,

    authorizeRoles(

        "SALES_TEAM",

        "ADMIN"

    ),

    deleteLeadActivity

);

module.exports = router;