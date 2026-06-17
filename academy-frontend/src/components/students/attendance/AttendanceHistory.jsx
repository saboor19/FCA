export default function AttendanceHistory({
  attendance
}){

  return (

    <div className="rounded-xl border p-6">

      <h2 className="text-lg font-semibold mb-4">
        Recent Attendance
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">
                Date
              </th>

              <th className="text-left py-3">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {attendance
              .slice(0,10)
              .map(item => (

              <tr
                key={item._id}
                className="border-b"
              >

                <td className="py-3">

                  {
                    new Date(
                      item.date
                    ).toLocaleDateString()
                  }

                </td>

                <td className="py-3">
                  {item.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}