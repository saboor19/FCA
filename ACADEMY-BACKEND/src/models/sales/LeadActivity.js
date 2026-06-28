const mongoose = require("mongoose");

const {
  ACTIVITY_TYPE
} = require("../../constants/salesConstants");

const leadActivitySchema =
new mongoose.Schema({

  // ==================================================
  // LEAD
  // ==================================================

  lead:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Lead",
    required:true
  },

  // ==================================================
  // WHO PERFORMED THE ACTIVITY
  // ==================================================

  performedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SalesTeam",
    required:true
  },

  // ==================================================
  // ACTIVITY
  // ==================================================

  type:{
    type:String,
    enum:ACTIVITY_TYPE,
    required:true
  },

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

  outcome:{
    type:String,
    trim:true,
    default:""
  },

  // ==================================================
  // SOURCE
  // ==================================================

  source:{
    type:String,
    enum:[
      "SYSTEM",
      "USER"
    ],
    default:"USER"
  },

  // ==================================================
  // SCHEDULING
  // ==================================================

  scheduledAt:Date,

  completedAt:Date,

  // ==================================================
  // EXTRA DATA
  // ==================================================

  metadata:{
    type:mongoose.Schema.Types.Mixed,
    default:{}
  },

  // ==================================================
  // VISIBILITY
  // ==================================================

  isVisible:{
    type:Boolean,
    default:true
  },

  // ==================================================
  // SOFT DELETE
  // ==================================================

  isDeleted:{
    type:Boolean,
    default:false
  },

  deletedAt:Date

},
{
  timestamps:true
});

// ==================================================
// INDEXES
// ==================================================

// Timeline

leadActivitySchema.index({

  lead:1,

  createdAt:-1

});

// Lead + Activity Type

leadActivitySchema.index({

  lead:1,

  type:1

});

// Sales Executive Activities

leadActivitySchema.index({

  performedBy:1,

  createdAt:-1

});

// Activity Type

leadActivitySchema.index({

  type:1

});

// Visibility

leadActivitySchema.index({

  isVisible:1

});

// Soft Delete

leadActivitySchema.index({

  isDeleted:1

});

module.exports =
mongoose.model(
  "LeadActivity",
  leadActivitySchema
);