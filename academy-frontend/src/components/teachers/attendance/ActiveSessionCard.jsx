import SessionTimer
from "./SessionTimer";

export default function ActiveSessionCard({
  session,
  onCloseSession
}){

  const copyCode = () => {

    navigator.clipboard.writeText(
      session.attendanceCode
    );

  };

  return (

    <div className="rounded-xl border p-6">

      <h2 className="text-lg font-semibold">
        Active Session
      </h2>

      <div className="mt-4">

        <p className="text-sm text-muted-foreground">
          Attendance Code
        </p>

        <h3 className="text-4xl font-bold mt-2">
          {session.attendanceCode}
        </h3>

      </div>

      <div className="mt-6">

        <SessionTimer
          expiresAt={session.expiresAt}
        />

      </div>

      <div className="flex gap-3 mt-6">

        <button
          onClick={copyCode}
          className="rounded-lg border px-4 py-2"
        >
          Copy Code
        </button>

        <button
          onClick={onCloseSession}
          className="rounded-lg border px-4 py-2"
        >
          Close Session
        </button>

      </div>

    </div>

  );

}