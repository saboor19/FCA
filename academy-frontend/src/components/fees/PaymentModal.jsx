
"use client";

import { useState } from "react";

import {
  X,
  Loader2,
  IndianRupee
} from "lucide-react";

import {
  addPayment
} from "@/services/admin/feeService";

export default function PaymentModal({

  open,

  onClose,

  feeId,

  refreshFee

}){

  const [loading,setLoading] =
    useState(false);

  const [formData,setFormData] =
    useState({

      amount:"",

      paymentMethod:"CASH",

      transactionId:"",

      remarks:""

    });

  // ---------------------------------------------------

  const handleChange =
  (e)=>{

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });

  };

  // ---------------------------------------------------

  const handleSubmit =
  async(e)=>{

    e.preventDefault();

    try{

      setLoading(true);

      await addPayment(
        feeId,
        formData
      );

      await refreshFee();

      onClose();

      // reset form

      setFormData({

        amount:"",

        paymentMethod:"CASH",

        transactionId:"",

        remarks:""

      });

    }catch(error){

      console.error(error);

      alert(

        error.response?.data?.message
        ||

        "Failed to add payment"

      );

    }finally{

      setLoading(false);

    }

  };

  // ---------------------------------------------------

  if(!open) return null;

  // ---------------------------------------------------

  const inputStyle = `
    w-full
    px-4
    py-3
    rounded-xl
    border
    border-border-custom
    bg-card
    text-foreground
    placeholder:text-slate-400
    focus:outline-none
    focus:ring-2
    focus:ring-indigo-500/30
  `;

  // ---------------------------------------------------

  return(

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        p-4
      "
    >

      {/* BACKDROP */}

      <div
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-black/50
          backdrop-blur-sm
        "
      />

      {/* MODAL */}

      <div
        className="
          relative
          w-full
          max-w-lg
          bg-card
          border
          border-border-custom
          rounded-2xl
          shadow-2xl
          overflow-hidden
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            p-6
            border-b
            border-border-custom
          "
        >

          <div>

            <h2 className="text-xl font-bold text-foreground">

              Add Payment

            </h2>

            <p className="text-sm text-slate-500 mt-1">

              Record a new payment transaction.

            </p>

          </div>

          <button
            onClick={onClose}
            className="
              p-2
              rounded-lg
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-colors
            "
          >

            <X size={18} />

          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* AMOUNT */}

          <div>

            <label className="block text-sm font-medium mb-2">

              Amount

            </label>

            <div className="relative">

              <IndianRupee
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter payment amount"
                className={`${inputStyle} pl-10`}
                required
                min="1"
              />

            </div>

          </div>

          {/* METHOD */}

          <div>

            <label className="block text-sm font-medium mb-2">

              Payment Method

            </label>

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={inputStyle}
            >

              <option value="CASH">
                Cash
              </option>

              <option value="UPI">
                UPI
              </option>

              <option value="CARD">
                Card
              </option>

              <option value="BANK_TRANSFER">
                Bank Transfer
              </option>

            </select>

          </div>

          {/* TRANSACTION ID */}

          <div>

            <label className="block text-sm font-medium mb-2">

              Transaction ID

            </label>

            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              placeholder="Optional transaction reference"
              className={inputStyle}
            />

          </div>

          {/* REMARKS */}

          <div>

            <label className="block text-sm font-medium mb-2">

              Remarks

            </label>

            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Optional remarks..."
              rows={4}
              className={`${inputStyle} resize-none`}
            />

          </div>

          {/* ACTIONS */}

          <div className="flex items-center justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="
                px-5
                py-3
                rounded-xl
                border
                border-border-custom
                hover:bg-slate-100
                dark:hover:bg-slate-800
                transition-colors
              "
            >

              Cancel

            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                inline-flex
                items-center
                gap-2
                bg-slate-900
                text-white
                px-6
                py-3
                rounded-xl
                hover:bg-slate-800
                transition-colors
                disabled:opacity-70
              "
            >

              {loading ? (

                <Loader2
                  size={18}
                  className="animate-spin"
                />

              ) : null}

              {loading
                ? "Processing..."
                : "Add Payment"
              }

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

