const Teacher =
require("../../models/Teacher");

const Timetable =
require("../../models/Timetable");

const Notice =
require("../../models/Notice");

exports.getTeacherNotices =
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

    const batchIds =
      timetables.map(
        (item) => item.batch
      );

    // ---------------- GET NOTICES ----------------

    const notices =
      await Notice.find({

        isPublished:true,

        $or:[

          {
            targetAudience:"ALL"
          },

          {
            targetAudience:"TEACHERS"
          },

          {
            targetAudience:"BATCH",
            batches:{
              $in:batchIds
            }
          }

        ]

      })

      .sort({
        createdAt:-1
      })

      .populate(
        "publishedBy",
        "fullName"
      )

      .lean();

    res.status(200).json({
      success:true,
      count:notices.length,
      data:notices
    });

  }catch(error){

    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

exports.getTeacherNoticeById =
async(req,res) => {

  try{

    const notice =
      await Notice.findById(
        req.params.id
      )

      .populate(
        "publishedBy",
        "fullName"
      )

      .populate(
        "batches",
        "name"
      )

      .lean();

    if(!notice){

      return res.status(404).json({
        success:false,
        message:"Notice not found"
      });

    }

    res.status(200).json({
      success:true,
      data:notice
    });

  }catch(error){

    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

exports.markNoticeAsRead =async(req,res) => {

  try{

    const notice =
      await Notice.findById(
        req.params.id
      );

    if(!notice){

      return res.status(404).json({
        success:false,
        message:"Notice not found"
      });

    }

    const alreadyRead =
      notice.readBy.some(
        (item) =>
          item.user.toString()
          === req.user._id.toString()
      );

    if(!alreadyRead){

      notice.readBy.push({
        user:req.user._id,
        readAt:new Date()
      });

      notice.views =
        notice.readBy.length;

      await notice.save();

    }

    res.status(200).json({
      success:true,
      message:"Notice marked as read"
    });

  }catch(error){

    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};