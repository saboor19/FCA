const Student = require("../../models/Student");
const Batch = require("../../models/Batch");



//---------------------------- GET MY BATCHES-------------

exports.getMyBatches =
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

    const batches =
    await Batch.find({
      _id:{
        $in:student.batches
      },
      isActive:true
    })

    .populate(
      "course",
      "title duration level"
    )

    .sort({
      startDate:-1
    });

    return res.status(200).json({

      success:true,

      count:batches.length,

      batches

    });

  }
  catch(error){

    return res.status(500).json({

      success:false,
      message:error.message

    });

  }

};

// ------------------GET SINGLE BATCH DETAILS

exports.getMyBatchDetails =
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

    const hasAccess =
    student.batches.some(
      batchId =>
      batchId.toString()
      ===
      req.params.batchId
    );

    if(!hasAccess){

      return res.status(403).json({
        success:false,
        message:"You do not have access to this batch"
      });

    }

    const batch =
    await Batch.findById(
      req.params.batchId
    )

    .populate("course")

    .populate({

      path:"teacherAssignments.teacher",

      populate:{
        path:"userId",
        select:
          "fullName email profileImage"
      }

    });

    if(!batch){

      return res.status(404).json({
        success:false,
        message:"Batch not found"
      });

    }

    const teachers =
    batch.teacherAssignments.map(
      assignment => ({

        _id:
          assignment.teacher._id,

        fullName:
          assignment.teacher.userId?.fullName,

        email:
          assignment.teacher.userId?.email,

        profileImage:
          assignment.teacher.userId?.profileImage,

        specialization:
          assignment.teacher.specialization,

        qualification:
          assignment.teacher.qualification,

        modules:
          assignment.modules.map(
            moduleId => {

              const module =
              batch.course.modules.find(
                m =>
                m._id.toString()
                ===
                moduleId.toString()
              );

              return module
              ? {
                  _id:module._id,
                  title:module.title
                }
              : null;

            }
          ).filter(Boolean)

      })
    );

    return res.status(200).json({

      success:true,

      batch:{

        _id:batch._id,

        name:batch.name,

        studyMode:
          batch.studyMode,

        startDate:
          batch.startDate,

        endDate:
          batch.endDate,

        course:
          batch.course,

        teachers

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

