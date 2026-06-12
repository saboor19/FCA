"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getStudent, updateStudent } from "@/services/admin/studentService";

export default function EditStudentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const response = await getStudent(id);
      const student = response.data;

      setFormData({
        name: student.userId?.name || "",
        email: student.userId?.email || "",
        phone: student.phone || "",
        address: student.address || "",
        guardianName: student.guardianName || "",
        guardianPhone: student.guardianPhone || "",
        dateOfBirth: student.dateOfBirth
          ? student.dateOfBirth.split("T")[0]
          : "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await updateStudent(id, formData);
      router.push("/admin/students");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update student");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">Loading student data...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Base input styling for consistency across text inputs and textareas
  const inputStyles = "w-full border border-border-custom bg-transparent text-foreground placeholder:text-slate-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow";

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Edit Student
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Update student details.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border-custom rounded-2xl p-6 space-y-6 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name} // Fixed from formData.fullName to match state
              onChange={handleChange}
              className={inputStyles}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={inputStyles}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputStyles}
            />

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={inputStyles}
              style={{ colorScheme: "var(--background) === '#ffffff' ? 'light' : 'dark'" }} // Helps native date picker adapt
            />

            <input
              type="text"
              name="guardianName"
              placeholder="Guardian Name"
              value={formData.guardianName}
              onChange={handleChange}
              className={inputStyles}
            />

            <input
              type="text"
              name="guardianPhone"
              placeholder="Guardian Phone"
              value={formData.guardianPhone}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className={inputStyles}
            rows={4}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Update Student"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}