
const StudentFee =
require("../../models/StudentFee");

const Student =
require("../../models/Student");

const Batch =
require("../../models/Batch");

const Course =
require("../../models/Course");

// ---------------------------------------------------
// CREATE STUDENT FEE ACCOUNT
// ---------------------------------------------------

exports.createStudentFee =
async(req,res,next) => {

  try{

    const {

      student,

      batch,

      discount = 0,

      installmentAllowed = false,

      totalInstallments = 1

    } = req.body;

    // ---------------- CHECK STUDENT ----------------

    const existingStudent =
      await Student.findById(
        student
      );

    if(!existingStudent){

      res.status(404);

      throw new Error(
        "Student not found"
      );

    }

    // ---------------- CHECK BATCH ----------------

    const existingBatch =
      await Batch.findById(batch)
      .populate("course");

    if(!existingBatch){

      res.status(404);

      throw new Error(
        "Batch not found"
      );

    }

    // ---------------- PREVENT DUPLICATE ----------------

    const existingFee =
      await StudentFee.findOne({

        student,
        batch

      });

    if(existingFee){

      res.status(400);

      throw new Error(
        "Fee account already exists for this student"
      );

    }

    // ---------------- COURSE FEE ----------------

    const originalFee =
      existingBatch.course?.price || 0;

    // ---------------- FINAL FEE ----------------

    const finalFee =
      originalFee - discount;

    // ---------------- CREATE ACCOUNT ----------------

    const feeAccount =
      await StudentFee.create({

        student,

        batch,

        course:
          existingBatch.course._id,

        originalFee,

        discount,

        finalFee,

        paidAmount:0,

        dueAmount:finalFee,

        installmentAllowed,

        totalInstallments

      });

    res.status(201).json({

      success:true,

      message:
        "Fee account created successfully",

      data:feeAccount

    });

  }catch(error){

    next(error);

  }

};

// ---------------------------------------------------
// GET SINGLE STUDENT FEE
// ---------------------------------------------------

exports.getStudentFee =
async(req,res,next) => {

  try{

    const fee =
      await StudentFee.findById(
        req.params.id
      )

      .populate({
        path:"student",

        populate:{
          path:"userId",
          select:
            "fullName email"
        }
      })

      .populate(
        "batch",
        "name"
      )

      .populate(
        "course",
        "title"
      );

    if(!fee){

      res.status(404);

      throw new Error(
        "Fee account not found"
      );

    }

    res.status(200).json({

      success:true,

      data:fee

    });

  }catch(error){

    next(error);

  }

};


// ---------------------------------------------------
// UPDATE / MANAGE STUDENT FEE
// ---------------------------------------------------

exports.updateStudentFee = async(req,res,next) => {

  try{

    const {

      discount = 0,

      paymentType = "FULL"

    } = req.body;

    // ---------------------------------------------------
    // GET FEE ACCOUNT
    // ---------------------------------------------------

    const fee =
      await StudentFee.findById(
        req.params.id
      )

      .populate({

        path:"batch",

        populate:{
          path:"course"
        }

      });

    if(!fee){

      res.status(404);

      throw new Error(
        "Fee account not found"
      );

    }

    // ---------------------------------------------------
    // VALIDATE DISCOUNT
    // ---------------------------------------------------

    if(discount < 0){

      res.status(400);

      throw new Error(
        "Discount cannot be negative"
      );

    }

    if(discount > fee.originalFee){

      res.status(400);

      throw new Error(
        "Discount exceeds original fee"
      );

    }

    // ---------------------------------------------------
    // UPDATE DISCOUNT
    // ---------------------------------------------------

    fee.discount = Number(discount);

    // ---------------------------------------------------
    // RECALCULATE FINAL FEE
    // ---------------------------------------------------

    fee.finalFee =
      fee.originalFee -
      fee.discount;

    // ---------------------------------------------------
    // RECALCULATE DUE
    // ---------------------------------------------------

    fee.dueAmount =
      fee.finalFee -
      fee.paidAmount;

    // ---------------------------------------------------
    // PAYMENT TYPE
    // ---------------------------------------------------

    fee.paymentType =
      paymentType;

    // ---------------------------------------------------
    // EMI MODE
    // ---------------------------------------------------

    if(paymentType === "EMI"){

      // ---------------------------------------------------
      // ENABLE INSTALLMENTS
      // ---------------------------------------------------

      fee.installmentAllowed = true;

      // ---------------------------------------------------
      // GET COURSE DURATION
      // Example:
      // "6 Months"
      // "12 months"
      // ---------------------------------------------------

      const durationString =
        fee.batch?.course?.duration || "1";

      // ---------------------------------------------------
      // EXTRACT NUMBER
      // ---------------------------------------------------

      const duration =
        parseInt(durationString);

      // ---------------------------------------------------
      // FALLBACK SAFETY
      // ---------------------------------------------------

      const validDuration =
        duration > 0
        ? duration
        : 1;

      // ---------------------------------------------------
      // SAVE DURATION
      // ---------------------------------------------------

      fee.courseDurationMonths =
        validDuration;

      // ---------------------------------------------------
      // TOTAL INSTALLMENTS
      // ---------------------------------------------------

      fee.totalInstallments =
        validDuration;

      // ---------------------------------------------------
      // EMI AMOUNT
      // ---------------------------------------------------

      fee.emiAmount =
        Math.ceil(

          fee.finalFee /

          validDuration

        );

      // ---------------------------------------------------
      // NEXT DUE DATE
      // ---------------------------------------------------

      if(!fee.nextDueDate){

        fee.nextDueDate =
          new Date();

      }

    }else{

      // ---------------------------------------------------
      // FULL PAYMENT MODE
      // ---------------------------------------------------

      fee.installmentAllowed =
        false;

      fee.totalInstallments =
        1;

      fee.courseDurationMonths =
        1;

      fee.emiAmount =
        0;

      fee.nextDueDate =
        null;

    }

    // ---------------------------------------------------
    // STATUS UPDATE
    // ---------------------------------------------------

    if(fee.dueAmount <= 0){

      fee.status = "PAID";

    }else if(fee.paidAmount > 0){

      fee.status = "PARTIAL";

    }else{

      fee.status = "PENDING";

    }

    // ---------------------------------------------------
    // SAVE
    // ---------------------------------------------------

    await fee.save();

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    res.status(200).json({

      success:true,

      message:
        "Fee updated successfully",

      data:fee

    });

  }catch(error){

    next(error);

  }

};




