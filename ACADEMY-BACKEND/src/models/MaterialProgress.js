const mongoose = require("mongoose");

const materialProgressSchema = new mongoose.Schema(
{

  student:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Student",
    required:true
  },

  material:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"StudyMaterial",
    required:true
  },

  batch:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Batch",
    required:true
  },

  status:{
    type:String,
    enum:[
      "NOT_STARTED",
      "IN_PROGRESS",
      "COMPLETED"
    ],
    default:"NOT_STARTED"
  },

  progress:{
    type:Number,
    min:0,
    max:100,
    default:0
  },

  timeSpent:{
    type:Number,
    default:0
  },

  firstOpenedAt:{
    type:Date
  },

  lastReadAt:{
    type:Date
  },

  completedAt:{
    type:Date
  }

},
{
  timestamps:true
});

// One progress record per student per material

materialProgressSchema.index(
{
  student:1,
  material:1
},
{
  unique:true
});

module.exports =
mongoose.model(
  "MaterialProgress",
  materialProgressSchema
);