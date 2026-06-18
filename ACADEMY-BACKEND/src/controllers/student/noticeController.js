const Notice = require("../../models/Notice");
const Student = require("../../models/Student");
const Enrollment = require("../../models/Enrollment");

exports.getNotices =
async(req,res) => {

  try{

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;

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

    const enrollments =
      await Enrollment.find({

        student:student._id,

        status:"ACTIVE"

      });

    const batchIds =
      enrollments.map(
        item => item.batch
      );

    const query = {

  isPublished:true,

  $and:[

    {
      $or:[

        {
          targetAudience:"ALL"
        },

        {
          targetAudience:"STUDENTS"
        },

        {
          targetAudience:"BATCH",
          batches:{
            $in:batchIds
          }
        }

      ]
    },

    {
      $or:[

        {
          expiryDate:null
        },

        {
          expiryDate:{
            $gte:new Date()
          }
        }

      ]
    }

  ]

};

    const notices =
      await Notice.find(query)

      .populate(
        "publishedBy",
        "fullName"
      )

      .sort({
        publishDate:-1
      })

      .skip(skip)

      .limit(limit)

      .lean();

    const formattedNotices =
      notices.map(
        notice => ({

          _id:notice._id,

          title:notice.title,

          type:notice.type,

          priority:notice.priority,

          publishDate:
          notice.publishDate,

          publishedBy:
          notice.publishedBy,

          isRead:
          notice.readBy.some(

            item =>

              item.user.toString()
              ===
              req.user._id.toString()

          )

        })
      );

    const total =
      await Notice.countDocuments(
        query
      );

    return res.status(200).json({

      success:true,

      notices:
      formattedNotices,

      pagination:{

        page,

        limit,

        total,

        pages:
        Math.ceil(
          total / limit
        )

      }

    });

  }

  catch(error){

    console.error(error);

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

exports.getNotice =
async(req,res) => {

  try{

    const notice =
      await Notice.findById(
        req.params.id
      )
      .populate(
        "publishedBy",
        "fullName email"
      );

    if(!notice){

      return res.status(404).json({

        success:false,

        message:"Notice not found"

      });

    }

    const alreadyRead =
      notice.readBy.some(

        item =>

          item.user.toString()
          ===
          req.user._id.toString()

      );

    if(!alreadyRead){

      notice.readBy.push({

        user:req.user._id

      });

      await notice.save();

    }

    return res.status(200).json({

      success:true,

      notice

    });

  }

  catch(error){

    console.error(error);

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};


exports.markNoticeAsRead =
async(req,res) => {

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

        item =>

          item.user.toString()
          ===
          req.user._id.toString()

      );

    if(!alreadyRead){

      notice.readBy.push({

        user:req.user._id

      });

      await notice.save();

    }

    return res.status(200).json({

      success:true,

      message:
      "Notice marked as read"

    });

  }

  catch(error){

    console.error(error);

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};