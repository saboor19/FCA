
const asyncHandler = require("../utils/asyncHandler");
const Course = require("../models/Course");

// ---------------CREATE COURSE------------------
exports.createCourse = asyncHandler(async (req, res) => {

  const {
    title,
    description,
    duration,
    level,
    price
  } = req.body;


  const course = await Course.create({
    title,
    description,
    duration,
    level,
    price
  });


res.status(200).json({
  success: true,
  count: courses.length,
  data: courses
});

});

//----------UPDATE COURSE --------------------
exports.updateCourse = asyncHandler(async (req, res) => {

  const course = await Course.findById(req.params.id);

  if (!course) {

    res.status(404);

    throw new Error("Course not found");

  }


  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

res.status(200).json({
  success: true,
  message: "Course updated successfully",
  data: updatedCourse
});

});

// -------------------GET ALL COURSES-------------
exports.getAllCourses = asyncHandler(async (req, res) => {

  const courses = await Course.find();

res.status(200).json({
  success: true,
  count: courses.length,
  data: courses
});

});
//-------------- GET SINGLE COURSE --------------
exports.getSingleCourse = asyncHandler(async (req, res) => {

  const course = await Course.findById(req.params.id);

  // Check Course Exists
  if (!course) {

    res.status(404);

    throw new Error("Course not found");

  }

  res.status(200).json({
  success: true,
  data: course
});

});

// -----------------DELETE COURSE -------------
exports.deleteCourse = asyncHandler(async (req, res) => {

  const course = await Course.findById(req.params.id);

  if (!course) {

    res.status(404);

    throw new Error("Course not found");

  }

  await course.deleteOne();

res.status(200).json({
  success: true,
  message: "Course deleted successfully"
});

});