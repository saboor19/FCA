const express = require("express");


//-------------controller imports----------
const { getAllCourses } = require("../controllers/courseController");

const router = express.Router();



//---------------------------------ALL COURSE FETCH
router.get("/", getAllCourses);



module.exports = router;