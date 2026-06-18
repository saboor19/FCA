"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AttendanceModeCard from "@/components/students/attendance/AttendanceModeCard";
import OnlineAttendanceForm from "@/components/students/attendance/OnlineAttendanceForm";
import OfflineAttendanceCard from "@/components/students/attendance/OfflineAttendanceCard";
import AttendanceSuccess from "@/components/students/attendance/AttendanceSuccess";
import {
  getCurrentBatch,
  markOnlineAttendance,
  markOfflineAttendance
} from "@/services/student/attendanceService";
import { cn } from "@/lib/utils";

export default function MarkAttendancePage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const response = await getCurrentBatch();
      
      // Handle both old (single batch) and new (array) response formats
      const batchData = response.batches || (response.batch ? [response.batch] : []);
      setBatches(batchData);
      
      // Auto-select first batch if only one exists
      if (batchData.length === 1) {
        setSelectedBatch(batchData[0]);
      }
    } catch (error) {
      console.error("Failed to load batches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setSuccess(false); // Reset success state when switching batches
  };

  const handleOnlineAttendance = async (code) => {
    if (!selectedBatch) {
      alert("Please select a batch first");
      return;
    }

    try {
      await markOnlineAttendance({
        code,
        batchId: selectedBatch._id // Pass batch ID if API requires it
      });
      setSuccess(true);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to mark attendance");
    }
  };

  const handleOfflineAttendance = async () => {
    if (!selectedBatch) {
      alert("Please select a batch first");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await markOfflineAttendance({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            batchId: selectedBatch._id // Pass batch ID if API requires it
          });
          setSuccess(true);
        } catch (error) {
          alert(error?.response?.data?.message || "Failed to mark attendance");
        }
      },
      (error) => {
        alert("Unable to get location. Please enable location services.");
      }
    );
  };

  const renderAttendanceForm = () => {
    if (!selectedBatch) return null;

    const studyMode = selectedBatch.studyMode?.toUpperCase();

    if (success) {
      return <AttendanceSuccess />;
    }

    switch (studyMode) {
      case "ONLINE":
        return <OnlineAttendanceForm onSubmit={handleOnlineAttendance} />;
      
      case "OFFLINE":
        return <OfflineAttendanceCard onMarkAttendance={handleOfflineAttendance} />;
      
      case "HYBRID":
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <OfflineAttendanceCard onMarkAttendance={handleOfflineAttendance} />
            <OnlineAttendanceForm onSubmit={handleOnlineAttendance} />
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="STUDENT">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="STUDENT">
      <div className="space-y-6">
        {/* Batch Selection Section */}
        {batches.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              {batches.length > 1 ? "Select Your Batch" : "Your Batch"}
            </h2>
            
            <div className={cn(
              "grid gap-4",
              batches.length > 1 ? "md:grid-cols-2 lg:grid-cols-3" : "max-w-2xl"
            )}>
              {batches.map((batch) => (
                <AttendanceModeCard
                  key={batch._id}
                  batch={batch}
                  selected={selectedBatch?._id === batch._id}
                  onSelect={() => handleBatchSelect(batch)}
                  selectable={batches.length > 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* No batches state */}
        {batches.length === 0 && !loading && (
          <div className="text-center py-12 rounded-2xl border border-dashed border-[var(--border-custom)] bg-[var(--card)]">
            <GraduationCap className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-4" />
            <h3 className="text-lg font-medium text-[var(--foreground)]">No Active Enrollments</h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              You are not enrolled in any active batches.
            </p>
          </div>
        )}

        {/* Attendance Form Section */}
        {selectedBatch && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Mark Attendance
            </h2>
            {renderAttendanceForm()}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}