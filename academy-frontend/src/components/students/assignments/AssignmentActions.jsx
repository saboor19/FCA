"use client";



export default function AssignmentActions({

  saving,
  submitting,
  onSave,
  onSubmit

}){

  return(

    <div
      className="
        sticky
        bottom-0
        z-40
        mt-6
        flex
        flex-col
        gap-3
        rounded-t-3xl
        border
        border-slate-200
        bg-white/95
        p-4
        backdrop-blur
        dark:border-slate-800
        dark:bg-slate-900/95
        md:flex-row
        md:justify-end
      "
    >

      <button
        onClick={onSave}
        disabled={saving}
        className="
          w-full
          rounded-2xl
          border
          border-slate-300
          px-5
          py-3
          text-sm
          font-medium
          transition
          hover:bg-slate-100
          disabled:opacity-50
          dark:border-slate-700
          dark:hover:bg-slate-800
          md:w-auto
        "
      >
        {
          saving
          ? "Saving..."
          : "Save Draft"
        }
      </button>



      <button
        onClick={onSubmit}
        disabled={submitting}
        className="
          w-full
          rounded-2xl
          bg-slate-900
          px-5
          py-3
          text-sm
          font-medium
          text-white
          transition
          hover:opacity-90
          disabled:opacity-50
          dark:bg-white
          dark:text-slate-900
          md:w-auto
        "
      >
        {
          submitting
          ? "Submitting..."
          : "Submit Assignment"
        }
      </button>

    </div>

  );

}
