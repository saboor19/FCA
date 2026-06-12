"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "next/navigation";
import toast from "react-hot-toast";
import { 
  Briefcase, 
  BookOpen, 
  GraduationCap, 
  Phone, 
  MapPin, 
  Pencil 
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getTeacher } from "@/services/admin/teacherService";

const TeacherDetailsPage = () => {
  const params = useParams();
  const teacherId = params.id;

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTeacher = async () => {
    try {
      const data = await getTeacher(teacherId);
      setTeacher(data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch teacher"
      );
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
          <p className="text-slate-500 dark:text-slate-400">Loading teacher details...</p>
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

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6">
        
        {/* HEADER */}
        <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {teacher.userId?.fullName}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {teacher.userId?.email}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border
                ${
                  teacher.userId?.isActive
                    ? "bg-green-100 border-green-200 text-green-700 dark:bg-green-400/10 dark:border-green-400/20 dark:text-green-400"
                    : "bg-red-100 border-red-200 text-red-700 dark:bg-red-400/10 dark:border-red-400/20 dark:text-red-400"
                }
              `}
              >
                {teacher.userId?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* DETAILS CARD */}
        <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Teacher Information
            </h2>
            {/* Optional Edit Button mirroring StudentDetailsPage */}
            <a
              href={`/admin/teachers/edit/${teacherId}`}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              <Pencil size={16} />
              Edit Profile
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-3">
              <Briefcase size={18} className="text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Employee ID
                </p>
                <p className="font-medium text-foreground">
                  {teacher.employeeId}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen size={18} className="text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Specialization
                </p>
                <p className="font-medium text-foreground">
                  {teacher.specialization || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap size={18} className="text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Qualification
                </p>
                <p className="font-medium text-foreground">
                  {teacher.qualification || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} className="text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Phone
                </p>
                <p className="font-medium text-foreground">
                  {teacher.phone || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <MapPin size={18} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Address
                </p>
                <p className="font-medium text-foreground">
                  {teacher.address || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FUTURE MODULE PLACEHOLDERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-3">
              Attendance Summary
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm italic">
              Coming soon...
            </p>
          </div>

          <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-3">
              Leave Reports
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm italic">
              Coming soon...
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default TeacherDetailsPage;