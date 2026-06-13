
const asyncHandler = require("../utils/asyncHandler");
const Course = require("../models/Course");

// -------------------GET ALL COURSES-------------
exports.getAllCourses = asyncHandler(async (req, res) => {

  const courses = await Course.find();

res.status(200).json({
  success: true,
  count: courses.length,
  data: courses
});

});
