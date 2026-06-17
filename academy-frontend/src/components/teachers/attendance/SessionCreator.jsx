export default function SessionCreator({
  batches,
  selectedBatch,
  setSelectedBatch,
  onCreateSession
}){

  return (

    <div className="rounded-xl border p-6">

      <h2 className="text-lg font-semibold mb-4">
        Create Attendance Session
      </h2>

      <select
        value={selectedBatch}
        onChange={(e) =>
          setSelectedBatch(
            e.target.value
          )
        }
        className="w-full border rounded-lg p-3"
      >

        <option value="">
          Select Batch
        </option>

        {batches.map((batch) => (

          <option
            key={batch._id}
            value={batch._id}
          >
            {batch.name}
          </option>

        ))}

      </select>

      <button
        onClick={onCreateSession}
        disabled={!selectedBatch}
        className="mt-4 rounded-lg border px-5 py-3"
      >
        Generate Attendance Code
      </button>

    </div>

  );

}