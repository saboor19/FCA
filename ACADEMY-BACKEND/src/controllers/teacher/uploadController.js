const Teacher = require("../../models/Teacher");

const {
  getGridFSBucket
} = require("../../config/gridfs");

exports.uploadProfileImage = async(req,res) => {

  try{

    if(!req.file){

      return res.status(400).json({
        success:false,
        message:"No file uploaded"
      });

    }

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

    const bucket =
      getGridFSBucket();



    // DELETE OLD IMAGE
    if(teacher.profileImage?.fileId){

      try{

        await bucket.delete(
          teacher.profileImage.fileId
        );

      }
      catch(error){

        console.log(
          "Old image delete failed"
        );

      }

    }



    // UPLOAD NEW IMAGE
    const uploadStream =
      bucket.openUploadStream(
        req.file.originalname,
        {
          contentType:
            req.file.mimetype
        }
      );

    uploadStream.end(req.file.buffer);

    uploadStream.on(
      "finish",
      async() => {

        teacher.profileImage = {
          fileId:uploadStream.id,
          filename:uploadStream.filename,
          contentType:req.file.mimetype
        };

        await teacher.save();

        res.status(200).json({
          success:true,
          message:"Profile image uploaded",
          profileImage:
            teacher.profileImage
        });

      }
    );

    uploadStream.on(
      "error",
      (error) => {

        res.status(500).json({
          success:false,
          message:error.message
        });

      }
    );

  }
  catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

exports.getFile = async(req,res) => {

  try{

    const bucket =
      getGridFSBucket();

    const fileId =
      new mongoose.Types.ObjectId(
        req.params.id
      );



    // GET FILE METADATA
    const files =
      await bucket.find({
        _id:fileId
      }).toArray();



    if(!files || files.length === 0){

      return res.status(404).json({
        success:false,
        message:"File not found"
      });

    }



    const file = files[0];



    // IMPORTANT HEADERS
    res.set("Content-Type",file.contentType);

    res.set(
      "Cross-Origin-Resource-Policy",
      "cross-origin"
    );



    const downloadStream =
      bucket.openDownloadStream(
        fileId
      );



    downloadStream.on(
      "error",
      () => {

        return res.status(404).json({
          success:false,
          message:"File not found"
        });

      }
    );



    downloadStream.pipe(res);

  }
  catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};