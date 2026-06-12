const mongoose = require("mongoose");

// ---------------- MODULE SCHEMA ----------------

const moduleSchema = new mongoose.Schema({

  title:{
    type:String,
    required:true,
    trim:true
  },

  code:{
    type:String,
    uppercase:true,
    trim:true
  },

  description:{
    type:String,
    default:""
  },

  duration:{
    type:String,
    default:""
  },

  order:{
    type:Number,
    default:0
  }

},{ _id:true });

// ---------------- COURSE SCHEMA ----------------

const courseSchema = new mongoose.Schema(
{
  title:{
    type:String,
    required:true,
    trim:true
  },

  description:{
    type:String,
    required:true
  },

  duration:{
    type:String
  },

  level:{
    type:String,
    enum:[
      "BEGINNER",
      "INTERMEDIATE",
      "ADVANCED"
    ],
    default:"BEGINNER"
  },

  price:{
    type:Number,
    default:0
  },

  thumbnail:{
    type:String
  },

  // ---------------- MODULES ----------------

  modules:[moduleSchema],

  isPublished:{
    type:Boolean,
    default:true
  }

},
{
  timestamps:true
});

module.exports =
  mongoose.model("Course",courseSchema);