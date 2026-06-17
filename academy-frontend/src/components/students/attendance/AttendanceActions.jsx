import Link
from "next/link";

export default function AttendanceActions(){

  return (

    <div className="flex flex-wrap gap-4">

      <Link
        href="/student/attendance/mark"
        className="px-5 py-2 rounded-lg bg-black text-white"
      >
        Mark Attendance
      </Link>

      <Link
        href="/student/attendance/leave"
        className="px-5 py-2 rounded-lg border"
      >
        Request Leave
      </Link>

    </div>

  );

}