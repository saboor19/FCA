const Student = require("../../models/Student");
const Enrollment = require("../../models/Enrollment");
const StudentAttendance = require("../../models/StudentAttendance");
const LeaveRequest = require("../../models/LeaveRequest");
const AttendanceSession = require("../../models/AttendanceSession");
const AttendanceLog = require("../../models/AttendanceLog");
const Batch = require("../../models/Batch");
const calculateDistance = require("../../utils/calculateDistance");

exports.submitLeaveRequest =
async(req,res) => {

  try{

    const {
      fromDate,
      toDate,
      reason
    } = req.body;

    const student =
      await Student.findOne({
        userId:req.user._id
      });

    if(!student){

      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }

    const enrollment =
      await Enrollment.findOne({
        student:student._id,
        status:"ACTIVE"
      });

    if(!enrollment){

      return res.status(404).json({
        success:false,
        message:"No active enrollment found"
      });

    }

    const leave =
      await LeaveRequest.create({

        student:student._id,

        batch:enrollment.batch,

        fromDate,

        toDate,

        reason

      });

    return res.status(201).json({

      success:true,

      message:"Leave request submitted",

      leave

    });

  }

  catch(error){

    console.error(error);

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }

};



exports.getMyLeaveRequests =
async(req,res) => {

  try{

    const student =
      await Student.findOne({
        userId:req.user._id
      });

    const requests =
      await LeaveRequest.find({
        student:student._id
      })
      .sort({
        createdAt:-1
      });

    return res.status(200).json({

      success:true,

      requests

    });

  }

  catch(error){

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

exports.getMyAttendance =
async(req,res) => {

  try{

    const student =
      await Student.findOne({
        userId:req.user._id
      });

    const enrollments =
      await Enrollment.find({
        student:student._id
      });

    const enrollmentIds =
      enrollments.map(
        item => item._id
      );

    const attendance =
      await StudentAttendance.find({

        enrollment:{
          $in:enrollmentIds
        }

      })
      .sort({
        date:-1
      });

    return res.status(200).json({

      success:true,

      attendance

    });

  }

  catch(error){

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }

};


exports.getAttendanceStats =
async(req,res) => {

  try{

    const student =
      await Student.findOne({
        userId:req.user._id
      });

    const enrollments =
      await Enrollment.find({
        student:student._id
      });

    const enrollmentIds =
      enrollments.map(
        item => item._id
      );

    const attendance =
      await StudentAttendance.find({

        enrollment:{
          $in:enrollmentIds
        }

      });

    const total =
      attendance.length;

    const present =
      attendance.filter(
        item => item.status === "PRESENT"
      ).length;

    const absent =
      attendance.filter(
        item => item.status === "ABSENT"
      ).length;

    const leave =
      attendance.filter(
        item => item.status === "LEAVE"
      ).length;

    const late =
      attendance.filter(
        item => item.status === "LATE"
      ).length;

    const percentage =
      total === 0
      ? 0
      : Number(
          (
            (present + late) /
            total
          * 100
          ).toFixed(2)
        );

        console.log("sending stats: ",         total,
        present,
        absent,
        leave,
        late,
        percentage);

    return res.status(200).json({

      success:true,

      stats:{
        total,
        present,
        absent,
        leave,
        late,
        percentage
      }

    });

  }

  catch(error){

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }

};


exports.markOfflineAttendance =
async(req,res) => {

  try{

    const {
      latitude,
      longitude
    } = req.body;

    console.log("Provided coordiates: ", latitude,longitude)

    const student =
      await Student.findOne({
        userId:req.user._id
      });

    if(!student){

      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }

    const enrollment =
      await Enrollment.findOne({
        student:student._id,
        status:"ACTIVE"
      })
      .populate("batch");

    if(!enrollment){

      return res.status(404).json({
        success:false,
        message:"Enrollment not found"
      });

    }

    const batch =
      enrollment.batch;

    if(
      batch.studyMode !== "OFFLINE" &&
      batch.studyMode !== "HYBRID"
    ){

      return res.status(400).json({
        success:false,
        message:"Batch is not offline enabled"
      });

    }

    if(
      !batch.attendanceConfig?.latitude ||
      !batch.attendanceConfig?.longitude
    ){

      return res.status(400).json({
        success:false,
        message:"Attendance location not configured"
      });

    }

    const distance =
      calculateDistance(

        latitude,
        longitude,

        batch.attendanceConfig.latitude,
        batch.attendanceConfig.longitude

      );

      console.log( "distance is : ", distance);
      console.log( "batch attendance config is  : ", batch.attendanceConfig.latitude,
        batch.attendanceConfig.longitude);
      

    if(
      distance >
      batch.attendanceConfig.radius
    ){

      return res.status(400).json({
        success:false,
        message:"Outside attendance zone"
      });

    }

    const today =
      new Date();

    today.setHours(
      0,0,0,0
    );

const existing =
  await StudentAttendance.findOne({

    enrollment:
    enrollment._id,

    date:{
      $gte:today,
      $lt:new Date(
        today.getTime() +
        24*60*60*1000
      )
    }

  });
    if(existing){

      return res.status(400).json({
        success:false,
        message:"Attendance already marked"
      });

    }

    const attendance =
      await StudentAttendance.create({

        enrollment:enrollment._id,

        markedBy:req.user._id,

        date:new Date(),

        status:"PRESENT"

      });

    await AttendanceLog.create({

      student:student._id,

      latitude,

      longitude,

      markedAt:new Date()

    });

    return res.status(201).json({

      success:true,

      message:"Attendance marked",

      attendance

    });

  }

  catch(error){

    console.error(error);

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

exports.getActiveAttendanceSession =
async(req,res) => {

  try{

    const {
      batchId
    } = req.params;

    const session =
      await AttendanceSession.findOne({

        batch:batchId,

        isActive:true,

        expiresAt:{
          $gt:new Date()
        }

      })
      .sort({
        createdAt:-1
      });

    return res.status(200).json({

      success:true,

      session

    });

  }

  catch(error){

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

exports.markOnlineAttendance =
async(req,res) => {

  try{

    const {code} = req.body;

    const student =
      await Student.findOne({
        userId:req.user._id
      });

    if(!student){

      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }

    const enrollment =
      await Enrollment.findOne({
        student:student._id,
        status:"ACTIVE"
      })
      .populate("batch");

    if(!enrollment){

      return res.status(404).json({
        success:false,
        message:"Active enrollment not found"
      });

    }

    const session =
      await AttendanceSession.findOne({

        batch:enrollment.batch._id,

        isActive:true,

        expiresAt:{
          $gt:new Date()
        }

      });

    if(!session){

      return res.status(404).json({
        success:false,
        message:"No active attendance session found"
      });

    }

    if(session.attendanceCode !== code){

      return res.status(400).json({
        success:false,
        message:"Invalid attendance code"
      });

    }

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const existing =
      await StudentAttendance.findOne({

        enrollment:enrollment._id,

        date:{
          $gte:today
        }

      });

    if(existing){

      return res.status(400).json({
        success:false,
        message:"Attendance already marked"
      });

    }

    const attendance =
      await StudentAttendance.create({

        enrollment:enrollment._id,

        markedBy:req.user._id,

        date:new Date(),

        status:"PRESENT"

      });

    await AttendanceLog.create({

      session:session._id,

      student:student._id

    });

    return res.status(201).json({

      success:true,

      message:"Attendance marked successfully",

      attendance

    });

  }

  catch(error){

    console.error(error);

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

exports.getAttendanceOverview =
async(req,res) => {

  try{

    const student =
      await Student.findOne({
        userId:req.user._id
      });

    if(!student){

      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }

    const enrollments =
      await Enrollment.find({
        student:student._id
      });

    const enrollmentIds =
      enrollments.map(
        enrollment => enrollment._id
      );

    const attendance =
      await StudentAttendance.find({

        enrollment:{
          $in:enrollmentIds
        }

      });

    const total =
      attendance.length;

    const present =
      attendance.filter(
        item => item.status === "PRESENT"
      ).length;

    const absent =
      attendance.filter(
        item => item.status === "ABSENT"
      ).length;

    const leave =
      attendance.filter(
        item => item.status === "LEAVE"
      ).length;

    const late =
      attendance.filter(
        item => item.status === "LATE"
      ).length;

    const percentage =
      total === 0
      ? 0
      : Number(
          (
            (
              present + late
            ) /
            total *
            100
          ).toFixed(2)
        );

    const pendingLeaves =
      await LeaveRequest.countDocuments({

        student:student._id,

        $or:[
          {
            teacherStatus:"PENDING"
          },
          {
            adminStatus:"PENDING"
          }
        ]

      });

    const approvedLeaves =
      await LeaveRequest.countDocuments({

        student:student._id,

        teacherStatus:"APPROVED",

        adminStatus:"APPROVED"

      });

    const rejectedLeaves =
      await LeaveRequest.countDocuments({

        student:student._id,

        $or:[
          {
            teacherStatus:"REJECTED"
          },
          {
            adminStatus:"REJECTED"
          }
        ]

      });

    return res.status(200).json({

      success:true,

      overview:{

        attendance:{

          total,

          present,

          absent,

          leave,

          late,

          percentage

        },

        leaveRequests:{

          pending:pendingLeaves,

          approved:approvedLeaves,

          rejected:rejectedLeaves

        }

      }

    });

  }

  catch(error){

    console.error(error);

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

exports.getCurrentBatch =
async(req,res) => {

  try{

    const student =
      await Student.findOne({
        userId:req.user._id
      });

    if(!student){

      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }

    const enrollment =
      await Enrollment.findOne({
        student:student._id,
        status:"ACTIVE"
      })
      .populate({
        path:"batch",
        select:
        "name studyMode course"
      });

    if(!enrollment){

      return res.status(404).json({
        success:false,
        message:"No active enrollment found"
      });

    }

    return res.status(200).json({

      success:true,

      batch:
      enrollment.batch

    });

  }

  catch(error){

    console.error(error);

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};