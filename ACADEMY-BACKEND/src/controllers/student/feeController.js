const Student = require("../../models/Student");
const StudentFee = require("../../models/StudentFee");
const User =require("../../models/User")
// ----------------------------------------------------
// GET ALL FEES OF LOGGED IN STUDENT
// ----------------------------------------------------

exports.getMyFees =
async(req,res,next)=>{

try{

  const student =
  await Student.findOne({
    userId:req.user.id
  });
  console.log("fee request from user",req.user.id);

  if(!student){

    return res.status(404).json({
      success:false,
      message:"Student profile not found"
    });

  }

  const fees =
  await StudentFee.find({
    student:student._id
  })

  .populate(
    "course",
    "title"
  )

  .populate(
    "batch",
    "name batchCode"
  )

  .sort({
    createdAt:-1
  });

  res.status(200).json({

    success:true,

    count:fees.length,

    fees

  });

}catch(error){

  next(error);

}

};

// ----------------------------------------------------
// GET SINGLE FEE DETAILS
// ----------------------------------------------------

exports.getMyFee =
async(req,res,next)=>{

try{

  const student =
  await Student.findOne({
    user:req.user.id
  });

  if(!student){

    return res.status(404).json({
      success:false,
      message:"Student profile not found"
    });

  }

  const fee =
  await StudentFee.findOne({

    _id:req.params.id,

    student:student._id

  })

  .populate(
    "course",
    "title description"
  )

  .populate(
    "batch",
    "name batchCode"
  );

  if(!fee){

    return res.status(404).json({

      success:false,

      message:"Fee record not found"

    });

  }

  res.status(200).json({

    success:true,

    fee

  });

}catch(error){

  next(error);

}

};