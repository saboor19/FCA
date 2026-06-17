const StudentAttendance =
require("../models/StudentAttendance");

const Enrollment =
require("../models/Enrollment");

const processApprovedLeave =
async(leaveRequest) => {

  const enrollment =
    await Enrollment.findOne({

      student:leaveRequest.student,

      batch:leaveRequest.batch,

      status:"ACTIVE"

    });

  if(!enrollment){
    return;
  }

  const current =
    new Date(
      leaveRequest.fromDate
    );

  const end =
    new Date(
      leaveRequest.toDate
    );

  while(current <= end){

    const attendanceDate =
      new Date(current);

    attendanceDate.setHours(
      0,0,0,0
    );

    const existing =
      await StudentAttendance.findOne({

        enrollment:
        enrollment._id,

        date:{
          $gte:attendanceDate,
          $lt:new Date(
            attendanceDate.getTime() +
            24*60*60*1000
          )
        }

      });

    if(!existing){

      await StudentAttendance.create({

        enrollment:
        enrollment._id,

        markedBy:
        leaveRequest.adminReviewedBy,

        date:
        attendanceDate,

        status:"LEAVE",

        remarks:
        leaveRequest.reason

      });

    }

    current.setDate(
      current.getDate() + 1
    );

  }

};

module.exports =
processApprovedLeave;