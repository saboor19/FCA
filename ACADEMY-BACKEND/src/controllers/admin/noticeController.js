const Notice = require("../../models/Notice");


//-------------CREATE NOTICE-------------
exports.createNotice = async (req, res) => { try {
    // 1. Destructure the body to isolate dates and logic-dependent fields.
    // NOTE: 'attachments' is automatically captured inside ...restData!
    const { 
      publishDate, 
      expiryDate, 
      targetAudience, 
      batches, 
      ...restData 
    } = req.body;

    // 2. Base Payload Setup
    const noticePayload = {
      ...restData, 
      targetAudience,
      publishedBy: req.user._id // Ensure req.user is set by your auth middleware
    };

    // 3. Date Sanitization (Prevents MongoDB CastErrors if strings are "")
    if (publishDate) noticePayload.publishDate = publishDate;
    if (expiryDate) noticePayload.expiryDate = expiryDate;

    // 4. Batch Logic Enforcement
    if (targetAudience === "BATCH" && Array.isArray(batches)) {
      noticePayload.batches = batches;
    } else {
      noticePayload.batches = []; // Force empty if target audience is NOT "BATCH"
    }

    // 5. Database Insertion
    const notice = await Notice.create(noticePayload);

    // 6. Success Response
    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice
    });

  } catch (error) {
    // 7. Error Handling
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//-------------GET ALL NOTICES-------------
exports.getNotices = async(req,res) => {

  try{

    const notices =
      await Notice.find()

      .populate(
        "publishedBy",
        "fullName email"
      )

      .populate(
        "batches",
        "name"
      )

      .sort({
        createdAt:-1
      });

    res.status(200).json({
      success:true,
      count:notices.length,
      data:notices
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};


//-------------GET SINGLE NOTICE-------------
exports.getNotice = async(req,res) => {

  try{

    const notice =
      await Notice.findById(
        req.params.id
      )

      .populate(
        "publishedBy",
        "fullName email"
      )

      .populate(
        "batches",
        "name"
      );

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

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};


//-------------UPDATE NOTICE-------------
exports.updateNotice = async (req, res) => {
  try {
    // 1. Destructure the payload to intercept dates and arrays
    const { 
      publishDate, 
      expiryDate, 
      targetAudience, 
      batches, 
      ...restData 
    } = req.body;

    // 2. Initialize the clean update payload
    const updatePayload = {
      ...restData,
      targetAudience
    };

    // 3. Clean Dates: If frontend sends an empty string, set it to null 
    // to avoid Mongoose CastErrors. Otherwise, set the actual date.
    updatePayload.publishDate = publishDate ? publishDate : null;
    updatePayload.expiryDate = expiryDate ? expiryDate : null;

    // 4. Enforce Batch Logic: If audience isn't "BATCH", wipe the batches array.
    if (targetAudience === "BATCH" && Array.isArray(batches)) {
      updatePayload.batches = batches;
    } else {
      updatePayload.batches = [];
    }

    // 5. Execute the update with the cleaned payload
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      {
        new: true, // Returns the newly updated document
        runValidators: true // Ensures the enum values (Priority, Type) are still valid
      }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: notice
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//-------------DELETE NOTICE-------------
exports.deleteNotice = async(req,res) => {

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

    await notice.deleteOne();

    res.status(200).json({
      success:true,
      message:"Notice deleted successfully"
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};


//-------------MARK NOTICE AS READ-------------
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

      notice.views += 1;

      notice.readBy.push({
        user:req.user._id
      });

      await notice.save();

    }

    res.status(200).json({
      success:true,
      message:"Notice marked as read"
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};