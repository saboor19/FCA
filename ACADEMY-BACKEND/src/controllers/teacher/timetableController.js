const Teacher =
require("../../models/Teacher");

const Timetable =
require("../../models/Timetable");


//-------------GET TEACHER TIMETABLE-------------
exports.getTeacherTimetable =
async(req,res) => {

  try{

    const teacher =
      await Teacher.findOne({
        userId:req.user._id
      });

    if(!teacher){

      return res.status(404).json({
        success:false,
        message:"Teacher not found"
      });

    }

    const timetable =
      await Timetable.find({
        teacher:teacher._id,
        isActive:true
      })

      .populate(
        "batch",
        "name"
      )

      .populate(
        "course",
        "title"
      )

      .sort({
        dayOfWeek:1,
        startTime:1
      });

    res.status(200).json({
      success:true,
      count:timetable.length,
      data:timetable
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};