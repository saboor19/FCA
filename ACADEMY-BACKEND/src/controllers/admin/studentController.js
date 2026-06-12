const User = require("../../models/User");
const Student = require("../../models/Student");
const bcrypt = require("bcryptjs");



//-------------CREATE STUDENT --------------------
exports.createStudent = async(req,res) => {

  try {

    const {
      fullName,
      email,
      password,
      enrollmentNo,
      batch,
      guardianName,
      guardianPhone
    } = req.body;

    const existingUser =
      await User.findOne({email});

    if(existingUser){
      return res.status(400).json({
        message:"Email already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password,10);

    const user = await User.create({
      fullName,
      email,
      password:hashedPassword,
      role:"STUDENT"
    });

    const student =
      await Student.create({
        userId:user._id,
        enrollmentNo,
        batch,
        guardianName,
        guardianPhone
      });

    res.status(201).json({
      success:true,
      user,
      student
    });

  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};

//-------------GET ALL STUDENTS----------
exports.getStudents = async(req,res) => {

  try {

    const students =
      await Student.find()
      .populate(
        "userId",
        "fullName email isActive"
      );

    res.status(200).json({
      success:true,
      data:students
    });

  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};

//-----------SOFT DELETE ( STUDENT )---------
exports.deleteStudent = async(req,res) => {

  try {

    const student =
      await Student.findById(req.params.id);

    if(!student){
      return res.status(404).json({
        message:"Student not found"
      });
    }

    await User.findByIdAndUpdate(
      student.userId,
      {
        isActive:false
      }
    );

    res.status(200).json({
      success:true,
      message:"Student deactivated"
    });

  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};
//------------UPDATE STUDENT-------------
exports.updateStudent = async (req,res) => {

  try{

    const {
      name,
      email,
      phone,
      address,
      guardianName,
      guardianPhone,
      dateOfBirth
    } = req.body;

    const student =
    await Student.findById(req.params.id);

    if(!student){

      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }

    // UPDATE USER

    await User.findByIdAndUpdate(
      student.userId,
      {
        name,
        email
      },
      {
        new:true
      }
    );

    // UPDATE STUDENT PROFILE

    const updatedStudent =
    await Student.findByIdAndUpdate(
      req.params.id,
      {
        phone,
        address,
        guardianName,
        guardianPhone,
        dateOfBirth
      },
      {
        new:true,
        runValidators:true
      }
    ).populate(
      "userId",
      "name email"
    );

    res.status(200).json({
      success:true,
      data:updatedStudent
    });

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};

//------------GET SINGLE STUDENT-------------
exports.getStudent = async(req,res,next) => {

  try{

    const student =
      await Student.findById(req.params.id)

      .populate(
        "userId",
        "fullName email role"
      )

      .populate({
        path:"batches",

        populate:{
          path:"course",
          select:"title"
        }
      });

    if(!student){

      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }

    res.status(200).json({
      success:true,
      data:student
    });

  }catch(error){

    next(error);

  }

};

