const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const Course = require("../../models/Course");
const User  = require("../../models/User");
const Batch = require("../../models/Batch")
const StudentFee =require("../../models/StudentFee");



exports.createBatch = async (req,res, next) => {

  try{

    const {
      name,
      course,
      teacherAssignments,
      studyMode,
      roomNumber,
      meetingLink,
      startDate,
      endDate,
      capacity,
      attendanceConfig

    } = req.body;

    // ---------------- CHECK COURSE ----------------

    const existingCourse =
      await Course.findById(course);

    if(!existingCourse){

      res.status(404);

      throw new Error(
        "Course not found"
      );

    }

    // ---------------- DUPLICATE CHECK ----------------

    const duplicateBatch =
      await Batch.findOne({

        name,

        course

      });

    if(duplicateBatch){

      res.status(400);

      throw new Error(
        "Batch already exists for this course"
      );

    }

    // ---------------- VALIDATE TEACHERS ----------------

    if(
      teacherAssignments?.length
    ){

      const teacherIds =
        teacherAssignments.map(
          (item)=>item.teacher
        );

      const teacherCount =
        await Teacher.countDocuments({

          _id:{
            $in:teacherIds
          }

        });

      if(
        teacherCount !==
        teacherIds.length
      ){

        res.status(400);

        throw new Error(
          "One or more teachers are invalid"
        );

      }

    }

    // ---------------- CREATE BATCH ----------------

    const batch =
      await Batch.create({

        name,

        course,

        teacherAssignments,

        studyMode,

        roomNumber,

        meetingLink,

        startDate,

        endDate,

        capacity,
        
        attendanceConfig

      });

    res.status(201).json({

      success:true,

      data:batch

    });

  }catch(error){

    next(error);

  }

};


// ------------get all bacthes
exports.getBatches = async (req,res,next) => {

  try{

    const batches =
      await Batch.find()
      .populate(
        "course",
        "title modules"
      )
    .populate({
  path:"teacherAssignments.teacher",

  populate:{
    path:"userId",
    select:"fullName email"
  }
});

    res.status(200).json({
      success:true,
      count:batches.length,
      data:batches
    });

  }catch(error){

    next(error);

  }

};
//-----------------SINGLE BATCH ---------
exports.getBatch = async(req,res,next) => {

  try{

    const batch =
      await Batch.findById(req.params.id)
      .populate("course","title modules")
      .populate({
      path:"teacherAssignments.teacher",

      populate:{
      path:"userId",
      select:"fullName email"
          }
      });

    if(!batch){

      res.status(404);
      throw new Error("Batch not found");

    }

const students =
  await Student.find({
    batches: batch._id
  })
  .populate(
    "userId",
    "fullName email"
  );

      // console.log(batch, students)

    res.status(200).json({
      success:true,
      data:{
        batch,
        students,
        studentCount:students.length
      }
    });

  }catch(error){

    next(error);

  }

};

//--------------UDATE BATCH----------

exports.updateBatch =
async(req,res,next) => {

  try{

    const batch =
      await Batch.findById(
        req.params.id
      );

    if(!batch){

      res.status(404);

      throw new Error(
        "Batch not found"
      );

    }

    const updateData = {

      name:req.body.name,

      studyMode:req.body.studyMode,

      roomNumber:req.body.roomNumber,

      meetingLink:req.body.meetingLink,

      startDate:req.body.startDate,

      endDate:req.body.endDate,

      capacity:req.body.capacity,

      attendanceConfig:
        req.body.attendanceConfig

    };

    Object.keys(updateData)
      .forEach((key) => {

        if(
          updateData[key] ===
          undefined
        ){

          delete updateData[key];

        }

      });

      if(
  req.body.studyMode ===
  "HYBRID"
){

  if(
    !req.body.roomNumber ||
    !req.body.meetingLink
  ){

    res.status(400);

    throw new Error(

      "Hybrid batches require room number and meeting link"

    );

  }

}


//-----------------location config validation------------
if(
  req.body.attendanceConfig
){

  const {

    latitude,

    longitude,

    radius

  } =
  req.body.attendanceConfig;

  if(

    latitude === undefined ||

    longitude === undefined ||

    radius === undefined

  ){

    res.status(400);

    throw new Error(
      "Invalid attendance configuration"
    );

  }

}

    const updatedBatch =
      await Batch.findByIdAndUpdate(

        req.params.id,

        updateData,

        {
          new:true,
          runValidators:true
        }

      )

      .populate(
        "course",
        "title modules"
      )

      .populate({

        path:
          "teacherAssignments.teacher",

        populate:{

          path:"userId",

          select:
            "fullName email"

        }

      });

    res.status(200).json({

      success:true,

      data:updatedBatch

    });

  }

  catch(error){

    next(error);

  }

};
//-------------- DELETE BATCHES-------------
exports.deleteBatch = async(req,res,next) => {

  try{

    const batch =
      await Batch.findById(req.params.id);

    if(!batch){

      res.status(404);
      throw new Error("Batch not found");

    }

    batch.isActive = false;

    await batch.save();

    res.status(200).json({
      success:true,
      message:"Batch deactivated"
    });

  }catch(error){

    next(error);

  }

};

