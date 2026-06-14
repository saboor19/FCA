const StudentAttendance =
require("../../models/StudentAttendance");

const Enrollment =
require("../../models/Enrollment");

const Teacher =
require("../../models/Teacher");

const Timetable =
require("../../models/Timetable");

const VALID_STATUSES = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "LEAVE"
];

// ---------------- NORMALIZE DATE ----------------

const normalizeDate = (date) => {

  const normalizedDate =
    date
      ? new Date(date)
      : new Date();

  if(
    Number.isNaN(
      normalizedDate.getTime()
    )
  ){
    return null;
  }

  normalizedDate.setHours(0,0,0,0);

  return normalizedDate;

};

// ---------------- GET STATS ----------------

const getStats = (items) => {

  return items.reduce(
    (stats,item) => {

      const status =
        item.status || "NOT_MARKED";

      stats[status] =
        (stats[status] || 0) + 1;

      return stats;

    },
    {
      PRESENT:0,
      ABSENT:0,
      LATE:0,
      LEAVE:0,
      NOT_MARKED:0
    }
  );

};

// ---------------- VALIDATE ATTENDANCE ----------------

const hasInvalidAttendanceItems =
(attendance) => {

  return (
    !Array.isArray(attendance) ||

    attendance.length === 0 ||

    attendance.some(
      (item) => (
        !item.enrollmentId ||
        !VALID_STATUSES.includes(
          item.status
        )
      )
    )
  );

};

// ---------------- VALIDATE TEACHER ACCESS ----------------

const validateTeacherBatchAccess =
async(userId,batchId) => {

  const teacher =
    await Teacher.findOne({
      userId
    });

  if(!teacher){
    return false;
  }

  const timetable =
    await Timetable.findOne({
      batch:batchId,
      teacher:teacher._id,
      isActive:true
    });

  return !!timetable;

};

// =======================================================
// GET BATCH ATTENDANCE
// =======================================================

exports.getBatchAttendance =
async(req,res) => {

  try{

    const { batchId } =
      req.params;

    const { date } =
      req.query;

    const hasAccess =
      await validateTeacherBatchAccess(
        req.user._id,
        batchId
      );

    if(!hasAccess){

      return res.status(403).json({
        success:false,
        message:"Access denied"
      });

    }

    const normalizedDate =
      normalizeDate(date);

    if(!normalizedDate){

      return res.status(400).json({
        success:false,
        message:"Invalid date"
      });

    }

    const enrollments =
      await Enrollment.find({
        batch:batchId,
        status:"ACTIVE"
      })

      .populate({
        path:"student",
        populate:{
          path:"userId",
          select:"fullName email"
        }
      })

      .lean();

    const attendanceRecords =
      await StudentAttendance.find({
        enrollment:{
          $in:enrollments.map(
            item => item._id
          )
        },
        date:normalizedDate
      })

      .lean();

    const formattedData =
      enrollments.map(
        (enrollment) => {

          const existingAttendance =
            attendanceRecords.find(
              attendance =>
                attendance.enrollment.toString()
                ===
                enrollment._id.toString()
            );

          return {

            attendanceId:
              existingAttendance?._id || null,

            enrollmentId:
              enrollment._id,

            studentId:
              enrollment.student?._id,

            fullName:
              enrollment.student?.userId?.fullName
              || "Unknown student",

            email:
              enrollment.student?.userId?.email
              || "",

            enrollmentNo:
              enrollment.student?.enrollmentNo
              || "",

            status:
              existingAttendance?.status
              || "NOT_MARKED",

            remarks:
              existingAttendance?.remarks
              || ""

          };

        }
      );

    res.status(200).json({
      success:true,
      stats:getStats(formattedData),
      data:formattedData
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

// =======================================================
// MARK ATTENDANCE
// =======================================================

exports.markStudentAttendance =
async(req,res) => {

  try{

    const {
      batchId,
      date,
      attendance
    } = req.body;

    const hasAccess =
      await validateTeacherBatchAccess(
        req.user._id,
        batchId
      );

    if(!hasAccess){

      return res.status(403).json({
        success:false,
        message:"Access denied"
      });

    }

    if(!batchId || !date){

      return res.status(400).json({
        success:false,
        message:"Missing required fields"
      });

    }

    if(
      hasInvalidAttendanceItems(
        attendance
      )
    ){

      return res.status(400).json({
        success:false,
        message:"Invalid attendance data"
      });

    }

    const normalizedDate =
      normalizeDate(date);

    if(!normalizedDate){

      return res.status(400).json({
        success:false,
        message:"Invalid date"
      });

    }

    const enrollmentIds =
      attendance.map(
        item => item.enrollmentId
      );

    const enrollments =
      await Enrollment.find({
        _id:{
          $in:enrollmentIds
        },
        batch:batchId,
        status:"ACTIVE"
      });

    if(
      enrollments.length
      !==
      enrollmentIds.length
    ){

      return res.status(400).json({
        success:false,
        message:"Invalid enrollments"
      });

    }

    await StudentAttendance.bulkWrite(

      attendance.map((item) => ({
        updateOne:{
          filter:{
            enrollment:item.enrollmentId,
            date:normalizedDate
          },

          update:{
            $set:{
              enrollment:item.enrollmentId,
              status:item.status,
              remarks:item.remarks || "",
              markedBy:req.user._id,
              date:normalizedDate
            }
          },

          upsert:true
        }
      }))

    );

    res.status(200).json({
      success:true,
      message:"Attendance saved"
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};