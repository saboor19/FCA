const mongoose = require("mongoose");

const {
  getGridFSBucket
} = require("../config/gridfs");

exports.uploadFile =async(req,res) => {

  try{

    if(!req.file){

      return res.status(400).json({
        success:false,
        message:"No file uploaded"
      });

    }

    const bucket =
      getGridFSBucket();

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
  () => {

    res.status(201).json({
      success:true,
      fileId:uploadStream.id,
      filename:uploadStream.filename
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

console.log(file);

    // IMPORTANT HEADERS
const contentType =
  file.filename.endsWith(".pdf")
  ? "application/pdf"
  : "application/octet-stream";

res.set(
  "Content-Type",
  contentType
);

res.set(
  "Content-Disposition",
  `inline; filename="${file.filename}"`
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

exports.deleteFile = async(req,res) => {

  try{

    const bucket =
      getGridFSBucket();

    const fileId =
      new mongoose.Types.ObjectId(
        req.params.id
      );

    await bucket.delete(fileId);

    res.status(200).json({
      success:true,
      message:"File deleted"
    });

  }
  catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};