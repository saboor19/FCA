const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../../models/User");
const SalesTeam = require("../../models/sales/SalesTeam");

// ======================================================
// CREATE SALES TEAM MEMBER
// ======================================================

exports.createSalesTeamMember = async (req, res) => {

const session =
await mongoose.startSession();

session.startTransaction();

try{

const{

fullName,

email,

password,

employeeId,

designation,

department,

manager,

phone,

address,

gender,

dateOfBirth,

joiningDate,

dailyLeadTarget,

monthlyLeadTarget,

employmentStatus,

bio,

experience

}=req.body;

// --------------------------------------------------
// EMAIL CHECK
// --------------------------------------------------

const existingUser =
await User.findOne({

email:email.toLowerCase()

}).session(session);

if(existingUser){

await session.abortTransaction();

session.endSession();

return res.status(400).json({

success:false,

message:"Email already exists."

});

}

// --------------------------------------------------
// EMPLOYEE ID CHECK
// --------------------------------------------------

const existingEmployee =
await SalesTeam.findOne({

employeeId

}).session(session);

if(existingEmployee){

await session.abortTransaction();

session.endSession();

return res.status(400).json({

success:false,

message:"Employee ID already exists."

});

}

// --------------------------------------------------
// MANAGER VALIDATION
// --------------------------------------------------

if(manager){

const managerExists =
await SalesTeam.findById(manager)
.session(session);

if(!managerExists){

await session.abortTransaction();

session.endSession();

return res.status(404).json({

success:false,

message:"Manager not found."

});

}

}

// --------------------------------------------------
// PASSWORD
// --------------------------------------------------

const hashedPassword =
await bcrypt.hash(password,10);

// --------------------------------------------------
// CREATE USER
// --------------------------------------------------

const user =
await User.create([{

fullName,

email:email.toLowerCase(),

password:hashedPassword,

role:"SALES_TEAM",

phone

}],{

session

});

// --------------------------------------------------
// CREATE SALES PROFILE
// --------------------------------------------------

const salesTeam =
await SalesTeam.create([{

userId:user[0]._id,

employeeId,

designation,

department,

manager,

phone,

address,

gender,

dateOfBirth,

joiningDate,

dailyLeadTarget,

monthlyLeadTarget,

employmentStatus,

bio,

experience

}],{

session

});

// --------------------------------------------------
// COMMIT
// --------------------------------------------------

await session.commitTransaction();

session.endSession();

// --------------------------------------------------
// RESPONSE
// --------------------------------------------------

const createdSalesPerson =
await SalesTeam.findById(

salesTeam[0]._id

)

.populate(

"userId",

"fullName email role isActive"

)

.populate(

"manager",

"employeeId designation"

);

return res.status(201).json({

success:true,

message:"Sales team member created successfully.",

data:createdSalesPerson

});

}catch(error){

await session.abortTransaction();

session.endSession();

return res.status(500).json({

success:false,

message:error.message

});

}

};