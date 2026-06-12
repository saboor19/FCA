
"use client";

import { useState } from "react";

import {

  X,
  CreditCard,
  BadgeIndianRupee

} from "lucide-react";

import { updateFee }
from "@/services/admin/feeService";

export default function ManageFeeModal({

  open,

  onClose,

  fee,

  refreshFee

}){

  const [loading,setLoading] =
    useState(false);

  const [formData,setFormData] =
    useState({

      discount:
        fee?.discount || 0,

      paymentType:
        fee?.paymentType || "FULL"

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

      await updateFee(

        fee._id,

        formData

      );

      await refreshFee();

      onClose();

    }catch(error){

      console.error(error);

    }finally{

      setLoading(false);

    }

  };

  // ---------------------------------------------------

  if(!open) return null;

  // ---------------------------------------------------

  const previewFinalFee =
    fee.originalFee -
    Number(formData.discount || 0);

  // ---------------------------------------------------

  const previewEMI =

    formData.paymentType === "EMI"

    ?

    Math.ceil(

      previewFinalFee /

      (fee.courseDurationMonths || 1)

    )

    :

    0;

  // ---------------------------------------------------

  return(

    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/40
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-xl
          bg-card
          rounded-3xl
          border
          border-border-custom
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
            px-6
            py-5
            border-b
            border-border-custom
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
              "
            >

              Manage Fee

            </h2>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >

              Configure fee structure
              and payment model.

            </p>

          </div>

          <button
            onClick={onClose}
          >

            <X size={22} />

          </button>

        </div>

        {/* BODY */}

        <form
          onSubmit={handleSubmit}
          className="
            p-6
            space-y-6
          "
        >

          {/* DISCOUNT */}

          <div>

            <label
              className="
                text-sm
                font-medium
              "
            >

              Discount

            </label>

            <div
              className="
                mt-2
                relative
              "
            >

              <BadgeIndianRupee
                size={18}
                className="
                  absolute
                  left-3
                  top-3.5
                  text-slate-400
                "
              />

              <input

                type="number"

                name="discount"

                value={
                  formData.discount
                }

                onChange={
                  handleChange
                }

                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  rounded-xl
                  border
                  border-border-custom
                  bg-background
                  outline-none
                "

              />

            </div>

          </div>

          {/* PAYMENT TYPE */}

          <div>

            <label
              className="
                text-sm
                font-medium
              "
            >

              Payment Type

            </label>

            <select

              name="paymentType"

              value={
                formData.paymentType
              }

              onChange={
                handleChange
              }

              className="
                w-full
                mt-2
                px-4
                py-3
                rounded-xl
                border
                border-border-custom
                bg-background
                outline-none
              "
            >

              <option value="FULL">

                Full Payment

              </option>

              <option value="EMI">

                EMI

              </option>

            </select>

          </div>

          {/* PREVIEW */}

          <div
            className="
              bg-slate-50
              dark:bg-slate-900
              rounded-2xl
              p-5
              border
              border-border-custom
              space-y-3
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <span
                className="
                  text-slate-500
                "
              >

                Original Fee

              </span>

              <span
                className="
                  font-semibold
                "
              >

                ₹{fee.originalFee}

              </span>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <span
                className="
                  text-slate-500
                "
              >

                Final Fee

              </span>

              <span
                className="
                  font-semibold
                "
              >

                ₹{previewFinalFee}

              </span>

            </div>

            {

              formData.paymentType
              === "EMI"

              &&

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    text-slate-500
                  "
                >

                  Monthly EMI

                </span>

                <span
                  className="
                    font-semibold
                    text-primary
                  "
                >

                  ₹{previewEMI}

                </span>

              </div>

            }

          </div>

          {/* ACTIONS */}

          <div
            className="
              flex
              justify-end
              gap-3
            "
          >

            <button

              type="button"

              onClick={onClose}

              className="
                px-5
                py-3
                rounded-xl
                border
                border-border-custom
              "

            >

              Cancel

            </button>

            <button

              type="submit"

              disabled={loading}

              className="
                px-6
                py-3
                rounded-xl
                bg-slate-900
                text-white
                hover:bg-slate-800
                transition-colors
              "

            >

              {

                loading

                ?

                "Saving..."

                :

                "Save Changes"

              }

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}
