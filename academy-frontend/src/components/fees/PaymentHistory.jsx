
export default function PaymentHistory({

  payments = []

}){

  return(

    <div
      className="
        bg-card
        border
        border-border-custom
        rounded-2xl
        overflow-hidden
      "
    >

      {/* HEADER */}

      <div
        className="
          p-6
          border-b
          border-border-custom
        "
      >

        <h2 className="text-lg font-semibold text-foreground">

          Payment History

        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">

          Complete financial transaction history.

        </p>

      </div>

      {/* EMPTY STATE */}

      {payments.length === 0 ? (

        <div
          className="
            p-12
            text-center
            text-slate-500
            dark:text-slate-400
          "
        >

          No payments recorded yet.

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full">

            {/* TABLE HEAD */}

            <thead
              className="
                bg-slate-50
                dark:bg-slate-900
              "
            >

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">

                  Amount

                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">

                  Method

                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">

                  Date

                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">

                  Transaction ID

                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">

                  Remarks

                </th>

              </tr>

            </thead>

            {/* TABLE BODY */}

            <tbody>

              {payments.map((payment)=>(

                <tr
                  key={payment._id}
                  className="
                    border-t
                    border-border-custom
                    hover:bg-slate-50
                    dark:hover:bg-slate-900/40
                    transition-colors
                  "
                >

                  {/* AMOUNT */}

                  <td
                    className="
                      px-6
                      py-4
                      font-semibold
                      text-green-600
                      dark:text-green-400
                    "
                  >

                    ₹{payment.amount}

                  </td>

                  {/* METHOD */}

                  <td className="px-6 py-4">

                    <span
                      className="
                        inline-flex
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                        bg-slate-100
                        dark:bg-slate-800
                      "
                    >

                      {payment.paymentMethod}

                    </span>

                  </td>

                  {/* DATE */}

                  <td className="px-6 py-4 text-sm">

                    {
                      new Date(
                        payment.paymentDate
                      ).toLocaleDateString()
                    }

                  </td>

                  {/* TRANSACTION */}

                  <td className="px-6 py-4 text-sm">

                    {
                      payment.transactionId
                      || "-"
                    }

                  </td>

                  {/* REMARKS */}

                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">

                    {
                      payment.remarks
                      || "-"
                    }

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}

