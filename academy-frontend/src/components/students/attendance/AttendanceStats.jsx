export default function AttendanceStats({
  stats
}){

  return (

    <div className="grid gap-4 md:grid-cols-5">

      <div className="rounded-xl border p-4">

        <p className="text-sm text-gray-500">
          Attendance %
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {stats?.percentage || 0}%
        </h2>

      </div>

      <div className="rounded-xl border p-4">

        <p className="text-sm text-gray-500">
          Total
        </p>

        <h2 className="text-2xl font-semibold">
          {stats?.total || 0}
        </h2>

      </div>

      <div className="rounded-xl border p-4">

        <p className="text-sm text-gray-500">
          Present
        </p>

        <h2 className="text-2xl font-semibold">
          {stats?.present || 0}
        </h2>

      </div>

      <div className="rounded-xl border p-4">

        <p className="text-sm text-gray-500">
          Absent
        </p>

        <h2 className="text-2xl font-semibold">
          {stats?.absent || 0}
        </h2>

      </div>

      <div className="rounded-xl border p-4">

        <p className="text-sm text-gray-500">
          Leave
        </p>

        <h2 className="text-2xl font-semibold">
          {stats?.leave || 0}
        </h2>

      </div>

    </div>

  );

}