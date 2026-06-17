import LeaveRequestCard
from "./LeaveRequestCard";

export default function LeaveRequestsTable({
  requests,
  onApprove,
  onReject
}){

  return (

    <>

      {/* Mobile Cards */}

      <div className="md:hidden space-y-4">

        {requests.map((request) => (

          <LeaveRequestCard
            key={request._id}
            request={request}
            onApprove={onApprove}
            onReject={onReject}
          />

        ))}

      </div>

      {/* Desktop Table */}

      <div className="hidden md:block rounded-xl border overflow-hidden">

        <table className="w-full">

          <thead>

            <tr className="border-b bg-muted/30">

              <th className="p-4 text-left">
                Student
              </th>

              <th className="p-4 text-left">
                From
              </th>

              <th className="p-4 text-left">
                To
              </th>

              <th className="p-4 text-left">
                Reason
              </th>

              <th className="p-4 text-left">
                Teacher Status
              </th>

              <th className="p-4 text-left">
                Admin Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {requests.map((request) => (

              <tr
                key={request._id}
                className="border-b"
              >

                <td className="p-4">

                  {
                    request.student?.userId?.fullName
                  }

                </td>

                <td className="p-4">

                  {
                    new Date(
                      request.fromDate
                    ).toLocaleDateString()
                  }

                </td>

                <td className="p-4">

                  {
                    new Date(
                      request.toDate
                    ).toLocaleDateString()
                  }

                </td>

                <td className="p-4 max-w-xs truncate">

                  {request.reason}

                </td>

                <td className="p-4">

                  {request.teacherStatus}

                </td>

                <td className="p-4">

                  {request.adminStatus}

                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        onApprove(request)
                      }
                      className="rounded-lg border px-3 py-2"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        onReject(request)
                      }
                      className="rounded-lg border px-3 py-2"
                    >
                      Reject
                    </button>

                  </div>

                </td>

              </tr>

            ))}

            {requests.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  className="p-8 text-center text-muted-foreground"
                >
                  No pending leave requests found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </>

  );

}