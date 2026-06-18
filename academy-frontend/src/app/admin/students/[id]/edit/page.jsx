"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getStudent, updateStudent } from "@/services/admin/studentService";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Loader2,
  ShieldCheck
} from "lucide-react";

export default function EditStudentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    dateOfBirth: "",
    password: "",
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
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split("T")[0] : "",
        password: "",
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
      // Only send password if user entered a new one
      const payload = { ...formData };
      if (!payload.password || payload.password.trim() === "") {
        delete payload.password;
      }
      await updateStudent(id, payload);
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
          <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading student data...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const inputBase =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] " +
    "placeholder:text-[var(--muted-foreground)]/60 px-4 py-3 pl-11 " +
    "focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/50 " +
    "transition-all duration-200";

  const sectionTitle = "text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4";

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={() => router.push("/admin/students")}
              className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Students
            </button>
            <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
              Edit Student
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Update student profile and account details.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Personal Information */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className={sectionTitle}>Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputBase}
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[var(--muted-foreground)]" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputBase}
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[var(--muted-foreground)]" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputBase}
                />
              </div>

              {/* Date of Birth */}
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[var(--muted-foreground)]" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={inputBase}
                />
              </div>
            </div>

            {/* Address */}
            <div className="relative mt-5">
              <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[var(--muted-foreground)]" />
              <textarea
                name="address"
                placeholder="Residential Address"
                value={formData.address}
                onChange={handleChange}
                className={inputBase + " pl-11 pt-3 resize-none"}
                rows={3}
              />
            </div>
          </div>

          {/* Guardian Information */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className={sectionTitle}>Guardian Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <Users className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  name="guardianName"
                  placeholder="Guardian Name"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className={inputBase}
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[var(--muted-foreground)]" />
                <input
                  type="tel"
                  name="guardianPhone"
                  placeholder="Guardian Phone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  className={inputBase}
                />
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className={sectionTitle}>Account Security</h2>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] mb-5">
              <ShieldCheck className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">Password Update</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Leave blank to keep the current password unchanged. Enter a new password to reset it.
                </p>
              </div>
            </div>

            <div className="relative max-w-md">
              <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[var(--muted-foreground)]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New Password (leave blank to keep current)"
                value={formData.password}
                onChange={handleChange}
                className={inputBase + " pr-12"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/admin/students")}
              className="px-6 py-3 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--foreground)]
                hover:bg-[var(--muted)] transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-medium
                hover:bg-[var(--primary-hover)] transition-all duration-200 shadow-md shadow-[var(--primary)]/20
                disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}