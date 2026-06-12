"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Briefcase,
  BookOpen,
  GraduationCap,
  Phone,
  MapPin,
  Pencil,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getTeacher } from "@/services/admin/teacherService";

export default function TeacherDetailsPage() {
  const params = useParams();
  const teacherId = params.id;

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTeacher = async () => {
    try {
      const data = await getTeacher(teacherId);
      setTeacher(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch teacher");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchTeacher();
    }
  }, [teacherId]);

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Loading teacher details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!teacher) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">Teacher not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const fullName = teacher.userId?.fullName || "Unknown";
  const email = teacher.userId?.email || "No email";
  const isActive = teacher.userId?.isActive ?? true;
  const employeeId = teacher.employeeId || "N/A";
  const specialization = teacher.specialization || "Not specified";
  const qualification = teacher.qualification || "Not specified";
  const phone = teacher.phone || "Not provided";
  const address = teacher.address || "Not provided";
  const joiningDate = teacher.joiningDate
    ? new Date(teacher.joiningDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  // Placeholder stats – in a real app you would fetch these from an API
  const stats = [
    { label: "Total Batches", value: "3", icon: Calendar },
    { label: "Modules Assigned", value: "12", icon: BookOpen },
    { label: "Attendance Rate", value: "94%", icon: CheckCircle },
    { label: "Years Exp.", value: "5+", icon: Clock },
  ];

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-card border border-border-custom rounded-2xl shadow-sm overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-10">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center border-4 border-card shadow-lg">
                  <User size={40} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="mt-4 sm:mt-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {fullName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-400/10 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-400"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Joined {joiningDate}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href={`/admin/teachers/edit/${teacherId}`}
                className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border-custom text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                <Pencil size={16} />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-card border border-border-custom rounded-xl p-4 text-center shadow-sm"
            >
              <stat.icon size={20} className="text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Teacher Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column – Personal & Professional Info */}
          <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground border-b border-border-custom pb-3 mb-4">
              Professional Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase size={18} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Employee ID
                  </p>
                  <p className="font-medium text-foreground">{employeeId}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen size={18} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Specialization
                  </p>
                  <p className="font-medium text-foreground">{specialization}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap size={18} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Qualification
                  </p>
                  <p className="font-medium text-foreground">{qualification}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column – Contact Details */}
          <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground border-b border-border-custom pb-3 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Email Address
                  </p>
                  <p className="font-medium text-foreground break-all">{email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Phone Number
                  </p>
                  <p className="font-medium text-foreground">{phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Address
                  </p>
                  <p className="font-medium text-foreground">{address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections – Attendance & Leave (Placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-primary" />
              Attendance Summary
            </h3>
            <div className="flex items-center justify-center h-32 text-slate-400 dark:text-slate-500 italic text-sm">
              <span>Attendance module coming soon</span>
            </div>
          </div>
          <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Clock size={18} className="text-primary" />
              Leave Reports
            </h3>
            <div className="flex items-center justify-center h-32 text-slate-400 dark:text-slate-500 italic text-sm">
              <span>Leave management coming soon</span>
            </div>
          </div>
        </div>

        {/* Back Button (optional, for better UX) */}
        <div className="flex justify-start pt-4">
          <Link
            href="/admin/teachers"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            ← Back to Teachers
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}