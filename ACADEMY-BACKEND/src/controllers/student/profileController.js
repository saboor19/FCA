const User = require("../../models/User");
const Student = require("../../models/Student");

// ----------------------------------------------------
// GET MY PROFILE
// ----------------------------------------------------

exports.getMyProfile =
async(req,res,next)=>{

try{

  const user =
  await User.findById(
    req.user.id
  )
  .select("-password");

  if(!user){

    return res.status(404).json({

      success:false,

      message:"User not found"

    });

  }

  const student =
  await Student.findOne({

    userId:req.user.id

  })

  .populate(
    "batches",
    "name batchCode"
  );

  if(!student){

    return res.status(404).json({

      success:false,

      message:"Student profile not found"

    });

  }

  res.status(200).json({

    success:true,

    profile:{

      _id:user._id,

      fullName:user.fullName,

      email:user.email,

      role:user.role,

      isActive:user.isActive,

      enrollmentNo:
      student.enrollmentNo,

      phone:
      student.phone ||
      user.phone,

      address:
      student.address,

      profileImage:
      student.profileImage ||
      user.profileImage,

      guardianName:
      student.guardianName,

      guardianPhone:
      student.guardianPhone,

      dateOfBirth:
      student.dateOfBirth,

      admissionDate:
      student.admissionDate,

      batches:
      student.batches,

      createdAt:
      user.createdAt

    }

  });

}catch(error){

  next(error);

}

};

// ----------------------------------------------------
// UPDATE MY PROFILE
// ----------------------------------------------------

exports.updateMyProfile =
async(req,res,next)=>{

try{

  const {

    phone,
    address,
    profileImage

  } = req.body;

  const student =
  await Student.findOne({

    userId:req.user.id

  });

  if(!student){

    return res.status(404).json({

      success:false,

      message:"Student profile not found"

    });

  }

  await User.findByIdAndUpdate(

    req.user.id,

    {

      ...(phone && {phone}),
      ...(profileImage && {profileImage})

    },

    {
      new:true
    }

  );

  const updatedStudent =
  await Student.findOneAndUpdate(

    {
      userId:req.user.id
    },

    {

      ...(phone && {phone}),
      ...(address && {address}),
      ...(profileImage && {profileImage})

    },

    {
      new:true
    }

  );

  res.status(200).json({

    success:true,

    message:"Profile updated successfully",

    student:updatedStudent

  });

}catch(error){

  next(error);

}

};