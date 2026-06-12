"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { User,Mail,Phone,GraduationCap,Calendar,BookOpen, Pencil } from "lucide-react";
import StudentAttendanceCard from "@/components/students/StudentAttendanceCard";
import { getStudent } from "@/services/admin/studentService";

export default function StudentDetailsPage() {
  const params = useParams();
  const studentId = params.id;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = async () => {
    try {
      const data = await getStudent(studentId);
      setStudent(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {student?.userId?.fullName}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Student Profile
            </p>
          </div>

          <Link
            href={`/admin/students/${studentId}/edit`}
            className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition"
          >
            <Pencil size={16} />
            Edit Student
          </Link>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-5">
              
              <div className="flex items-center gap-3">
                <User size={18} className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Full Name
                  </p>
                  <p className="font-medium text-foreground">
                    {student?.userId?.fullName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Email
                  </p>
                  <p className="font-medium text-foreground">
                    {student?.userId?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Phone
                  </p>
                  <p className="font-medium text-foreground">
                    {student?.phone || "-"}
                  </p>
                </div>
              </div>

            </div>

            <div className="space-y-5">
              
              <div className="flex items-center gap-3">
                <GraduationCap size={18} className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enrollment No
                  </p>
                  <p className="font-medium text-foreground">
                    {student?.enrollmentNo}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User size={18} className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Guardian
                  </p>
                  <p className="font-medium text-foreground">
                    {student?.guardianName || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Admission Date
                  </p>
                  <p className="font-medium text-foreground">
                    {student?.admissionDate 
                      ? new Date(student.admissionDate).toLocaleDateString()
                      : "-"
                    }
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* BATCHES */}
        <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5 text-foreground">
            <BookOpen size={18} className="text-slate-400" />
            <h2 className="font-semibold text-lg">
              Assigned Batches
            </h2>
          </div>

          {student?.batches?.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 italic">
              No batches assigned
            </p>
          ) : (
            <div className="space-y-3">
              {student?.batches?.map((batch) => (
                <Link
                  key={batch._id}
                  href={`/admin/batches/${batch._id}`}
                  className="block border border-border-custom rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {batch.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {batch.course?.title}
                      </p>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {batch.studyMode}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <StudentAttendanceCard
  studentId={student._id}
/>

      </div>
    </DashboardLayout>
  );
}