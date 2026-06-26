const User=require("../../models/User");

const Teacher =
require("../../models/Teacher");

const Timetable =
require("../../models/Timetable");

const Enrollment =
require("../../models/Enrollment");

const Course =
require("../../models/Course");

const Batch =
require("../../models/Batch");


const Student=
require("../../models/Student");



//-------------GET ASSIGNED BATCHES-------------
exports.getAssignedBatches = async (req, res) => {

  try {

    const teacher =
      await Teacher.findOne({
        userId: req.user._id
      });

    if (!teacher) {

      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });

    }

    // GET TEACHER TIMETABLES

    const timetables =
      await Timetable.find({
        teacher: teacher._id,
        isActive: true
      })
      .populate("batch")
      .populate(
        "course",
        "title modules"
      )
      .lean();

    // GET ALL BATCHES REFERENCED BY TIMETABLES

    const batchIds =
      timetables.map(
        slot => slot.batch?._id
      );

    const batchDocs =
      await Batch.find({
        _id: { $in: batchIds }
      }).lean();

    const batchMap =
      new Map(
        batchDocs.map(batch => [
          batch._id.toString(),
          batch
        ])
      );

    // REMOVE DUPLICATES + FILTER MODULES

    const uniqueBatchMap =
      new Map();

    timetables.forEach((slot) => {

      if (!slot.batch || !slot.course) {
        return;
      }

      const batchDoc =
        batchMap.get(
          slot.batch._id.toString()
        );

      const teacherAssignment =
        batchDoc?.teacherAssignments?.find(
          assignment =>
            assignment.teacher.toString() ===
            teacher._id.toString()
        );

      const assignedModuleIds =
        teacherAssignment?.modules || [];

      const filteredModules =
        slot.course.modules.filter(
          module =>
            assignedModuleIds.some(
              moduleId =>
                moduleId.toString() ===
                module._id.toString()
            )
        );

      uniqueBatchMap.set(
        slot.batch._id.toString(),
        {
          ...slot.batch,

          course: {
            ...slot.course,
            modules: filteredModules
          },

          subject: slot.subject
        }
      );

    });

    const uniqueBatches =
      Array.from(
        uniqueBatchMap.values()
      );

    // ADD STUDENT COUNT

    const formattedBatches =
      await Promise.all(

        uniqueBatches.map(
          async (batch) => {

            const studentsCount =
              await Enrollment.countDocuments({
                batch: batch._id,
                status: "ACTIVE"
              });

            return {
              ...batch,
              studentsCount
            };

          }
        )

      );


    res.status(200).json({
      success: true,
      count: formattedBatches.length,
      data: formattedBatches
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

//-------------GET SINGLE BATCH DETAILS-------------
exports.getBatchDetails = async(req,res) => {

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

    const batch =
      await Batch.findById(
        req.params.id
      )
      .populate(
        "course",
        "title modules description"
      )

      .lean();

    if(!batch){

      return res.status(404).json({
        success:false,
        message:"Batch not found"
      });

    }

    // CHECK WHETHER THIS BATCH
    // IS ASSIGNED TO TEACHER

    const isAssigned =
      await require("../../models/Timetable")
      .exists({
        teacher:teacher._id,
        batch:batch._id,
        isActive:true
      });

    if(!isAssigned){

      return res.status(403).json({
        success:false,
        message:"Unauthorized access"
      });

    }

    // GET ENROLLED STUDENTS

    const students =
      await Enrollment.find({
        batch:batch._id,
        status:"ACTIVE"
      })

     .populate({
        path:"student",
          populate:{
            path:"userId",
            select:"fullName email"
      }}).lean();

      

    res.status(200).json({
      success:true,
      data:{
        ...batch,
        students
      }
    });

  }catch(error){

    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};