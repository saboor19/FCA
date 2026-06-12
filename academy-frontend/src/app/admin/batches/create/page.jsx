"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  UserSquare2,
  BookOpen,
  Calendar,
  Users,
  Video,
  MapPin,
  Monitor,
  CheckCircle,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import api from "@/lib/api";
import { createBatch } from "@/services/admin/batchService";

export default function CreateBatchPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    teacherAssignments: [],
    studyMode: "OFFLINE",
    roomNumber: "",
    meetingLink: "",
    startDate: "",
    endDate: "",
    capacity: 30,
  });

  // Fetch courses and teachers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, teachersRes] = await Promise.all([
          api.get("/admin/courses"),
          api.get("/teachers"),
        ]);
        setCourses(coursesRes.data.data);
        setTeachers(teachersRes.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load form data");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCourseChange = (e) => {
    handleChange(e);
    const selected = courses.find((course) => course._id === e.target.value);
    setSelectedCourse(selected);
    // Reset teacher assignments when course changes
    setFormData((prev) => ({
      ...prev,
      course: e.target.value,
      teacherAssignments: [],
    }));
  };

  const addTeacherAssignment = () => {
    setFormData({
      ...formData,
      teacherAssignments: [
        ...formData.teacherAssignments,
        { teacher: "", modules: [] },
      ],
    });
  };

  const removeTeacherAssignment = (index) => {
    const updated = formData.teacherAssignments.filter((_, i) => i !== index);
    setFormData({ ...formData, teacherAssignments: updated });
  };

  const handleTeacherAssignmentChange = (index, field, value) => {
    const updated = [...formData.teacherAssignments];
    updated[index][field] = value;
    setFormData({ ...formData, teacherAssignments: updated });
  };

  const handleModuleSelection = (index, moduleId) => {
    const updated = [...formData.teacherAssignments];
    const current = updated[index].modules;
    updated[index].modules = current.includes(moduleId)
      ? current.filter((id) => id !== moduleId)
      : [...current, moduleId];
    setFormData({ ...formData, teacherAssignments: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Batch name is required");
      return;
    }
    if (!formData.course) {
      toast.error("Please select a course");
      return;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }
    if (formData.capacity < 1) {
      toast.error("Capacity must be at least 1");
      return;
    }
    if (formData.studyMode === "ONLINE" && !formData.meetingLink.trim()) {
      toast.error("Meeting link is required for online mode");
      return;
    }
    if (formData.studyMode === "OFFLINE" && !formData.roomNumber.trim()) {
      toast.error("Room number is required for offline mode");
      return;
    }

    const cleanedAssignments = formData.teacherAssignments.filter(
      (a) => a.teacher && a.modules.length > 0
    );

    try {
      setLoading(true);
      await createBatch({ ...formData, teacherAssignments: cleanedAssignments });
      toast.success("Batch created successfully!");
      router.push("/admin/batches");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Styling (theme‑aware)
  const inputStyle =
    "w-full px-4 py-2.5 rounded-xl border border-border-custom bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";
  const labelStyle = "block text-sm font-semibold text-foreground mb-1.5";

  // Custom select style (overcomes default dull look)
  const selectStyle = `${inputStyle} appearance-none bg-no-repeat bg-[right_1rem_center]`;
  const selectBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`;

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Batches
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create New Batch</h1>
          <p className="text-muted-foreground mt-1">
            Configure batch details, assign teachers, and set schedule.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Two‑column layout for basic info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column – basic batch info */}
            <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-border-custom">
                <Users size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Batch Details</h2>
              </div>

              <div>
                <label className={labelStyle}>Batch Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="e.g. Full Stack Web Development - Morning"
                />
              </div>

              <div>
                <label className={labelStyle}>Course *</label>
                <div className="relative">
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleCourseChange}
                    className={`${selectStyle} bg-card`}
                    style={{ backgroundImage: selectBg }}
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCourse && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedCourse.modules?.length || 0} modules available
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className={labelStyle}>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className={inputStyle}
                  min="1"
                />
              </div>
            </div>

            {/* Right column – mode & location */}
            <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-border-custom">
                <Monitor size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Mode & Location</h2>
              </div>

              <div>
                <label className={labelStyle}>Study Mode *</label>
                <div className="relative">
                  <select
                    name="studyMode"
                    value={formData.studyMode}
                    onChange={handleChange}
                    className={`${selectStyle} bg-card`}
                    style={{ backgroundImage: selectBg }}
                  >
                    <option value="OFFLINE">Offline (Classroom)</option>
                    <option value="ONLINE">Online (Virtual)</option>
                    <option value="HYBRID">Hybrid (Both)</option>
                  </select>
                </div>
              </div>

              {formData.studyMode !== "ONLINE" && (
                <div>
                  <label className={labelStyle}>Room Number</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      className={`${inputStyle} pl-10`}
                      placeholder="e.g. Hall A-204"
                    />
                  </div>
                </div>
              )}

              {formData.studyMode !== "OFFLINE" && (
                <div>
                  <label className={labelStyle}>Meeting Link</label>
                  <div className="relative">
                    <Video size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      name="meetingLink"
                      value={formData.meetingLink}
                      onChange={handleChange}
                      className={`${inputStyle} pl-10`}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Teacher Assignments Section */}
          <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-2 border-b border-border-custom">
              <div className="flex items-center gap-2">
                <UserSquare2 size={20} className="text-primary" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Teacher Assignments</h2>
                  <p className="text-sm text-muted-foreground">Assign teachers to specific modules</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addTeacherAssignment}
                disabled={!selectedCourse}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-custom hover:bg-muted transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Add Assignment
              </button>
            </div>

            {formData.teacherAssignments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border-custom rounded-xl">
                No teacher assignments. Click "Add Assignment" to assign teachers.
              </div>
            )}

            <div className="space-y-5">
              {formData.teacherAssignments.map((assignment, idx) => (
                <div key={idx} className="border border-border-custom rounded-xl p-5 bg-muted/20 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <UserSquare2 size={18} className="text-primary" />
                      <h3 className="font-semibold text-foreground">Assignment #{idx + 1}</h3>
                      {assignment.teacher && assignment.modules.length > 0 && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          <CheckCircle size={12} className="inline mr-1" />
                          Ready
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTeacherAssignment(idx)}
                      className="text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Teacher select */}
                    <div>
                      <label className={labelStyle}>Teacher</label>
                      <div className="relative">
                        <select
                          value={assignment.teacher}
                          onChange={(e) =>
                            handleTeacherAssignmentChange(idx, "teacher", e.target.value)
                          }
                          className={`${selectStyle} bg-card`}
                          style={{ backgroundImage: selectBg }}
                        >
                          <option value="">Select a teacher</option>
                          {teachers.map((teacher) => (
                            <option key={teacher._id} value={teacher._id}>
                              {teacher.userId?.fullName} ({teacher.employeeId})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Modules multi-select (checkbox grid) */}
                    <div>
                      <label className={labelStyle}>
                        Modules ({assignment.modules.length} selected)
                      </label>
                      <div className="max-h-48 overflow-y-auto border border-border-custom rounded-xl p-3 space-y-2 bg-card">
                        {selectedCourse?.modules?.map((module) => (
                          <label
                            key={module._id}
                            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={assignment.modules.includes(module._id)}
                              onChange={() => handleModuleSelection(idx, module._id)}
                              className="w-4 h-4 rounded border-border-custom text-primary focus:ring-primary/30"
                            />
                            <BookOpen size={14} className="text-muted-foreground" />
                            <span className="text-sm text-foreground">{module.title}</span>
                            {module.code && (
                              <span className="text-xs text-muted-foreground ml-auto">
                                {module.code}
                              </span>
                            )}
                          </label>
                        ))}
                        {(!selectedCourse?.modules || selectedCourse.modules.length === 0) && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No modules available for this course.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="sticky bottom-4 z-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {loading ? "Creating Batch..." : "Create Batch"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}