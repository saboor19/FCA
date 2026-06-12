const Teacher = require("../../models/Teacher");
const Batch = require("../../models/Batch");
const Student = require("../../models/Student");

//-------------GET ASSIGNED BATCHES-------------
exports.getAssignedBatches =
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

    const batches =
      await Batch.find({
        teachers:teacher._id
      })

      .populate(
        "course",
        "title"
      )

      .populate({
        path:"teachers",
        populate:{
          path:"userId",
          select:"fullName"
        }
      })

      .lean();

    // ADD STUDENT COUNT

const formattedBatches =
  await Promise.all(

    batches.map(async(batch) => {

      const studentsCount =
        await Student.countDocuments({
          batches:batch._id
        });

      return {

        ...batch,

        studentsCount

      };

    })

  );

    res.status(200).json({
      success:true,
      count:formattedBatches.length,
      data:formattedBatches
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

//-------------GET SINGLE BATCH-------------
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
      await Batch.findOne({

        _id:req.params.id,

        teachers:teacher._id

      })

      .populate(
        "course",
        "title description"
      )

      .populate({
        path:"students",

        populate:{
          path:"userId",
          select:"fullName email"
        }
      })

      .populate({
        path:"teachers",

        populate:{
          path:"userId",
          select:"fullName"
        }
      });

    if(!batch){

      return res.status(404).json({
        success:false,
        message:"Batch not found"
      });

    }

    res.status(200).json({
      success:true,
      data:batch
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};
