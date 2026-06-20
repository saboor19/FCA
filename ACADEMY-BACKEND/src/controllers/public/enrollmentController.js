const EnrollmentRequest =
require("../../models/EnrollmentRequest");

//-----------------SUBMIT REQUEST-----------------
exports.submitEnrollmentRequest =
async(req,res,next) => {

  try{

    const existingRequest =
      await EnrollmentRequest.findOne({

        email:req.body.email,

        status:"PENDING"

      });

    if(existingRequest){

      return res.status(400).json({
        success:false,
        message:
          "You already have a pending application"
      });

    }

    const request =
      await EnrollmentRequest.create(
        req.body
      );

    res.status(201).json({

      success:true,

      message:
        "Application submitted successfully",

      data:request

    });

  }catch(error){

    next(error);

  }

};