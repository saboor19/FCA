const Enrollment = require("../../models/Enrollment");
const Student = require("../../models/Student");
const Batch = require("../../models/Batch");


//------------CREATE ENROLLMENT-------------
exports.createEnrollment = async (req,res) => {

  try{

    const {
      student,
      batch
    } = req.body;

    // CHECK STUDENT

    const existingStudent =
    await Student.findById(student);

    if(!existingStudent){

      return res.status(404).json({
        message:"Student not found"
      });

    }

    // CHECK BATCH

    const existingBatch =
    await Batch.findById(batch);

    if(!existingBatch){

      return res.status(404).json({
        message:"Batch not found"
      });

    }

    // PREVENT DUPLICATE ACTIVE ENROLLMENT

    const alreadyEnrolled =
    await Enrollment.findOne({
      student,
      batch,
      status:"ACTIVE"
    });

    if(alreadyEnrolled){

      return res.status(400).json({
        message:"Student already enrolled in this batch"
      });

    }

    // CHECK CAPACITY

    const totalEnrollments =
    await Enrollment.countDocuments({
      batch,
      status:"ACTIVE"
    });

    if(totalEnrollments >= existingBatch.capacity){

      return res.status(400).json({
        message:"Batch capacity reached"
      });

    }

    // CREATE ENROLLMENT

    const enrollment =
    await Enrollment.create({
      student,
      batch
    });

    res.status(201).json({
      success:true,
      data:enrollment
    });

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};

//------------GET ENROLLMENTS-------------
exports.getEnrollments = async (req,res) => {

  try{

    const enrollments =
    await Enrollment.find()
      .populate({
        path:"student",
        populate:{
          path:"userId",
          select:"fullName email"
        }
      })
      .populate({
        path:"batch",
        select:"name"
      });

    res.status(200).json({
      success:true,
      data:enrollments
    });

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};
//------------DELETE ENROLLMENT-------------
exports.deleteEnrollment = async (req,res) => {

  try{

    const enrollment =
    await Enrollment.findById(
      req.params.id
    );

    if(!enrollment){

      return res.status(404).json({
        message:"Enrollment not found"
      });

    }

    await enrollment.deleteOne();

    res.status(200).json({
      success:true,
      message:"Enrollment deleted"
    });

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};

exports.getBatchEnrollments = async (req,res) => {

  try{

    const enrollments =
    await Enrollment.find({

      batch:req.params.batchId,

      status:"ACTIVE"

    })

    .populate({

      path:"student",

      populate:{
        path:"userId",
        select:"fullName email"
      }

    })

    .populate(
      "batch",
      "name"
    );

    res.status(200).json({

      success:true,

      data:enrollments

    });

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};