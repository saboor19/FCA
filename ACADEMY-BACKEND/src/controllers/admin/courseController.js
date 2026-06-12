
const Course = require("../../models/Course");

// ---------------- CREATE COURSE ----------------

exports.createCourse = async(req,res,next) => {

  try{

const {
  title,
  description,
  duration,
  level,
  price,
  modules
} = req.body;

    const existingCourse =
      await Course.findOne({ title });

    if(existingCourse){

      res.status(400);
      throw new Error(
        "Course already exists"
      );

    }

const course =
  await Course.create({
    title,
    description,
    duration,
    level,
    price,
    modules
  });

    res.status(201).json({
      success:true,
      data:course
    });

  }catch(error){

    next(error);

  }

};

// ---------------- GET ALL COURSES ----------------

exports.getCourses = async(req,res,next) => {

  try{

    const courses =
      await Course.find()
      .sort({ createdAt:-1 });

    res.status(200).json({
      success:true,
      count:courses.length,
      data:courses
    });

  }catch(error){

    next(error);

  }

};

// ---------------- GET SINGLE COURSE ----------------

exports.getCourse = async(req,res,next) => {

  try{

    const course =
      await Course.findById(req.params.id);

    if(!course){

      res.status(404);
      throw new Error(
        "Course not found"
      );

    }

    res.status(200).json({
      success:true,
      data:course
    });

  }catch(error){

    next(error);

  }

};

// ---------------- UPDATE COURSE ----------------

exports.updateCourse = async(req,res,next) => {

  try{

    const course =
      await Course.findById(
        req.params.id
      );

    if(!course){

      res.status(404);

      throw new Error(
        "Course not found"
      );

    }

    // ---------------- CLEAN MODULES ----------------

    let cleanedModules = [];

    if(
      Array.isArray(req.body.modules)
    ){

      cleanedModules =
        req.body.modules
        .filter(
          (module) =>
            module.title &&
            module.title.trim() !== ""
        )
        .map((module,index) => ({
          ...module,

          order:index + 1
        }));

    }

    // ---------------- UPDATE PAYLOAD ----------------

    const updatePayload = {

      title:req.body.title,

      description:
        req.body.description,

      duration:
        req.body.duration,

      level:
        req.body.level,

      price:
        req.body.price,

      modules:
        cleanedModules

    };

    const updatedCourse =
      await Course.findByIdAndUpdate(

        req.params.id,

        updatePayload,

        {
          new:true,
          runValidators:true
        }

      );

    res.status(200).json({

      success:true,

      message:
        "Course updated successfully",

      data:updatedCourse

    });

  }catch(error){

    next(error);

  }

};

// ---------------- DELETE COURSE ----------------

exports.deleteCourse = async(req,res,next) => {

  try{

    const course =
      await Course.findById(req.params.id);

    if(!course){

      res.status(404);
      throw new Error(
        "Course not found"
      );

    }

    await course.deleteOne();

    res.status(200).json({
      success:true,
      message:"Course deleted successfully"
    });

  }catch(error){

    next(error);

  }

};
