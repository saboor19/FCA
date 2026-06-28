const Counter = require("../models/Counter");

exports.generateEnrollmentNumber =
async(session=null)=>{
  const counter =
  await Counter.findOneAndUpdate({ name:"studentEnrollment" },
    {
      $inc:{sequence:1}
    },

    {
      new:true,
      upsert:true,
      session
    }

  );

  const year =
  new Date().getFullYear();

  return `FCA-${year}-${String(
    counter.sequence
  ).padStart(4,"0")}`;

};