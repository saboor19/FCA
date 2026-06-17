"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Save, MapPin, Link2, Users, Calendar, GraduationCap, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { updateBatch } from "@/services/admin/batchService";
import AttendanceLocationPicker from "./AttendanceLocationPicker";

export default function EditBatchModal({ open, onClose, batch, refreshBatch }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    studyMode: "OFFLINE",
    roomNumber: "",
    meetingLink: "",
    startDate: "",
    endDate: "",
    capacity: 30
  });
  const [attendanceConfig, setAttendanceConfig] = useState({
    latitude: null,
    longitude: null,
    radius: 100
  });

  useEffect(() => {
    if (!batch) return;
    setFormData({
      name: batch.name || "",
      studyMode: batch.studyMode || "OFFLINE",
      roomNumber: batch.roomNumber || "",
      meetingLink: batch.meetingLink || "",
      startDate: batch.startDate?.split("T")[0] || "",
      endDate: batch.endDate?.split("T")[0] || "",
      capacity: batch.capacity || 30
    });
    setAttendanceConfig({
      latitude: batch.attendanceConfig?.latitude || null,
      longitude: batch.attendanceConfig?.longitude || null,
      radius: batch.attendanceConfig?.radius || 100
    });
  }, [batch]);

  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateBatch(batch._id, { ...formData, attendanceConfig });
      toast.success("Batch updated successfully");
      refreshBatch();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update batch");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const isOffline = formData.studyMode === "OFFLINE" || formData.studyMode === "HYBRID";
  const modeColors = {
    ONLINE: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
    OFFLINE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
    HYBRID: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400"
  };

  const fields = [
    { name: "name", label: "Batch Name", type: "text", icon: GraduationCap, placeholder: "e.g. CS-2024-A" },
    { name: "capacity", label: "Capacity", type: "number", icon: Users, min: 1, max: 500 },
    { name: "roomNumber", label: "Room Number", type: "text", icon: MapPin, placeholder: "e.g. 301-A" },
    { name: "meetingLink", label: "Meeting Link", type: "url", icon: Link2, placeholder: "https://..." },
    { name: "startDate", label: "Start Date", type: "date", icon: Calendar },
    { name: "endDate", label: "End Date", type: "date", icon: Calendar }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
         role="dialog" aria-modal="true" aria-labelledby="modal-title">
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-[var(--card)] rounded-2xl border border-[var(--border-custom)] 
                      shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-custom)] bg-[var(--muted)]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--primary)]/10">
              <GraduationCap className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-[var(--foreground)]">Edit Batch</h2>
              <p className="text-xs text-[var(--muted-foreground)]">Update batch configuration</p>
            </div>
          </div>
          <button onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[var(--muted)] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  aria-label="Close modal">
            <X className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(92vh-140px)]">
          <div className="p-6 space-y-6">
            
            {/* Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {fields.map(({ name, label, type, icon: Icon, ...rest }) => (
                <div key={name} className={`${name === "name" ? "sm:col-span-2" : ""}`}>
                  <label htmlFor={name} className="block text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-1.5">
                    {label}
                  </label>
                  <div className="relative">
                    {Icon && (
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" aria-hidden="true" />
                    )}
                    <input
                      id={name}
                      name={name}
                      type={type}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-custom)] bg-[var(--background)] 
                                 text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)]
                                 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]
                                 transition-all duration-200 disabled:opacity-50"
                      {...rest}
                    />
                  </div>
                </div>
              ))}

              {/* Study Mode Select */}
              <div>
                <label htmlFor="studyMode" className="block text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-1.5">
                  Study Mode
                </label>
                <div className="relative">
                  <select
                    id="studyMode"
                    name="studyMode"
                    value={formData.studyMode}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-[var(--border-custom)] bg-[var(--background)]
                               text-[var(--foreground)] text-sm font-medium appearance-none
                               focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]
                               transition-all duration-200 cursor-pointer"
                  >
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${modeColors[formData.studyMode]}`}>
                      {formData.studyMode}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Picker */}
            {isOffline && (
              <div className="rounded-xl border border-[var(--border-custom)] bg-[var(--muted)]/20 p-4 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-sm font-semibold text-[var(--foreground)]">Attendance Location</span>
                </div>
                <AttendanceLocationPicker
                  attendanceConfig={attendanceConfig}
                  setAttendanceConfig={setAttendanceConfig}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border-custom)] bg-[var(--muted)]/30">
            <button type="button" onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-[var(--border-custom)] text-sm font-semibold text-[var(--foreground)]
                               hover:bg-[var(--muted)] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30">
              Cancel
            </button>
            <button type="submit" disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold
                               hover:bg-[var(--primary-hover)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                               shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl hover:shadow-[var(--primary)]/30
                               transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)]">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Batch
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}