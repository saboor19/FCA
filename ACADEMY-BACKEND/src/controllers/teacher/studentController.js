const Teacher =
require("../../models/Teacher");

const Timetable =
require("../../models/Timetable");

const Enrollment =
require("../../models/Enrollment");

exports.getStudents =
async(req,res) => {

  try{

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;

    const {
      batch,
      course,
      search
    } = req.query;

    // ---------------- GET TEACHER ----------------

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

    // ---------------- GET ASSIGNED BATCHES ----------------

    const timetables =
      await Timetable.find({
        teacher:teacher._id,
        isActive:true
      })

      .populate("batch")
      .populate("course","title");

    const batchIds =
      [
        ...new Set(
          timetables.map(
            (t) => t.batch?._id.toString()
          )
        )
      ];

    // ---------------- BUILD FILTER ----------------

    const enrollmentFilter = {
      batch:{
        $in:batchIds
      },
      status:"ACTIVE"
    };

    if(batch){

      enrollmentFilter.batch = batch;

    }

    // ---------------- GET ENROLLMENTS ----------------

    const enrollments =
      await Enrollment.find(
        enrollmentFilter
      )

      .populate({
        path:"student",
        populate:{
          path:"userId",
          select:"fullName email"
        }
      })

      .populate({
        path:"batch",
        select:"name course"
      })

      .lean();

    // ---------------- COURSE FILTER ----------------

    let filtered =
      enrollments;

    if(course){

      filtered =
        filtered.filter(
          (item) =>
            item.batch?.course?.toString()
            === course
        );

    }

    // ---------------- SEARCH FILTER ----------------

    if(search){

      filtered =
        filtered.filter(
          (item) => {

            const name =
              item.student?.userId?.fullName
              ?.toLowerCase();

            const email =
              item.student?.userId?.email
              ?.toLowerCase();

            return (
              name?.includes(
                search.toLowerCase()
              )
              ||
              email?.includes(
                search.toLowerCase()
              )
            );

          }
        );

    }

    // ---------------- PAGINATION ----------------

    const total =
      filtered.length;

    const paginated =
      filtered.slice(
        skip,
        skip + limit
      );

    res.status(200).json({
      success:true,
      total,
      page,
      pages:Math.ceil(total / limit),
      data:paginated
    });

  }catch(error){

    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

// ---------------- GET SINGLE STUDENT ----------------

exports.getStudentById =
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

    // ---------------- GET TEACHER BATCHES ----------------

    const timetables =
      await Timetable.find({
        teacher:teacher._id,
        isActive:true
      })

      .select("batch")
      .lean();

    const teacherBatchIds =
      timetables.map(
        (item) =>
          item.batch.toString()
      );

    // ---------------- FIND STUDENT ----------------

    const student =
      await require("../../models/Student")
      .findById(
        req.params.id
      )

      .populate(
        "userId",
        "fullName email"
      )

      .populate({
        path:"batches",
        select:"name course studyMode",
        populate:{
          path:"course",
          select:"title"
        }
      })

      .lean();

    if(!student){

      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }

    // ---------------- SECURITY CHECK ----------------

    const hasAccess =
      student.batches.some(
        (batch) =>
          teacherBatchIds.includes(
            batch._id.toString()
          )
      );

    if(!hasAccess){

      return res.status(403).json({
        success:false,
        message:"Unauthorized access"
      });

    }

    res.status(200).json({
      success:true,
      data:student
    });

  }catch(error){

    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};