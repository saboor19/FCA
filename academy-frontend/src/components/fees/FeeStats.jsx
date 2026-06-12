"use client";

import {

  IndianRupee,
  Wallet,
  AlertCircle,
  CheckCircle2,
  CalendarClock,
  CreditCard

} from "lucide-react";

// ---------------------------------------------------

export default function FeeStats({fee}){

  // ---------------------------------------------------

  const stats = [

    {

      title:"Original Fee",

      value:`₹${fee?.originalFee || 0}`,

      icon:IndianRupee,

      color:`
        text-blue-600
        bg-blue-100
      `

    },

    {

      title:"Paid Amount",

      value:`₹${fee?.paidAmount || 0}`,

      icon:Wallet,

      color:`
        text-green-600
        bg-green-100
      `

    },

    {

      title:"Due Amount",

      value:`₹${fee?.dueAmount || 0}`,

      icon:AlertCircle,

      color:`
        text-red-600
        bg-red-100
      `

    },
        {

      title:"Discount Applied",

      value:`₹${fee?.discount || 0}`,

      icon:AlertCircle,

      color:`
        text-red-600
        bg-red-100
      `

    },
        {

      title:"Final Fee",

      value:`₹${fee?.originalFee - fee?.discount|| 0}`,

      icon:AlertCircle,

      color:`
        text-red-600
        bg-red-100
      `

    },

    {

      title:"Status",

      value:fee?.status || "PENDING",

      icon:CheckCircle2,

      color:`
        text-amber-600
        bg-amber-100
      `

    }

  ];

  // ---------------------------------------------------

  return(

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3
        gap-5
      "
    >

      {

        stats.map((item,index)=>{

          const Icon = item.icon;

          return(

            <div

              key={index}

              className="
                bg-card
                border
                border-border-custom
                rounded-2xl
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >

                    {item.title}

                  </p>

                  <h3
                    className="
                      text-2xl
                      font-bold
                      mt-2
                    "
                  >

                    {item.value}

                  </h3>

                </div>

                <div
                  className={`
                    h-12
                    w-12
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    ${item.color}
                  `}
                >

                  <Icon size={22} />

                </div>

              </div>

            </div>

          );

        })

      }

      {/* EMI AMOUNT */}

      {

        fee?.paymentType === "EMI"

        &&

        <div
          className="
            bg-card
            border
            border-border-custom
            rounded-2xl
            p-5
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >

                EMI Amount

              </p>

              <h3
                className="
                  text-2xl
                  font-bold
                  mt-2
                "
              >

                ₹{fee?.emiAmount || 0}

              </h3>

            </div>

            <div
              className="
                h-12
                w-12
                rounded-xl
                flex
                items-center
                justify-center
                bg-purple-100
                text-purple-600
              "
            >

              <CreditCard size={22} />

            </div>

          </div>

        </div>

      }

      {/* NEXT DUE DATE */}

      {

        fee?.paymentType === "EMI"

        &&

        <div
          className="
            bg-card
            border
            border-border-custom
            rounded-2xl
            p-5
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >

                Next Due Date

              </p>

              <h3
                className="
                  text-xl
                  font-bold
                  mt-2
                "
              >

                {

                  fee?.nextDueDate

                  ?

                  new Date(
                    fee.nextDueDate
                  ).toLocaleDateString()

                  :

                  "--"

                }

              </h3>

            </div>

            <div
              className="
                h-12
                w-12
                rounded-xl
                flex
                items-center
                justify-center
                bg-orange-100
                text-orange-600
              "
            >

              <CalendarClock size={22} />

            </div>

          </div>

        </div>

      }

      {/* PREVIOUS INSTALLMENT */}

      {

        fee?.paymentType === "EMI"

        &&

        <div
          className="
            bg-card
            border
            border-border-custom
            rounded-2xl
            p-5
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >

                Previous Installment

              </p>

              <h3
                className="
                  text-2xl
                  font-bold
                  mt-2
                "
              >

                ₹{

                  fee?.payments?.length

                  ?

                  fee.payments[
                    fee.payments.length - 1
                  ]?.amount

                  :

                  0

                }

              </h3>

            </div>

            <div
              className="
                h-12
                w-12
                rounded-xl
                flex
                items-center
                justify-center
                bg-cyan-100
                text-cyan-600
              "
            >

              <Wallet size={22} />

            </div>

          </div>

        </div>

      }

    </div>

  );

}
