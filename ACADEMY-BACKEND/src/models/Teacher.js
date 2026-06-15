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
      type:String,
      trim:true
    },

    qualification:{
      type:String,
      trim:true
    },

    phone:{
      type:String,
      trim:true
    },

    address:{
      type:String,
      trim:true
    },

    joiningDate:{
      type:Date,
      default:Date.now
    },



    // PROFILE IMAGE
    profileImage:{
      fileId:{
        type:mongoose.Schema.Types.ObjectId
      },

      filename:{
        type:String
      },

      contentType:{
        type:String
      },

      uploadedAt:{
        type:Date,
        default:Date.now
      }
    },



    // OPTIONAL EXTRA PROFILE FIELDS

    gender:{
      type:String,
      enum:["male","female","other"]
    },

    bio:{
      type:String,
      trim:true
    },

    experience:{
      type:Number,
      default:0
    }

  },
  {
    timestamps:true
  }
);

module.exports =
  mongoose.model("Teacher",teacherSchema);