"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  UserPlus,
  User,
  SearchX,
  Check,
  Search,
  XCircle,
  CheckSquare,
  Square
} from "lucide-react";

import { assignStudents } from "@/services/admin/batchService";
import { getAvailableStudents } from "@/services/admin/studentService";

export default function AssignStudentsModal({
  open,
  onClose,
  batchId,
  refreshBatch
}) {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      fetchStudents();
      setSelectedStudents([]);
      setSearchQuery("");
    }
  }, [open]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getAvailableStudents(batchId);
      // Sort by recency (newest first)
      const sorted = [...(data.data || [])].sort((a, b) => {
        const dateA = a.createdAt || a.admissionDate;
        const dateB = b.createdAt || b.admissionDate;
        return new Date(dateB) - new Date(dateA);
      });
      setStudents(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase().trim();
    return students.filter((student) => {
      const fullName = student.userId?.fullName?.toLowerCase() || "";
      const email = student.userId?.email?.toLowerCase() || "";
      const enrollmentNo = student.enrollmentNo?.toLowerCase() || "";
      return fullName.includes(query) || email.includes(query) || enrollmentNo.includes(query);
    });
  }, [students, searchQuery]);

  const handleSelect = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      }
      return [...prev, studentId];
    });
  };

  // Select all currently FILTERED students
  const handleSelectAll = () => {
    const allFilteredIds = filteredStudents.map(s => s._id);
    setSelectedStudents(allFilteredIds);
  };

  // Deselect all currently FILTERED students
  const handleDeselectAll = () => {
    const allFilteredIds = filteredStudents.map(s => s._id);
    setSelectedStudents(prev => prev.filter(id => !allFilteredIds.includes(id)));
  };

  // Check if all filtered students are selected
  const allSelected = filteredStudents.length > 0 && 
    filteredStudents.every(s => selectedStudents.includes(s._id));

  const handleAssign = async () => {
    if (selectedStudents.length === 0) {
      alert("Select at least one student");
      return;
    }
    try {
      setSaving(true);
      await assignStudents(batchId, selectedStudents);
      await refreshBatch();
      onClose();
      setSelectedStudents([]);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to assign students");
    } finally {
      setSaving(false);
    }
  };

  const clearSearch = () => setSearchQuery("");

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* MODAL PANEL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative w-full max-w-2xl bg-card border border-border-custom rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-border-custom bg-card/50">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Assign Students
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Select available students to add to this batch.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* SEARCH BAR + Select/Deselect buttons */}
            <div className="px-6 pt-4 pb-2 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email, or enrollment number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border-custom bg-card text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <XCircle size={18} />
                  </button>
                )}
              </div>

              {/* Select / Deselect row */}
              {!loading && filteredStudents.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Showing {filteredStudents.length} of {students.length} students
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 px-3 py-1 rounded-lg border border-border-custom hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <CheckSquare size={14} />
                      Select All
                    </button>
                    <button
                      onClick={handleDeselectAll}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 px-3 py-1 rounded-lg border border-border-custom hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Square size={14} />
                      Deselect All
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="px-6 pb-6 overflow-y-auto flex-1 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Loader2 className="animate-spin mb-4 text-slate-900 dark:text-slate-100" size={32} />
                  <p className="text-sm font-medium">Fetching available students...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-400 border border-border-custom">
                    <SearchX size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">No Students Found</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                    {searchQuery
                      ? "No students match your search criteria."
                      : "All students are currently assigned, or there are no available profiles."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredStudents.map((student) => {
                    const isSelected = selectedStudents.includes(student._id);
                    return (
                      <div
                        key={student._id}
                        onClick={() => handleSelect(student._id)}
                        className={`group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/50 ring-1 ring-slate-900 dark:ring-slate-100"
                            : "border-border-custom bg-transparent hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">
                              {student.userId?.fullName || "Unknown"}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                                {student.enrollmentNo || "N/A"}
                              </span>
                              <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                                {student.userId?.email}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Custom Checkbox */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-slate-900 border-slate-900 dark:bg-slate-100 dark:border-slate-100 text-white dark:text-slate-900"
                            : "border-slate-300 dark:border-slate-600 group-hover:border-slate-400"
                        }`}>
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Check size={14} strokeWidth={3} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="px-6 py-5 border-t border-border-custom bg-slate-50/50 dark:bg-slate-900/20 flex justify-end gap-3 shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-medium border border-border-custom text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={saving || selectedStudents.length === 0}
                className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-slate-200"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <UserPlus size={18} />
                )}
                {saving ? "Assigning..." : `Assign (${selectedStudents.length})`}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}