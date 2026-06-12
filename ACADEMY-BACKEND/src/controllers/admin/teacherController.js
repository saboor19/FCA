const User = require("../../models/User");
const Teacher = require("../../models/Teacher");
const bcrypt = require("bcryptjs");


//-------------CREATE TEACHER --------------------
exports.createTeacher = async(req,res,next) => {

  try {

    const {
      fullName,
      email,
      password,
      employeeId,
      specialization,
      qualification,
      phone,
      address
    } = req.body;

    const existingUser =
      await User.findOne({email});

    if(existingUser){

      res.status(400);
      throw new Error("Email already exists");

    }

    const existingTeacher =
      await Teacher.findOne({employeeId});

    if(existingTeacher){

      res.status(400);
      throw new Error("Employee ID already exists");

    }

    const hashedPassword =
      await bcrypt.hash(password,10);

    const user = await User.create({
      fullName,
      email,
      password:hashedPassword,
      role:"TEACHER"
    });

    const teacher =
      await Teacher.create({
        userId:user._id,
        employeeId,
        specialization,
        qualification,
        phone,
        address
      });

    res.status(201).json({
      success:true,
      user,
      teacher
    });

  } catch(error){

    next(error);

  }
};


//-------------GET ALL TEACHERS----------
exports.getTeachers = async(req,res,next) => {

  try {

    const teachers =
      await Teacher.find()
      .populate(
        "userId",
        "fullName email isActive role"
      );
      // console.log(teachers)

    res.status(200).json({
      success:true,
      data:teachers
    });

  } catch(error){

    next(error);

  }

};


//------------GET SINGLE TEACHER-------------
exports.getTeacher = async(req,res,next) => {

  try{

    const teacher =
      await Teacher.findById(req.params.id)
      .populate(
        "userId",
        "fullName email role isActive"
      );

    if(!teacher){

      res.status(404);
      throw new Error("Teacher not found");

    }

    res.status(200).json({
      success:true,
      data:teacher
    });

  }catch(error){

    next(error);

  }

};


//------------UPDATE TEACHER-------------
exports.updateTeacher = async(req,res,next) => {

  try{

    const {
      fullName,
      email,
      specialization,
      qualification,
      phone,
      address
    } = req.body;

    const teacher =
      await Teacher.findById(req.params.id);

    if(!teacher){

      res.status(404);
      throw new Error("Teacher not found");

    }

    await User.findByIdAndUpdate(
      teacher.userId,
      {
        fullName,
        email
      }
    );

    const updatedTeacher =
      await Teacher.findByIdAndUpdate(
        req.params.id,
        {
          specialization,
          qualification,
          phone,
          address
        },
        {
          new:true,
          runValidators:true
        }
      ).populate(
        "userId",
        "fullName email role"
      );

    res.status(200).json({
      success:true,
      data:updatedTeacher
    });

  }catch(error){

    next(error);

  }

};


//-----------SOFT DELETE TEACHER---------
exports.deleteTeacher = async(req,res,next) => {

  try {

    const teacher =
      await Teacher.findById(req.params.id);

    if(!teacher){

      res.status(404);
      throw new Error("Teacher not found");

    }

    await User.findByIdAndUpdate(
      teacher.userId,
      {
        isActive:false
      }
    );

    res.status(200).json({
      success:true,
      message:"Teacher deactivated"
    });

  } catch(error){

    next(error);

  }

};