//--------------ASSIGN STUDENT TO A BATCH---------
exports.assignStudents = async(req,res,next)=>{

  try{

    const { studentIds } =
      req.body;

    // ---------------- VALIDATION ----------------

    if(
      !studentIds ||
      !Array.isArray(
        studentIds
      ) ||
      studentIds.length === 0
    ){

      res.status(400);

      throw new Error(
        "Student ids are required"
      );

    }

    // ---------------- FIND BATCH ----------------

    const batch =
      await Batch.findById(
        req.params.id
      )
      .populate("course");

    if(!batch){

      res.status(404);

      throw new Error(
        "Batch not found"
      );

    }

    // ---------------- ASSIGN STUDENTS ----------------

    await Student.updateMany(

      {
        _id:{
          $in: studentIds
        }
      },

      {
        $addToSet:{
          batches:req.params.id
        }
      }

    );

    // ---------------- CREATE FEE ACCOUNTS ----------------

    for(const studentId of studentIds){

      // Prevent duplicate fee account

      const existingFee =
        await StudentFee.findOne({

          student:studentId,

          batch:req.params.id

        });

      if(existingFee){
        continue;
      }

      const originalFee =
        batch.course?.price || 0;

      await StudentFee.create({

        student:studentId,

        batch:req.params.id,

        course:batch.course._id,

        originalFee,

        finalFee:originalFee,

        dueAmount:originalFee,

        paidAmount:0,

        status:"PENDING"

      });

    }

    res.status(200).json({

      success:true,

      message:
        "Students assigned successfully"

    });

  }catch(error){

    next(error);

  }

};


//-------------TO CHECK AVAILABLE STUDENTS FOR ASSIGNMENT------
exports.getUnassignedStudents = async(req,res,next)=>{

  try{

    const students =
      await Student.find({
        batch:null
      })
      .populate(
        "userId",
        "fullName email"
      );

    res.status(200).json({
      success:true,
      data:students
    });

  }catch(error){

    next(error);

  }

};

exports.getAvailableStudents = async(req,res,next)=>{

  try{

    const { batchId } = req.params;

    const students =
      await Student.find({

        batches:{
          $nin:[batchId]
        }

      })
      .populate(
        "userId",
        "fullName email"
      );

    res.status(200).json({
      success:true,
      data:students
    });

  }catch(error){

    next(error);

  }

};


exports.removeStudentsFromBatch = async(req,res,next)=>{

  try{

    const { studentIds } = req.body;

    if(
      !studentIds ||
      !Array.isArray(studentIds) ||
      studentIds.length === 0
    ){

      res.status(400);
      throw new Error(
        "Student ids are required"
      );

    }

    await Student.updateMany(
      {
        _id:{
          $in: studentIds
        }
      },
      {
        $pull:{
          batches:req.params.id
        }
      }
    );

    res.status(200).json({
      success:true,
      message:"Students removed successfully"
    });

  }catch(error){

    next(error);

  }

};


exports.assignTeachers = async(req,res,next) => {

  try{

    const {
      teacherAssignments
    } = req.body;
    console.log("teachers", teacherAssignments)

    if(
      !teacherAssignments ||
      !Array.isArray(
        teacherAssignments
      ) ||
      teacherAssignments.length === 0
    ){


      res.status(400);

      throw new Error(
        "Teacher assignments are  required",
      );

    }

    const invalidAssignments =
  teacherAssignments.some(
    (item)=>

      !item.teacher ||

      !Array.isArray(
        item.modules
      ) ||

      item.modules.length === 0
  );

if(invalidAssignments){

  res.status(400);

  throw new Error(
    "Each teacher must have at least one module assigned"
  );

}

    // ---------------- VALIDATE TEACHERS ----------------

    const teacherIds =
      teacherAssignments.map(
        (item) => item.teacher
      );

    const teacherCount =
      await Teacher.countDocuments({

        _id:{
          $in: teacherIds
        }

      });

    if(
      teacherCount !==
      teacherIds.length
    ){

      res.status(400);

      throw new Error(
        "One or more teachers are invalid"
      );

    }

    // ---------------- UPDATE BATCH ----------------

    const batch =
      await Batch.findByIdAndUpdate(

        req.params.id,

        {
          $push:{
            teacherAssignments:{
              $each:
                teacherAssignments
            }
          }
        },

        {
          new:true
        }

      )
      .populate({
        path:
          "teacherAssignments.teacher",

        populate:{
          path:"userId",
          select:
            "fullName email"
        }
      });

    res.status(200).json({

      success:true,

      data:batch

    });

  }catch(error){

    next(error);

  }

};


exports.removeTeachers = async(req,res,next) => {

  try{

    const {
      assignmentIds
    } = req.body;

    if(
      !assignmentIds ||
      !Array.isArray(
        assignmentIds
      ) ||
      assignmentIds.length === 0
    ){

      res.status(400);

      throw new Error(
        "Assignment ids are required"
      );

    }

    const batch =
      await Batch.findByIdAndUpdate(

        req.params.id,

        {
          $pull:{

            teacherAssignments:{

              _id:{
                $in: assignmentIds
              }

            }

          }
        },

        {
          new:true
        }

      )
      .populate({
        path:
          "teacherAssignments.teacher",

        populate:{
          path:"userId",
          select:
            "fullName email"
        }
      });

    res.status(200).json({

      success:true,

      data:batch

    });

  }catch(error){

    next(error);

  }

};

exports.getAvailableTeachers = async(req,res,next) => {

  try{

    const batch =
      await Batch.findById(
        req.params.id
      )
      .populate(
        "course",
        "title modules"
      );

    if(!batch){

      res.status(404);
      throw new Error("Batch not found");

    }

    const assignedTeacherIds =
      batch.teacherAssignments.map(
        (item) =>
          item.teacher.toString()
      );

    const teachers =
      await Teacher.find({

        _id:{
          $nin:
            assignedTeacherIds
        }

      })
      .populate(
        "userId",
        "fullName email"
      );

    res.status(200).json({

      success:true,

      data:{
        teachers,
        modules: batch.course?.modules ?? []
      }

    });

  }catch(error){

    next(error);

  }

};