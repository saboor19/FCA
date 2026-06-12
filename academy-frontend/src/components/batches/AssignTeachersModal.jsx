"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Check, BookOpen, AlertCircle, UserCheck } from "lucide-react";
import { getAvailableTeachers, assignTeachers } from "@/services/admin/batchService";

export default function AssignTeachersModal({ open, onClose, batchId, refreshBatch }) {
  const [teachers, setTeachers]           = useState([]);
  const [modules, setModules]             = useState([]); // fetched from server via batch→course→modules
  const [localAssignments, setLocalAssignments] = useState([]); // [{ teacher: "", modules: [] }]
  const [loading, setLoading]             = useState(false);
  const [assigning, setAssigning]         = useState(false);
  const [error, setError]                 = useState(null);

  // ── Fetch teachers + modules together ─────────────────────
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAvailableTeachers(batchId);
      // Backend now returns: { success, data: { teachers, modules } }
      setTeachers(res.data.teachers ?? []);
      setModules(res.data.modules ?? []);
    } catch (err) {
      setError("Failed to load teachers. Please try again.");
      console.error(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && batchId) {
      fetchData();
      setLocalAssignments([]);
      setError(null);
    }
  }, [open, batchId]);

  // ── Toggle teacher selection ───────────────────────────────
  const toggleTeacher = (teacherId) => {
    setLocalAssignments((prev) => {
      const exists = prev.find((a) => a.teacher === teacherId);
      if (exists) return prev.filter((a) => a.teacher !== teacherId);
      return [...prev, { teacher: teacherId, modules: [] }];
    });
  };

  // ── Toggle a single module for a teacher ──────────────────
  const toggleModule = (teacherId, moduleId) => {
    setLocalAssignments((prev) =>
      prev.map((a) => {
        if (a.teacher !== teacherId) return a;
        const already = a.modules.some((id) => id.toString() === moduleId.toString());
        const updated = already
          ? a.modules.filter((id) => id.toString() !== moduleId.toString())
          : [...a.modules, moduleId];
        return { ...a, modules: updated };
      })
    );
  };

  // ── Select / deselect all modules for a teacher ───────────
  const toggleAllModules = (teacherId) => {
    const allIds = modules.map((m) => m._id);
    setLocalAssignments((prev) =>
      prev.map((a) => {
        if (a.teacher !== teacherId) return a;
        const allSelected = allIds.every((id) =>
          a.modules.some((m) => m.toString() === id.toString())
        );
        return { ...a, modules: allSelected ? [] : allIds };
      })
    );
  };

  // ── Derived guards ────────────────────────────────────────
  const hasSelections  = localAssignments.length > 0;
  const hasIncomplete  = localAssignments.some((a) => a.modules.length === 0);
  const canSubmit      = hasSelections && !hasIncomplete && !assigning;

  // ── Submit ────────────────────────────────────────────────
  const handleAssign = async () => {
    if (!canSubmit) return;
    try {
      setAssigning(true);
      setError(null);
      await assignTeachers(batchId, { teacherAssignments: localAssignments });
      refreshBatch();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message ?? "Assignment failed. Please try again.");
      console.error(err.response?.data);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-2xl bg-card border border-border-custom rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-custom flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <UserCheck size={20} className="text-indigo-500" />
                Assign Teachers & Modules
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-3">

              {/* Error banner */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-sm">Loading teachers…</span>
                </div>
              )}

              {/* Empty state */}
              {!loading && teachers.length === 0 && !error && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No available teachers to assign.
                </div>
              )}

              {/* Teacher cards */}
              {!loading &&
                teachers.map((teacher) => {
                  const assignment    = localAssignments.find((a) => a.teacher === teacher._id);
                  const isSelected    = !!assignment;
                  const selectedCount = assignment?.modules?.length ?? 0;
                  const allSelected   =
                    modules.length > 0 &&
                    modules.every((m) =>
                      assignment?.modules?.some((id) => id.toString() === m._id.toString())
                    );

                  return (
                    <div
                      key={teacher._id}
                      className={`border rounded-xl transition-colors ${
                        isSelected
                          ? "border-indigo-300 bg-indigo-50/40"
                          : "border-border-custom bg-card"
                      }`}
                    >
                      {/* Teacher row */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleTeacher(teacher._id)}
                      >
                        <div className="flex items-center gap-3">
                          {/* Checkbox */}
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "border-muted-foreground/40"
                            }`}
                          >
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {teacher.userId?.fullName ?? "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {teacher.userId?.email}
                            </p>
                          </div>
                        </div>

                        {/* Module count badge */}
                        {isSelected && (
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              selectedCount === 0
                                ? "bg-red-100 text-red-600"
                                : "bg-indigo-100 text-indigo-700"
                            }`}
                          >
                            {selectedCount === 0
                              ? "No modules selected"
                              : `${selectedCount} module${selectedCount > 1 ? "s" : ""}`}
                          </span>
                        )}
                      </div>

                      {/* Module picker */}
                      {isSelected && (
                        <div className="px-4 pb-4 space-y-2">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              Select modules
                            </p>
                            {modules.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleAllModules(teacher._id);
                                }}
                                className="text-xs text-indigo-600 hover:underline"
                              >
                                {allSelected ? "Deselect all" : "Select all"}
                              </button>
                            )}
                          </div>

                          {modules.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic">
                              No modules found for this course.
                            </p>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              {modules.map((mod) => {
                                const modSelected = assignment.modules.some(
                                  (id) => id.toString() === mod._id.toString()
                                );
                                return (
                                  <button
                                    key={mod._id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleModule(teacher._id, mod._id);
                                    }}
                                    className={`flex items-center gap-2 text-xs p-2.5 rounded-lg border transition-colors text-left ${
                                      modSelected
                                        ? "bg-indigo-600 border-indigo-600 text-white"
                                        : "border-border-custom hover:border-indigo-300 hover:bg-indigo-50/50"
                                    }`}
                                  >
                                    <BookOpen size={13} className="shrink-0" />
                                    <span className="truncate">{mod.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Inline warning */}
                          {selectedCount === 0 && modules.length > 0 && (
                            <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                              <AlertCircle size={13} />
                              Select at least one module to continue.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border-custom flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {hasSelections
                  ? `${localAssignments.length} teacher${localAssignments.length > 1 ? "s" : ""} selected`
                  : "No teachers selected"}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-sm border border-border-custom rounded-xl hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!canSubmit}
                  className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                >
                  {assigning ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Assigning…
                    </>
                  ) : (
                    "Confirm Assignment"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}