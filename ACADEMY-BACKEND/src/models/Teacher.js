const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },

    employeeId:{
      type:String,
      required:true,
      unique:true
    },

    specialization:{
      type:String
    },

    qualification:{
      type:String
    },

    phone:{
      type:String
    },

    address:{
      type:String
    },

    joiningDate:{
      type:Date,
      default:Date.now
    }
  },
  {
    timestamps:true
  }
);

module.exports =
  mongoose.model("Teacher",teacherSchema);