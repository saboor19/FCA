const mongoose = require("mongoose");

let gridfsBucket;

const initGridFS = () => {

  gridfsBucket =
    new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      {
        bucketName: "uploads"
      }
    );

  console.log(
    "✅ GridFS initialized"
  );

};

const getGridFSBucket = () => {

  if(!gridfsBucket){

    throw new Error(
      "GridFSBucket not initialized"
    );

  }

  return gridfsBucket;

};

module.exports = {
  initGridFS,
  getGridFSBucket
};