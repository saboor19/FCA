const mongoose = require("mongoose");

const {

TASK_STATUS,

TASK_PRIORITY

} = require("../../constants/salesConstants");

// --------------------------------------------------
// ATTACHMENT SCHEMA
// --------------------------------------------------

const attachmentSchema =
new mongoose.Schema({

  fileId:{
    type:mongoose.Schema.Types.ObjectId
  },

  filename:String,

  contentType:String

},{
  _id:false
});

// --------------------------------------------------
// TASK SCHEMA
// --------------------------------------------------

const leadTaskSchema =
new mongoose.Schema({

  // --------------------------------------------------
  // RELATIONS
  // --------------------------------------------------

  lead:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Lead",
    required:true
  },

  assignedTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SalesTeam",
    required:true
  },

  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SalesTeam",
    required:true
  },

  // --------------------------------------------------
  // TASK
  // --------------------------------------------------

  title:{
    type:String,
    required:true,
    trim:true
  },

  description:{
    type:String,
    default:"",
    trim:true
  },

  priority:{
    type:String,
    enum:TASK_PRIORITY,
    default:"MEDIUM"
  },

  status:{
    type:String,
    enum:TASK_STATUS,
    default:"PENDING"
  },

  dueDate:{
    type:Date,
    required:true
  },

  completedAt:Date,

  remarks:{
    type:String,
    trim:true
  },

  // --------------------------------------------------
  // ATTACHMENTS
  // --------------------------------------------------

  attachments:[
    attachmentSchema
  ]

},{
  timestamps:true
});

// --------------------------------------------------
// INDEXES
// --------------------------------------------------

leadTaskSchema.index({

  assignedTo:1,

  status:1

});

leadTaskSchema.index({

  status:1,

  dueDate:1

});

leadTaskSchema.index({

  lead:1,

  status:1

});

module.exports =
mongoose.model(
"LeadTask",
leadTaskSchema
);