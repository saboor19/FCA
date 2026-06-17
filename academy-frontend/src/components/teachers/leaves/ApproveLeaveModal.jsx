export default function ApproveLeaveModal({
  open,
  leave,
  onClose,
  onConfirm
}){

  if(!open || !leave)
    return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-background rounded-xl border p-6 w-full max-w-md">

        <h2 className="text-xl font-semibold">
          Approve Leave
        </h2>

        <p className="mt-3 text-sm text-gray-500">
          Approve this leave request?
        </p>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="border rounded-lg px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg px-4 py-2 bg-black text-white"
          >
            Approve
          </button>

        </div>

      </div>

    </div>

  );

}