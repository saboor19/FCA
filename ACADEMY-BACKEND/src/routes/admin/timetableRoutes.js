const express = require("express");

const router = express.Router();

const {

  protect,
  authorizeRoles

} = require(
  "../../middlewares/authMiddleware"
);

const {

  createTimetable,
  getTimetables,
  getTimetable,
  updateTimetable,
  deleteTimetable,
  createBulkTimetable

} = require(
  "../../controllers/admin/timetableController"
);


router.use(
  protect,
  authorizeRoles("ADMIN")
);


// CREATE

router.post(
  "/",
  createTimetable
);

// BULK CREATE

router.post(
  "/bulk",
  createBulkTimetable
);

// GET ALL

router.get(
  "/",
  getTimetables
);


// GET SINGLE

router.get(
  "/:id",
  getTimetable
);


// UPDATE

router.put(
  "/:id",
  updateTimetable
);


// DELETE

router.delete(
  "/:id",
  deleteTimetable
);


module.exports = router;