const StudentAttendance = require("../../models/StudentAttendance");
const TeacherAttendance = require("../../models/TeacherAttendance");
const Enrollment = require("../../models/Enrollment");
const Teacher = require("../../models/Teacher");

const VALID_STATUSES = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "LEAVE"
];

const normalizeDate = (date) => {
  const normalizedDate = date
    ? new Date(date)
    : new Date();

  if(Number.isNaN(normalizedDate.getTime())){
    return null;
  }

  normalizedDate.setHours(0,0,0,0);

  return normalizedDate;
};

const getStats = (items) => {
  return items.reduce(
    (stats,item) => {
      const status = item.status || "NOT_MARKED";

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

const hasInvalidAttendanceItems = (attendance,key) => {
    return !Array.isArray(attendance) ||
      attendance.length === 0 ||
      attendance.some((item) => (
        !item[key] ||
        !VALID_STATUSES.includes(item.status)
      ));
  };

//-------------MARK STUDENT ATTENDANCE-------------
exports.markStudentAttendance = async(req,res) => {
  try{
    const {
      batchId,
      date,
      attendance
    } = req.body;

    if(!batchId || !date){
      return res.status(400).json({
        success:false,
        message:"Missing required fields"
      });
    }

    if(
      hasInvalidAttendanceItems(
        attendance,
        "enrollmentId"
      )
    ){
      return res.status(400).json({
        success:false,
        message:"Attendance items are invalid"
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

    if(enrollments.length !== enrollmentIds.length){
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
      message:"Student attendance saved"
    });
  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
};

//-------------GET BATCH ATTENDANCE-------------
exports.getBatchAttendance = async(req,res) => {
  try{
    const { batchId } = req.params;
    const { date } = req.query;

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
          select:"fullName email isActive"
        }
      })
      .lean();

    const attendanceRecords =
      await StudentAttendance.find({
        enrollment:{
          $in:enrollments.map(
            enrollment => enrollment._id
          )
        },
        date:normalizedDate
      })
      .lean();

    const formattedData =
      enrollments.map((enrollment) => {
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
            enrollment.student?.userId?.fullName || "Unknown student",

          email:
            enrollment.student?.userId?.email || "",

          enrollmentNo:
            enrollment.student?.enrollmentNo || "",

          status:
            existingAttendance?.status || "NOT_MARKED",

          remarks:
            existingAttendance?.remarks || ""
        };
      });

    res.status(200).json({
      success:true,
      date:normalizedDate,
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

//-------------UPDATE STUDENT ATTENDANCE-------------
exports.updateStudentAttendance = async(req,res) => {
  try{
    const attendance =
      await StudentAttendance.findById(
        req.params.id
      );

    if(!attendance){
      return res.status(404).json({
        success:false,
        message:"Attendance not found"
      });
    }

    if(
      req.body.status &&
      !VALID_STATUSES.includes(req.body.status)
    ){
      return res.status(400).json({
        success:false,
        message:"Invalid status"
      });
    }

    attendance.status =
      req.body.status || attendance.status;

    attendance.remarks =
      req.body.remarks || attendance.remarks;

    attendance.markedBy =
      req.user._id;

    await attendance.save();

    res.status(200).json({
      success:true,
      data:attendance
    });
  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
};

//-------------MARK TEACHER ATTENDANCE-------------
exports.markTeacherAttendance = async(req,res) => {
  try{
    const {
      date,
      attendance
    } = req.body;

    if(!date){
      return res.status(400).json({
        success:false,
        message:"Missing required fields"
      });
    }

    if(
      hasInvalidAttendanceItems(
        attendance,
        "teacherId"
      )
    ){
      return res.status(400).json({
        success:false,
        message:"Attendance items are invalid"
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

    const teacherIds =
      attendance.map(
        item => item.teacherId
      );

    const teacherCount =
      await Teacher.countDocuments({
        _id:{
          $in:teacherIds
        }
      });

    if(teacherCount !== teacherIds.length){
      return res.status(400).json({
        success:false,
        message:"Invalid teachers"
      });
    }

    await TeacherAttendance.bulkWrite(
      attendance.map((item) => ({
        updateOne:{
          filter:{
            teacher:item.teacherId,
            date:normalizedDate
          },
          update:{
            $set:{
              teacher:item.teacherId,
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
      message:"Teacher attendance saved"
    });
  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
};

//-------------GET TEACHER ATTENDANCE-------------
exports.getTeacherAttendance = async(req,res) => {
  try{
    const { date } = req.query;

    const normalizedDate =
      normalizeDate(date);

    if(!normalizedDate){
      return res.status(400).json({
        success:false,
        message:"Invalid date"
      });
    }

    const teachers =
      await Teacher.find()
      .populate(
        "userId",
        "fullName email isActive"
      )
      .lean();

    const attendanceRecords =
      await TeacherAttendance.find({
        teacher:{
          $in:teachers.map(
            teacher => teacher._id
          )
        },
        date:normalizedDate
      })
      .lean();

    const formattedData =
      teachers.map((teacher) => {
        const existingAttendance =
          attendanceRecords.find(
            attendance =>
              attendance.teacher.toString()
              ===
              teacher._id.toString()
          );

        return {
          attendanceId:
            existingAttendance?._id || null,

          teacherId:
            teacher._id,

          fullName:
            teacher.userId?.fullName || "Unknown teacher",

          email:
            teacher.userId?.email || "",

          employeeId:
            teacher.employeeId,

          specialization:
            teacher.specialization || "",

          status:
            existingAttendance?.status || "NOT_MARKED",

          remarks:
            existingAttendance?.remarks || ""
        };
      });

    res.status(200).json({
      success:true,
      date:normalizedDate,
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

//-------------GET SINGLE STUDENT ATTENDANCE-------------
exports.getStudentAttendance = async(req,res) => {

  try{

    const { studentId } = req.params;

    const attendance =
      await StudentAttendance.find()

      .populate({
        path:"enrollment",
        match:{
          student:studentId
        },
        populate:[
          {
            path:"batch",
            select:"name"
          },
          {
            path:"student",
            select:"enrollmentNo"
          }
        ]
      })

      .sort({ date:-1 });

    const filteredAttendance =
      attendance.filter(
        item => item.enrollment
      );

    res.status(200).json({
      success:true,
      data:filteredAttendance
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};