//-----------get all fee------------
exports.getAllFees = async(req,res,next)=>{

  try{

    const fees =
      await StudentFee.find()

      .populate({
        path:"student",

        populate:{
          path:"userId",
          select:
            "fullName email"
        }
      })

      .populate(
        "batch",
        "name"
      )

      .populate(
        "course",
        "title"
      )

      .sort({
        createdAt:-1
      });

    res.status(200).json({

      success:true,

      count:fees.length,

      data:fees

    });

  }catch(error){

    next(error);

  }

};


// ---------------------------------------------------
// ADD PAYMENT
// ---------------------------------------------------

exports.addPayment =
async(req,res,next) => {

  try{

    const {paymentMethod, transactionId, remarks } = req.body;
    const amount = Number(req.body.amount);

    const fee =
      await StudentFee.findById(
        req.params.id
      );

    if(!fee){

      res.status(404);

      throw new Error(
        "Fee account not found"
      );

    }

    // ---------------- VALIDATE PAYMENT ----------------

    if(amount <= 0){
      res.status(400);
      throw new Error(
        "Invalid payment amount"
      );
    }
    if(amount > fee.dueAmount){
      res.status(400);
      throw new Error(
        "Payment exceeds due amount"
      );

    }

    // ---------------- ADD PAYMENT ----------------

    fee.payments.push({
      amount,
      paymentMethod,
      transactionId,
      remarks
    });
    // ---------------- UPDATE TOTALS ----------------
    fee.paidAmount += amount;
    fee.dueAmount -= amount;
    // ---------------- UPDATE STATUS ----------------
    if(fee.dueAmount === 0){
      fee.status = "PAID";
    }else{
      fee.status = "PARTIAL";
    }
    await fee.save();
    res.status(200).json({
      success:true,
      message:
        "Payment added successfully",
      data:fee
    });

  }catch(error){

    next(error);

  }

};

// ---------------------------------------------------
// GET ALL FEES OF A BATCH
// ---------------------------------------------------

exports.getBatchFees =
async(req,res,next) => {

  try{

    const fees =
      await StudentFee.find({

        batch:req.params.batchId

      })

      .populate({
        path:"student",

        populate:{
          path:"userId",
          select:
            "fullName email"
        }
      })

      .populate(
        "batch",
        "name"
      )

      .populate(
        "course",
        "title"
      )

      .sort({
        createdAt:-1
      });

    res.status(200).json({

      success:true,

      count:fees.length,

      data:fees

    });

  }catch(error){

    next(error);

  }

};

// ---------------------------------------------------
// GET PENDING FEES
// ---------------------------------------------------

exports.getPendingFees =
async(req,res,next) => {

  try{

    const fees =
      await StudentFee.find({

        dueAmount:{
          $gt:0
        }

      })

      .populate({
        path:"student",

        populate:{
          path:"userId",
          select:
            "fullName email"
        }
      })

      .populate(
        "batch",
        "name"
      )

      .populate(
        "course",
        "title"
      )

      .sort({
        dueAmount:-1
      });

    res.status(200).json({

      success:true,

      count:fees.length,

      data:fees

    });

  }catch(error){

    next(error);

  }

};

