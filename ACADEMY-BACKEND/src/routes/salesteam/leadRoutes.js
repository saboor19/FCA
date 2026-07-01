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
    updateLeadActivitySchema,
    createLeadTaskSchema,
    updateLeadTaskSchema
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
    convertLead,
        // TASKS
    createLeadTask,
    getLeadTasks,
    getLeadTask,
    updateLeadTask,
    deleteLeadTask
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
    // validate(createLeadActivitySchema),
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


// ======================================================
// LEAD TASKS
// ======================================================

// Create Task
router.post(
    "/:id/tasks",
    protect,
    authorizeRoles("SALES_TEAM", "ADMIN"),
    validate(createLeadTaskSchema),
    createLeadTask
);

// Get All Tasks of Lead
router.get(
    "/:id/tasks",
    protect,
    authorizeRoles("SALES_TEAM", "ADMIN"),
    getLeadTasks
);

// Get Single Task
router.get(
    "/tasks/:taskId",
    protect,
    authorizeRoles("SALES_TEAM", "ADMIN"),
    getLeadTask
);

// Update Task
router.put(
    "/tasks/:taskId",
    protect,
    authorizeRoles("SALES_TEAM", "ADMIN"),
    validate(updateLeadTaskSchema),
    updateLeadTask
);

// Delete Task
router.delete(
    "/tasks/:taskId",
    protect,
    authorizeRoles("SALES_TEAM", "ADMIN"),
    deleteLeadTask
);

module.exports = router;