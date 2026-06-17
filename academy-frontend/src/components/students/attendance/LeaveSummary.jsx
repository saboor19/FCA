export default function LeaveSummary({
  leaveRequests
}){

  return (

    <div className="rounded-xl border p-6">

      <h2 className="text-lg font-semibold mb-4">
        Leave Requests
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div>

          <p className="text-sm text-gray-500">
            Pending
          </p>

          <h3 className="text-2xl font-bold">
            {leaveRequests?.pending || 0}
          </h3>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Approved
          </p>

          <h3 className="text-2xl font-bold">
            {leaveRequests?.approved || 0}
          </h3>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Rejected
          </p>

          <h3 className="text-2xl font-bold">
            {leaveRequests?.rejected || 0}
          </h3>

        </div>

      </div>

    </div>

  );

}