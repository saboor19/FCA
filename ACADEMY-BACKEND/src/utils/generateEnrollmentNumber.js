const Counter =
require("../models/Counter");

exports.generateEnrollmentNumber =
async() => {

  const counter =
    await Counter.findOneAndUpdate(

      {
        name:"studentEnrollment"
      },

      {
        $inc:{
          sequence:1
        }
      },

      {
        new:true,
        upsert:true
      }

    );

  const year =
    new Date()
    .getFullYear();

  return `FCA-${year}-${String(
    counter.sequence
  ).padStart(4,"0")}`;

};