"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { createTeacher } from "@/services/admin/teacherService";

export default function CreateTeacherPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    employeeId: "",
    specialization: "",
    qualification: "",
    phone: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createTeacher(formData);
      toast.success("Teacher created successfully");
      router.push("/admin/teachers");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create teacher"
      );
    } finally {
      setLoading(false);
    }
  };

  // Base input styling for consistency and theme compatibility
  const inputStyles = "w-full border border-border-custom bg-transparent text-foreground placeholder:text-slate-400 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow";
  
  // Label styling
  const labelStyles = "block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <DashboardLayout role="ADMIN">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Create Teacher
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Add a new teacher to the academy.
          </p>
        </div>

        <Link
          href="/admin/teachers"
          className="flex items-center gap-2 bg-card border border-border-custom text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
        >
          <ArrowLeft size={16} />
          Back to Teachers
        </Link>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border-custom rounded-2xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6 max-w-4xl"
      >
        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}>
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="e.g. John Doe"
              className={inputStyles}
            />
          </div>

          <div>
            <label className={labelStyles}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className={inputStyles}
            />
          </div>

          <div>
            <label className={labelStyles}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className={inputStyles}
            />
          </div>

          <div>
            <label className={labelStyles}>
              Employee ID
            </label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              placeholder="e.g. EMP-001"
              className={inputStyles}
            />
          </div>

          <div>
            <label className={labelStyles}>
              Specialization
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g. Mathematics"
              className={inputStyles}
            />
          </div>

          <div>
            <label className={labelStyles}>
              Qualification
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="e.g. M.Sc., B.Ed."
              className={inputStyles}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelStyles}>
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 234 567 8900"
              className={inputStyles}
            />
          </div>
        </div>

        {/* ADDRESS */}
        <div>
          <label className={labelStyles}>
            Address
          </label>
          <textarea
            rows={4}
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter full address here..."
            className={`${inputStyles} resize-none`}
          />
        </div>

        {/* BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {loading ? "Creating..." : "Create Teacher"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}