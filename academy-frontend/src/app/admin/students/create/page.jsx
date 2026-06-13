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

  // Clean, theme‑aware input style
  const inputStyles =
    "w-full border border-border-custom bg-transparent text-foreground placeholder:text-muted-foreground rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow";

  return (
    <DashboardLayout role="ADMIN">
      {/* Wider container – uses available space, reads well on large screens */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Create Student
          </h1>
          <p className="text-muted-foreground">
            Add a new student profile to the system.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border-custom rounded-2xl p-8 shadow-sm space-y-8"
        >
          {/* Two‑column grid on larger screens, full width on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
              placeholder="Email address"
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
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className={inputStyles}
            />

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`${inputStyles} dark:[color-scheme:dark]`}
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

          {/* Address spans full width */}
          <textarea
            name="address"
            placeholder="Full address"
            value={formData.address}
            onChange={handleChange}
            className={inputStyles}
            rows={4}
          />

          {/* Action button – aligned right, theme primary colour */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-primary/20"
            >
              {loading ? "Creating..." : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}