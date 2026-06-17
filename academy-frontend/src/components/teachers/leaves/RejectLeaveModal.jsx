"use client";

import {useState} from "react";

export default function RejectLeaveModal({
  open,
  leave,
  onClose,
  onConfirm
}){

  const [remarks,setRemarks] =
    useState("");

  if(!open || !leave)
    return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-background rounded-xl border p-6 w-full max-w-lg">

        <h2 className="text-xl font-semibold">
          Reject Leave
        </h2>

        <textarea
          rows={4}
          value={remarks}
          onChange={(e) =>
            setRemarks(
              e.target.value
            )
          }
          placeholder="Remarks"
          className="w-full border rounded-lg p-3 mt-4"
        />

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="border rounded-lg px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onConfirm(remarks)
            }
            className="rounded-lg px-4 py-2 bg-black text-white"
          >
            Reject
          </button>

        </div>

      </div>

    </div>

  );

}