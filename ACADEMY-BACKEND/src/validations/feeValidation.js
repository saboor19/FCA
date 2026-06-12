
const Joi = require("joi");

// ---------------------------------------------------
// CREATE STUDENT FEE VALIDATION
// ---------------------------------------------------

exports.createStudentFeeValidation =
Joi.object({

  student:Joi.string()
    .required(),

  batch:Joi.string()
    .required(),

  discount:Joi.number()
    .min(0)
    .default(0),

  installmentAllowed:Joi.boolean()
    .default(false),

  totalInstallments:Joi.number()
    .min(1)
    .default(1)

});

// ---------------------------------------------------
// ADD PAYMENT VALIDATION
// ---------------------------------------------------

exports.addPaymentValidation =
Joi.object({

  amount:Joi.number()
    .positive()
    .required(),

  paymentMethod:Joi.string()
    .valid(
      "CASH",
      "UPI",
      "CARD",
      "BANK_TRANSFER"
    )
    .required(),

  transactionId:Joi.string()
    .allow(""),

  remarks:Joi.string()
    .allow("")

});
