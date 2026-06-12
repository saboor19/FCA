"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Pencil,
  Loader2,
  ArrowLeft,
  Save,
  Send,
  Paperclip,
  Plus,
  Trash2,
  Link as LinkIcon
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AcademyLoader from "@/components/ui/AcademyLoader";

import { getNotice, updateNotice } from "@/services/admin/noticeService";
import { getBatches } from "@/services/admin/batchService";

export default function EditNoticePage() {
  const params = useParams();
  const router = useRouter();
  
  // Handle Next.js params array edge case
  const noticeId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableBatches, setAvailableBatches] = useState([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "GENERAL",
    priority: "MEDIUM",
    targetAudience: "ALL",
    batches: [], 
    isPublished: true, 
    publishDate: "",
    expiryDate: "",
    attachments: [] // Added attachments array
  });

  // State for adding a new attachment link
  const [newAttachment, setNewAttachment] = useState({ fileName: "", fileUrl: "" });

  // Helper to safely format ISO dates for datetime-local HTML inputs
  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!noticeId) return;
      try {
        setLoading(true);
        // Fetch notice and batches in parallel
        const [noticeRes, batchesRes] = await Promise.all([
          getNotice(noticeId),
          getBatches()
        ]);

        const notice = noticeRes.data;
        setAvailableBatches(batchesRes.data || []);

        setFormData({
          title: notice.title || "",
          description: notice.description || "",
          type: notice.type || "GENERAL",
          priority: notice.priority || "MEDIUM",
          targetAudience: notice.targetAudience || "ALL",
          batches: notice.batches?.map(b => b._id || b) || [],
          isPublished: notice.isPublished ?? true,
          publishDate: formatDateTimeLocal(notice.publishDate),
          expiryDate: formatDateTimeLocal(notice.expiryDate),
          attachments: notice.attachments || []
        });

      } catch (error) {
        console.error("Failed to load notice data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [noticeId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleBatchSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setFormData({ ...formData, batches: selectedOptions });
  };

  // --- Attachment Handlers ---
  const handleAddAttachment = () => {
    if (newAttachment.fileName && newAttachment.fileUrl) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment]
      }));
      setNewAttachment({ fileName: "", fileUrl: "" }); // Reset input
    }
  };

  const handleRemoveAttachment = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateNotice(noticeId, formData);
      router.push(`/admin/notices/${noticeId}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update notice");
    } finally {
      setSaving(false);
    }
  };

  // Base styling variables
  const inputStyle = "w-full px-4 py-3 rounded-xl border border-border-custom bg-transparent text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow";
  const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <AcademyLoader text="Fetching Notice Data..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-4xl mx-auto pb-12">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-6 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Notice
        </button>

        <div className="bg-card border border-border-custom rounded-2xl shadow-sm p-6 md:p-8">
          
          {/* HEADER */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3 text-foreground mb-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Pencil size={24} />
                </div>
                Edit Notice
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Update the details, audience, or status of this announcement.
              </p>
            </div>
            
            {/* Draft Toggle */}
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-900/50 border border-border-custom rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {formData.isPublished ? "Live Status: Published" : "Live Status: Draft"}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${formData.isPublished ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isPublished ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* TITLE */}
            <div>
              <label className={labelStyle}>Notice Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className={labelStyle}>Description / Content</label>
              <textarea
                rows={6}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className={`${inputStyle} resize-none`}
              />
            </div>

            {/* TYPE + PRIORITY ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Notice Type</label>
                <div className="relative">
                  <select name="type" value={formData.type} onChange={handleChange} className={`${inputStyle} appearance-none cursor-pointer`}>
                    <option value="GENERAL" className="bg-background text-foreground">General</option>
                    <option value="ACADEMIC" className="bg-background text-foreground">Academic</option>
                    <option value="EXAM" className="bg-background text-foreground">Exam</option>
                    <option value="HOLIDAY" className="bg-background text-foreground">Holiday</option>
                    <option value="EVENT" className="bg-background text-foreground">Event</option>
                    <option value="FEE" className="bg-background text-foreground">Fee</option>
                    <option value="URGENT" className="bg-background text-foreground">Urgent</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelStyle}>Priority Level</label>
                <div className="relative">
                  <select name="priority" value={formData.priority} onChange={handleChange} className={`${inputStyle} appearance-none cursor-pointer`}>
                    <option value="LOW" className="bg-background text-foreground">Low</option>
                    <option value="MEDIUM" className="bg-background text-foreground">Medium</option>
                    <option value="HIGH" className="bg-background text-foreground">High</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* AUDIENCE ROW */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900/30 border border-border-custom rounded-xl space-y-4">
              <div>
                <label className={labelStyle}>Target Audience</label>
                <div className="relative">
                  <select name="targetAudience" value={formData.targetAudience} onChange={handleChange} className={`${inputStyle} appearance-none cursor-pointer bg-card`}>
                    <option value="ALL" className="bg-background text-foreground">All Academy</option>
                    <option value="STUDENTS" className="bg-background text-foreground">All Students</option>
                    <option value="TEACHERS" className="bg-background text-foreground">All Teachers</option>
                    <option value="STAFF" className="bg-background text-foreground">All Staff</option>
                    <option value="BATCH" className="bg-background text-foreground">Specific Batch(es)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              {/* Conditional Batch Selector */}
              {formData.targetAudience === "BATCH" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className={labelStyle}>Select Batches</label>
                  <select
                    multiple
                    name="batches"
                    value={formData.batches}
                    onChange={handleBatchSelect}
                    className={`${inputStyle} h-32 bg-card`}
                    required
                  >
                    {availableBatches.map(batch => (
                      <option key={batch._id} value={batch._id} className="p-2 mb-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                        {batch.name} ({batch.course?.title || "No Course"})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-2">Hold Ctrl (Windows) or Cmd (Mac) to select multiple batches.</p>
                </div>
              )}
            </div>

            {/* DATES ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Publish Date (Optional)</label>
                <input
                  type="datetime-local"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleChange}
                  className={inputStyle}
                  style={{ colorScheme: "var(--background) === '#ffffff' ? 'light' : 'dark'" }}
                />
              </div>

              <div>
                <label className={labelStyle}>Expiry Date (Optional)</label>
                <input
                  type="datetime-local"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className={inputStyle}
                  style={{ colorScheme: "var(--background) === '#ffffff' ? 'light' : 'dark'" }}
                />
              </div>
            </div>

            {/* ATTACHMENTS SECTION */}
            <div className="p-5 border border-border-custom rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Paperclip size={16} /> Attachments
                </label>
                <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                  {formData.attachments.length} Files
                </span>
              </div>

              {/* Current Attachments List */}
              {formData.attachments.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {formData.attachments.map((file, idx) => (
                    <li key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/40 border border-border-custom rounded-lg group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <LinkIcon size={14} className="text-slate-400 shrink-0" />
                        <span className="text-sm font-medium text-foreground truncate">
                          {file.fileName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                        title="Remove Attachment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add New Attachment Form (Sub-form) */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border-custom border-dashed">
                <input
                  type="text"
                  placeholder="Display Name (e.g., Syllabus PDF)"
                  value={newAttachment.fileName}
                  onChange={(e) => setNewAttachment({ ...newAttachment, fileName: e.target.value })}
                  className={`${inputStyle} sm:w-1/3 py-2 text-sm`}
                />
                <input
                  type="url"
                  placeholder="File URL (https://...)"
                  value={newAttachment.fileUrl}
                  onChange={(e) => setNewAttachment({ ...newAttachment, fileUrl: e.target.value })}
                  className={`${inputStyle} sm:flex-1 py-2 text-sm`}
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  disabled={!newAttachment.fileName || !newAttachment.fileUrl}
                  className="flex items-center justify-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="pt-6 border-t border-border-custom">
              <button
                type="submit"
                disabled={saving}
                className={`w-full flex items-center justify-center gap-2 text-white dark:text-slate-900 py-3.5 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm ${formData.isPublished ? "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200" : "bg-slate-600 hover:bg-slate-700 dark:bg-slate-400 dark:hover:bg-slate-500"}`}
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : formData.isPublished ? (
                  <Send className="w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saving ? "Updating Notice..." : formData.isPublished ? "Update & Publish" : "Update Draft"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}