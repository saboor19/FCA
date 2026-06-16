const Student =
require("../../models/Student");

const Timetable =
require("../../models/Timetable");



exports.getMyTimetable =
async(req,res)=>{

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

// notes for self by Saboor 

// 1. Add index hint for performance (if batches array is large)
const timetable = await Timetable.find({
  batch: { $in: student.batches },
  isActive: true
})
  .populate("batch", "name")
  .populate("course", "title")
  .populate({
    path: "teacher",
    populate: { path: "userId", select: "fullName" }
  })
  .lean(); // Use .lean() for read-only data — 2-3x faster

// 2. Add projection to reduce payload size
const formattedTimetable = timetable.map(item => ({
  _id: item._id,
  batch: { _id: item.batch?._id, name: item.batch?.name },
  course: { _id: item.course?._id, title: item.course?.title },
  teacher: { _id: item.teacher?._id, fullName: item.teacher?.userId?.fullName },
  subject: item.subject,
  dayOfWeek: item.dayOfWeek,
  startTime: item.startTime,
  endTime: item.endTime,
  roomNumber: item.roomNumber,
  meetingLink: item.meetingLink,
  mode: item.mode,
}));

// 3. Consider caching this endpoint with Redis since timetable rarely changes



    const dayOrder = {

      MONDAY:1,
      TUESDAY:2,
      WEDNESDAY:3,
      THURSDAY:4,
      FRIDAY:5,
      SATURDAY:6,
      SUNDAY:7

    };

    formattedTimetable.sort(
      (a,b)=>{

        const dayDiff =
        dayOrder[a.dayOfWeek]
        -
        dayOrder[b.dayOfWeek];

        if(dayDiff !== 0){

          return dayDiff;

        }

        return a.startTime.localeCompare(
          b.startTime
        );

      }
    );



    return res.status(200).json({

      success:true,

      count:
        formattedTimetable.length,

      timetable:
        formattedTimetable

    });

  }
  catch(error){

    return res.status(500).json({

      success:false,
      message:error.message

    });

  }

};