export default function LeaveRequestCard({
  request,
  onApprove,
  onReject
}){

  return (

    <div className="rounded-xl border p-4 space-y-4">

      <div>

        <h3 className="font-semibold">
          {
            request.student?.userId?.fullName
          }
        </h3>

        <p className="text-sm text-muted-foreground">
          {
            request.student?.userId?.email
          }
        </p>

      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">

        <div>

          <p className="text-muted-foreground">
            From
          </p>

          <p>
            {
              new Date(
                request.fromDate
              ).toLocaleDateString()
            }
          </p>

        </div>

        <div>

          <p className="text-muted-foreground">
            To
          </p>

          <p>
            {
              new Date(
                request.toDate
              ).toLocaleDateString()
            }
          </p>

        </div>

      </div>

      <div>

        <p className="text-sm text-muted-foreground mb-1">
          Reason
        </p>

        <p className="text-sm">
          {request.reason}
        </p>

      </div>

      <div className="flex items-center gap-2">

        <span className="text-xs rounded-full border px-3 py-1">

          Teacher:
          {" "}
          {request.teacherStatus}

        </span>

        <span className="text-xs rounded-full border px-3 py-1">

          Admin:
          {" "}
          {request.adminStatus}

        </span>

      </div>

      <div className="flex gap-2">

        <button
          onClick={() =>
            onApprove(request)
          }
          className="flex-1 rounded-lg border px-4 py-2"
        >
          Approve
        </button>

        <button
          onClick={() =>
            onReject(request)
          }
          className="flex-1 rounded-lg border px-4 py-2"
        >
          Reject
        </button>

      </div>

    </div>

  );

}