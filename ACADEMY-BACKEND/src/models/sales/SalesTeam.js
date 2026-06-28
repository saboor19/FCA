const mongoose = require("mongoose");

const salesTeamSchema = new mongoose.Schema(
{
  // --------------------------------------------------
  // USER
  // --------------------------------------------------

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    unique:true
  },

  // --------------------------------------------------
  // EMPLOYEE
  // --------------------------------------------------

  employeeId:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    uppercase:true
  },

  designation:{
    type:String,
    trim:true,
    default:"Sales Executive"
  },

  department:{
    type:String,
    trim:true,
    default:"Sales"
  },

  manager:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SalesTeam"
  },

  joiningDate:{
    type:Date,
    default:Date.now
  },

  employmentStatus:{
    type:String,
    enum:[
      "ACTIVE",
      "INACTIVE",
      "ON_LEAVE",
      "RESIGNED",
      "TERMINATED"
    ],
    default:"ACTIVE"
  },

  // --------------------------------------------------
  // CONTACT
  // --------------------------------------------------

  phone:{
    type:String,
    trim:true
  },

  address:{
    type:String,
    trim:true
  },

  // --------------------------------------------------
  // PERSONAL
  // --------------------------------------------------

  gender:{
    type:String,
    enum:[
      "MALE",
      "FEMALE",
      "OTHER"
    ]
  },

  dateOfBirth:Date,

  // --------------------------------------------------
  // TARGETS
  // --------------------------------------------------

  dailyLeadTarget:{
    type:Number,
    default:0,
    min:0
  },

  monthlyLeadTarget:{
    type:Number,
    default:0,
    min:0
  },

  // --------------------------------------------------
  // PROFILE IMAGE
  // --------------------------------------------------

  profileImage:{

    fileId:{
      type:mongoose.Schema.Types.ObjectId
    },

    filename:String,

    contentType:String,

    uploadedAt:{
      type:Date,
      default:Date.now
    }

  },

  // --------------------------------------------------
  // EXTRA
  // --------------------------------------------------

  bio:{
    type:String,
    trim:true
  },
  assignedLeadCount:{
    type:Number,
    default:0
},
lastLogin:Date,
isAvailable:{
    type:Boolean,
    default:true
},


  experience:{
    type:Number,
    default:0,
    min:0
  }

},
{
  timestamps:true
});

// --------------------------------------------------
// INDEXES
// --------------------------------------------------

salesTeamSchema.index(
{
  userId:1
},
{
  unique:true
}
);

salesTeamSchema.index(
{
  employeeId:1
},
{
  unique:true
}
);

salesTeamSchema.index({
  manager:1
});

salesTeamSchema.index({
  employmentStatus:1
});

salesTeamSchema.index({
  department:1
});

module.exports =
mongoose.model(
  "SalesTeam",
  salesTeamSchema
);