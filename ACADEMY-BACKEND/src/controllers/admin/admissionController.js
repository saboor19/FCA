const bcrypt = require("bcryptjs");

const EnrollmentRequest =
require("../../models/EnrollmentRequest");

const User =
require("../../models/User");

const Student =
require("../../models/Student");

const Batch =
require("../../models/Batch");

const Enrollment =
require("../../models/Enrollment");


const {
  generateEnrollmentNumber
} = require(
  "../../utils/generateEnrollmentNumber"
);

//----------------GET ALL ADMISSION REQUESTS----------------
exports.getEnrollmentRequests =
async(req,res,next) => {

  try{

    const filter = {};

    if(req.query.status){

      filter.status =
        req.query.status;

    }

    console.log(" request controller hit ")

    const requests =
      await EnrollmentRequest
      .find(filter)

      .populate(
        "preferredCourse",
        "title"
      )

      .populate(
        "reviewedBy",
        "fullName"
      )

      .sort({
        createdAt:-1
      });

    res.status(200).json({

      success:true,

      count:requests.length,

      data:requests

    });

  }catch(error){

    next(error);

  }

}; 
//----------------GET SINGLE ADMISSION REQUEST----------------
exports.getEnrollmentRequest =
async(req,res,next) => {

  try{

    const request =
      await EnrollmentRequest
      .findById(
        req.params.id
      )

      .populate(
        "preferredCourse",
        "title description"
      )

      .populate(
        "reviewedBy",
        "fullName"
      );

    if(!request){

      return res.status(404).json({

        success:false,

        message:
          "Admission request not found"

      });

    }

    res.status(200).json({

      success:true,

      data:request

    });

  }catch(error){

    next(error);

  }

};

//----------------APPROVE ADMISSION REQUEST----------------
exports.approveEnrollmentRequest =
async(req,res,next) => {

try{


const { batchId } =
  req.body;

if(!batchId){

  return res.status(400).json({

    success:false,

    message:
      "Batch is required"

  });

}

const request =
  await EnrollmentRequest.findById(
    req.params.id
  );

if(!request){

  return res.status(404).json({

    success:false,

    message:
      "Admission request not found"

  });

}

if(request.status !== "PENDING"){

  return res.status(400).json({

    success:false,

    message:
      "Request already processed"

  });

}

const batch =
  await Batch.findById(
    batchId
  );

if(!batch){

  return res.status(404).json({

    success:false,

    message:
      "Batch not found"

  });

}

// VERIFY COURSE MATCH

if(

  request.preferredCourse &&

  request.preferredCourse.toString() !==
  batch.course.toString()

){

  return res.status(400).json({

    success:false,

    message:
      "Selected batch does not belong to requested course"

  });

}

const existingUser =
  await User.findOne({

    email:request.email

  });

if(existingUser){

  return res.status(400).json({

    success:false,

    message:
      "User already exists"

  });

}

// GENERATE TEMP PASSWORD

const tempPassword =
  Math.random()
  .toString(36)
  .slice(-8);

const hashedPassword =
  await bcrypt.hash(
    tempPassword,
    10
  );

// GENERATE ENROLLMENT NUMBER

const enrollmentNo =
  await generateEnrollmentNumber();

// CREATE USER

const user =
  await User.create({

    fullName:
      request.fullName,

    email:
      request.email,

    password:
      hashedPassword,

    phone:
      request.phone,

    role:"STUDENT"

  });

// CREATE STUDENT

const student =
  await Student.create({

    userId:
      user._id,

    enrollmentNo,

    phone:
      request.phone,

    address:
      request.address,

    dateOfBirth:
      request.dateOfBirth,

    guardianName:
      request.guardianName,

    guardianPhone:
      request.guardianPhone

  });

// CREATE ENROLLMENT

await Enrollment.create({

  student:
    student._id,

  batch:
    batchId,

  status:"ACTIVE"

});

// ADD STUDENT TO BATCH

await Batch.findByIdAndUpdate(

  batchId,

  {
    $addToSet:{
      students:
        student._id
    }
  }

);

// UPDATE REQUEST

request.status =
  "APPROVED";

request.reviewedBy =
  req.user._id;

request.reviewNotes =
  "Approved";

await request.save();

res.status(200).json({

  success:true,

  message:
    "Admission approved successfully",

  temporaryPassword:
    tempPassword,

  enrollmentNo,

  student

});

}catch(error){
  next(error);
}};


//----------------REJECT ADMISSION REQUEST----------------
exports.rejectEnrollmentRequest =
async(req,res,next) => {

  try{

    const {
      reason
    } = req.body;

    const request =
      await EnrollmentRequest.findById(
        req.params.id
      );

    if(!request){

      return res.status(404).json({

        success:false,

        message:
          "Admission request not found"

      });

    }

    if(request.status !== "PENDING"){

      return res.status(400).json({

        success:false,

        message:
          "Request already processed"

      });

    }

    request.status =
      "REJECTED";

    request.reviewNotes =
      reason || "";

    request.reviewedBy =
      req.user._id;

    await request.save();

    res.status(200).json({

      success:true,

      message:
        "Admission request rejected"

    });

  }catch(error){

    next(error);

  }

};