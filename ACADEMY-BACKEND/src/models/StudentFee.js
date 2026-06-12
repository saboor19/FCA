
const mongoose = require("mongoose");

// --------------------------------------------------
// PAYMENT SCHEMA
// --------------------------------------------------

const paymentSchema =
new mongoose.Schema({

  amount:{
    type:Number,
    required:true
  },

  paymentDate:{
    type:Date,
    default:Date.now
  },

  paymentMethod:{
    type:String,

    enum:[
      "CASH",
      "UPI",
      "CARD",
      "BANK_TRANSFER"
    ],

    required:true
  },

  transactionId:{
    type:String
  },

  remarks:{
    type:String
  }

},
{
  _id:true
});

// --------------------------------------------------
// STUDENT FEE SCHEMA
// --------------------------------------------------

const studentFeeSchema =
new mongoose.Schema({

  // --------------------------------------------------
  // STUDENT
  // --------------------------------------------------

  student:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Student",
    required:true
  },

  // --------------------------------------------------
  // BATCH
  // --------------------------------------------------

  batch:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Batch",
    required:true
  },

  // --------------------------------------------------
  // COURSE
  // --------------------------------------------------

  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
    required:true
  },

  // --------------------------------------------------
  // ORIGINAL COURSE FEE
  // --------------------------------------------------

  originalFee:{
    type:Number,
    required:true
  },

  // --------------------------------------------------
  // DISCOUNT
  // --------------------------------------------------

  discount:{
    type:Number,
    default:0
  },

  // --------------------------------------------------
  // FINAL PAYABLE FEE
  // --------------------------------------------------

  finalFee:{
    type:Number,
    required:true
  },

  // --------------------------------------------------
  // TOTAL PAID AMOUNT
  // --------------------------------------------------

  paidAmount:{
    type:Number,
    default:0
  },

  // --------------------------------------------------
  // REMAINING DUE AMOUNT
  // --------------------------------------------------

  dueAmount:{
    type:Number,
    default:0
  },

  // --------------------------------------------------
  // PAYMENT STATUS
  // --------------------------------------------------

  status:{
    type:String,

    enum:[
      "PENDING",
      "PARTIAL",
      "PAID",
      "OVERDUE"
    ],

    default:"PENDING"
  },

  // --------------------------------------------------
  // PAYMENT TYPE
  // --------------------------------------------------

  paymentType:{
    type:String,

    enum:[
      "FULL",
      "EMI"
    ],

    default:"FULL"
  },

  // --------------------------------------------------
  // COURSE DURATION (MONTHS)
  // --------------------------------------------------

  courseDurationMonths:{
    type:Number,
    default:1
  },

  // --------------------------------------------------
  // EMI AMOUNT
  // --------------------------------------------------

  emiAmount:{
    type:Number,
    default:0
  },

  // --------------------------------------------------
  // NEXT EMI DUE DATE
  // --------------------------------------------------

  nextDueDate:{
    type:Date
  },

  // --------------------------------------------------
  // LAST PAYMENT DATE
  // --------------------------------------------------

  lastPaymentDate:{
    type:Date
  },

  // --------------------------------------------------
  // INSTALLMENT SUPPORT
  // --------------------------------------------------

  installmentAllowed:{
    type:Boolean,
    default:false
  },

  totalInstallments:{
    type:Number,
    default:1
  },

  // --------------------------------------------------
  // PAYMENT HISTORY
  // --------------------------------------------------

  payments:[
    paymentSchema
  ]

},
{
  timestamps:true
});

// --------------------------------------------------
// INDEXES
// --------------------------------------------------

// One fee account per student per batch

studentFeeSchema.index(
  {
    student:1,
    batch:1
  },
  {
    unique:true
  }
);

module.exports =
mongoose.model(
  "StudentFee",
  studentFeeSchema
);
