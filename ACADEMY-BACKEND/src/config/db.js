const mongoose = require("mongoose");

const {
  initGridFS
} = require("./gridfs");

const connectDB = async () => {

  try{

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "✅ MongoDB Connected"
    );

    initGridFS();

  }
  catch(error){

    console.error(error);
    process.exit(1);

  }

};

module.exports = connectDB;