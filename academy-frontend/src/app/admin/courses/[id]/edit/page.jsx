"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  BookOpen,
  FileText,
  Clock,
  DollarSign,
  ListChecks,
  Info,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AcademyLoader from "@/components/ui/AcademyLoader";
import { getCourse, updateCourse } from "@/services/admin/courseService";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    level: "BEGINNER",
    price: "",
    modules: [],
  });

  const fetchCourse = async () => {
    try {
      const data = await getCourse(courseId);
      setFormData({
        title: data.data.title || "",
        description: data.data.description || "",
        duration: data.data.duration || "",
        level: data.data.level || "BEGINNER",
        price: data.data.price || "",
        modules: data.data.modules || [],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index][field] = value;
    setFormData({
      ...formData,
      modules: updatedModules,
    });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [
        ...formData.modules,
        {
          title: "",
          code: "",
          duration: "",
          description: "",
          order: formData.modules.length + 1,
        },
      ],
    });
  };

  const removeModule = (index) => {
    const filteredModules = formData.modules.filter((_, i) => i !== index);
    const reorderedModules = filteredModules.map((module, idx) => ({
      ...module,
      order: idx + 1,
    }));
    setFormData({
      ...formData,
      modules: reorderedModules,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const cleanedModules = formData.modules.filter(
        (module) => module.title.trim() !== ""
      );
      await updateCourse(courseId, {
        ...formData,
        modules: cleanedModules,
      });
      router.push(`/admin/courses/${courseId}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    "w-full px-4 py-2.5 rounded-xl border border-border-custom bg-card text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
  const labelStyle =
    "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

  const levelOptions = [
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "ADVANCED", label: "Advanced" },
  ];

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <AcademyLoader text="Fetching Course Details..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-5 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Course Details
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Edit Course</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Update curriculum details and module structure.
        </p>
      </div>

      {/* Two‑column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form – left column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Card */}
            <div className="bg-card border border-border-custom rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border-custom">
                <FileText size={22} className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Basic Information
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={labelStyle}>Course Title *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Full Stack Web Development"
                    value={formData.title}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className={labelStyle}>Description *</label>
                  <textarea
                    name="description"
                    placeholder="Detailed overview, learning objectives, target audience..."
                    value={formData.description}
                    onChange={handleChange}
                    className={`${inputStyle} h-36 resize-none`}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={labelStyle}>Duration *</label>
                    <input
                      type="text"
                      name="duration"
                      placeholder="e.g. 6 Months"
                      value={formData.duration}
                      onChange={handleChange}
                      className={inputStyle}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Difficulty Level *</label>
                    <div className="relative">
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className={`${inputStyle} appearance-none cursor-pointer`}
                        required
                      >
                        {levelOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelStyle}>Price (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                      <input
                        type="number"
                        name="price"
                        placeholder="e.g. 15000"
                        value={formData.price}
                        onChange={handleChange}
                        className={`${inputStyle} pl-8`}
                        min="0"
                        step="1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modules Section */}
            <div className="bg-card border border-border-custom rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-border-custom">
                <div className="flex items-center gap-2">
                  <ListChecks size={22} className="text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Course Modules
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Add, edit or remove modules in this course.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addModule}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors text-sm"
                >
                  <Plus size={16} />
                  Add Module
                </button>
              </div>

              <div className="space-y-5">
                {formData.modules.map((module, index) => (
                  <div
                    key={module._id || index}
                    className="border border-border-custom rounded-xl p-5 bg-muted/20 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-primary" />
                        <h3 className="font-semibold text-foreground">
                          Module {index + 1}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeModule(index)}
                        className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Remove module"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelStyle}>Module Title *</label>
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) =>
                            handleModuleChange(index, "title", e.target.value)
                          }
                          placeholder="e.g. Python Fundamentals"
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Module Code</label>
                        <input
                          type="text"
                          value={module.code}
                          onChange={(e) =>
                            handleModuleChange(index, "code", e.target.value)
                          }
                          placeholder="e.g. PY101"
                          className={inputStyle}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className={labelStyle}>Module Duration</label>
                      <div className="relative">
                        <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={module.duration}
                          onChange={(e) =>
                            handleModuleChange(index, "duration", e.target.value)
                          }
                          placeholder="e.g. 2 Weeks / 10 Hours"
                          className={`${inputStyle} pl-10`}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className={labelStyle}>Module Description</label>
                      <textarea
                        value={module.description}
                        onChange={(e) =>
                          handleModuleChange(index, "description", e.target.value)
                        }
                        placeholder="Brief overview of this module..."
                        className={`${inputStyle} h-24 resize-none`}
                      />
                    </div>
                  </div>
                ))}

                {formData.modules.length === 0 && (
                  <div className="text-center py-8 text-slate-400 border border-dashed border-border-custom rounded-xl">
                    No modules added. Click "Add Module" to build your curriculum.
                  </div>
                )}
              </div>
            </div>

            {/* Sticky submit button (on mobile it will be at bottom) */}
            <div className="sticky bottom-4 z-10 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex justify-center items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                {saving ? "Updating Course..." : "Update Course"}
              </button>
            </div>
          </form>
        </div>

        {/* Right sidebar – Sticky summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Info size={20} className="text-primary" />
                <h3 className="font-semibold text-foreground">Course Summary</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border-custom pb-2">
                  <span className="text-slate-500">Title</span>
                  <span className="font-medium text-foreground truncate max-w-[150px]">
                    {formData.title || "—"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border-custom pb-2">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-medium">{formData.duration || "—"}</span>
                </div>
                <div className="flex justify-between border-b border-border-custom pb-2">
                  <span className="text-slate-500">Level</span>
                  <span className="font-medium capitalize">
                    {formData.level.toLowerCase()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border-custom pb-2">
                  <span className="text-slate-500">Price</span>
                  <span className="font-medium">
                    {formData.price ? `₹${Number(formData.price).toLocaleString()}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Total Modules</span>
                  <span className="font-medium">{formData.modules.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={18} className="text-blue-600" />
                <h4 className="font-semibold text-foreground">Pricing Note</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Changing the price will affect future enrollments. Existing fee records remain unchanged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}