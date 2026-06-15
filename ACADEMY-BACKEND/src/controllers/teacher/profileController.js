const Teacher = require("../../models/Teacher");



// GET MY PROFILE
exports.getMyProfile = async(req,res) => {

  try{

    const teacher =
      await Teacher.findOne({
        userId:req.user._id
      })
      .populate(
        "userId",
        "fullName email role"
      );

    if(!teacher){

      return res.status(404).json({
        success:false,
        message:"Teacher profile not found"
      });

    }

    return res.status(200).json({
      success:true,
      teacher
    });

  }
  catch(error){

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }

};





// UPDATE MY PROFILE
exports.updateMyProfile = async(req,res) => {

  try{

    const {
      specialization,
      qualification,
      phone,
      address,
      gender,
      bio,
      experience
    } = req.body;

    const teacher =
      await Teacher.findOne({
        userId:req.user._id
      });

    if(!teacher){

      return res.status(404).json({
        success:false,
        message:"Teacher profile not found"
      });

    }



    // UPDATE FIELDS
    teacher.specialization =
      specialization ||
      teacher.specialization;

    teacher.qualification =
      qualification ||
      teacher.qualification;

    teacher.phone =
      phone ||
      teacher.phone;

    teacher.address =
      address ||
      teacher.address;

    teacher.gender =
      gender ||
      teacher.gender;

    teacher.bio =
      bio ||
      teacher.bio;

    teacher.experience =
      experience ??
      teacher.experience;



    await teacher.save();



    const updatedTeacher =
      await Teacher.findById(
        teacher._id
      ).populate(
        "userId",
        "fullName email role"
      );



    return res.status(200).json({
      success:true,
      message:
        "Profile updated successfully",
      teacher:updatedTeacher
    });

  }
  catch(error){

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }

};