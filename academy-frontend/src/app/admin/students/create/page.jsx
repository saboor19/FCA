"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { createStudent } from "@/services/admin/studentService";

export default function CreateStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    enrollmentNo: "",
    phone: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    dateOfBirth: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createStudent(formData);
      router.push("/admin/students");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  // Base input styling for consistency across text inputs and textareas
  const inputStyles =
    "w-full border border-border-custom bg-transparent text-foreground placeholder:text-slate-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow";

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Create Student
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Add a new student profile.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border-custom rounded-2xl p-6 space-y-6 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className={inputStyles}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={inputStyles}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={inputStyles}
              required
            />

            <input
              type="text"
              name="enrollmentNo"
              placeholder="Enrollment Number"
              value={formData.enrollmentNo}
              onChange={handleChange}
              className={inputStyles}
              required
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
              style={{
                colorScheme: "var(--background) === '#ffffff' ? 'light' : 'dark'",
              }} // Helps native date picker adapt
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
              disabled={loading}
              className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}