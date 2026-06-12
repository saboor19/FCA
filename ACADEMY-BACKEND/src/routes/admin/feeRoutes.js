
const express = require("express");

const router = express.Router();

const {

  createStudentFee,

  getStudentFee,

  addPayment,

  getBatchFees,

  getPendingFees,getAllFees,updateStudentFee

} = require(
  "../../controllers/admin/feeController"
);

const validate = require("../../middlewares/validateMiddleware");

const {

  protect,

  authorizeRoles

} = require(
  "../../middlewares/authMiddleware"
);

const {

  createStudentFeeValidation,

  addPaymentValidation

} = require(
  "../../validations/feeValidation"
);

// ---------------------------------------------------
// CREATE FEE ACCOUNT
// ---------------------------------------------------

router.post(

  "/",

  protect,

  authorizeRoles("ADMIN"),

  validate(
    createStudentFeeValidation
  ),

  createStudentFee

);

router.get(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  getAllFees
);


// ---------------------------------------------------
// GET SINGLE FEE ACCOUNT
// ---------------------------------------------------

router.get(

  "/:id",

  protect,

  authorizeRoles("ADMIN"),

  getStudentFee

);

// ---------------------------------------------------
// UPDATE / MANAGE FEE
// ---------------------------------------------------

router.put(

  "/:id",

  protect,

  authorizeRoles("ADMIN"),

  updateStudentFee

);


// ---------------------------------------------------
// ADD PAYMENT
// ---------------------------------------------------

router.post(

  "/:id/payment",

  protect,

  authorizeRoles("ADMIN"),

  validate(
    addPaymentValidation
  ),

  addPayment

);

// ---------------------------------------------------
// GET BATCH FEES
// ---------------------------------------------------

router.get(

  "/batch/:batchId",

  protect,

  authorizeRoles("ADMIN"),

  getBatchFees

);

// ---------------------------------------------------
// GET ALL PENDING FEES
// ---------------------------------------------------

router.get(

  "/pending/all",

  protect,

  authorizeRoles("ADMIN"),

  getPendingFees

);

module.exports = router;

