"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  Plus,
  Trash2,
  User,
  CheckSquare,
  Square,
  Hash,
  Phone,
  Shield
} from "lucide-react";
import BatchSettingsCard
from "@/components/admin/batches/BatchSettingsCard";

import EditBatchModal
from "@/components/admin/batches/EditBatchModal";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AcademyLoader from "@/components/ui/AcademyLoader";
import AssignStudentsModal from "@/components/batches/AssignStudentsModal";
import AssignTeachersModal from "@/components/batches/AssignTeachersModal";
import StudentCard from "@/components/students/StudentCard";
import { getBatch,   removeStudentsFromBatch,  removeTeachers } from "@/services/admin/batchService";
import ManageFeeModal from "@/components/fees/ManageFeeModal";
export default function BatchDetailsPage() {
  const params = useParams();
  const batchId = params.id;
  const [editOpen,setEditOpen] =useState(false);
  const [batch, setBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [manageFeeOpen,setManageFeeOpen] = useState(false);
  const [selectedFeeId,setSelectedFeeId] = useState(null);
  // Removal State
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false);

  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [isRemovingTeachers, setIsRemovingTeachers] = useState(false);

  const fetchBatch = async () => {
    try {
      const data = await getBatch(batchId);
      setBatch(data.data.batch);
      setStudents(data.data.students);
      setStudentCount(data.data.studentCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (batchId) {
      fetchBatch();
    }
  }, [batchId]);

  // Toggle single student selection
  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) 
        ? prev.filter((s) => s !== id) 
        : [...prev, id]
    );
  };

  const toggleTeacher = (id) => {
    setSelectedTeachers((prev) =>
      prev.includes(id)
        ? prev.filter((t) => t !== id)
        : [...prev, id]
    );
  };

const toggleAllTeachers = () => {

  if(
    selectedTeachers.length ===
    batch?.teacherAssignments?.length
  ){

    setSelectedTeachers([]);

  }else{

    setSelectedTeachers(

      batch.teacherAssignments.map(
        (assignment) => assignment._id
      )

    );

  }

};

  // Select or Deselect All Students
  const toggleAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s._id));
    }
  };

  // Handle batch removal
  const handleRemoveStudents = async () => {
    if (selectedStudents.length === 0) return;
    
    setIsRemoving(true);
    try {
      await removeStudentsFromBatch(batchId, selectedStudents);
      setSelectedStudents([]);
      fetchBatch(); 
    } catch (error) {
      console.error("Failed to remove students:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleRemoveTeachers = async () => {
    if (selectedTeachers.length === 0) return;

    setIsRemovingTeachers(true);
    try {
      await removeTeachers(batchId,{assignmentIds: selectedTeachers});
      setSelectedTeachers([]);
      fetchBatch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsRemovingTeachers(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <AcademyLoader text="Fetching Batch Records..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* HEADER & INFO CARDS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {batch?.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400">
              <BookOpen size={18} />
              <span>{batch?.course?.title || "No Course Assigned"}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-card p-2 rounded-xl border border-border-custom shadow-sm">
            <div className="px-4 py-2 border-r border-border-custom">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Study Mode</p>
              <p className="text-sm font-medium text-foreground">{batch?.studyMode}</p>
            </div>
            <div className="px-4 py-2 border-r border-border-custom">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Capacity</p>
              <p className="text-sm font-medium text-foreground">{studentCount} / {batch?.capacity}</p>
            </div>
            <div className="px-4 py-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${batch?.isActive ? "bg-green-100 border-green-200 text-green-800 dark:bg-green-400/10 dark:border-green-400/20 dark:text-green-400" : "bg-slate-100 border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"}`}>
                {batch?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <BatchSettingsCard
        batch={batch}
        onEdit={() =>setEditOpen(true)}/>

        {/* -------------------------------------------------------TEACHERS------------------------------- */}
        <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <GraduationCap className="text-slate-400" />
                Assigned Teachers
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {batch?.teacherAssignments?.length || 0} teachers assigned
              </p>
            </div>

            <div className="flex items-center gap-3">
              {batch?.teacherAssignments?.length > 0 && (
<button
  onClick={toggleAllTeachers}
  className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-card border border-border-custom px-4 py-2 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
>
  {selectedTeachers.length === batch?.teacherAssignments?.length ? <Square size={16} /> : <CheckSquare size={16} />}
  {selectedTeachers.length === batch?.teacherAssignments?.length ? "Deselect All" : "Select All"}
</button>
              )}

              <button
                onClick={() => setTeacherModalOpen(true)}
                className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors px-4 py-2 rounded-xl text-sm shadow-sm"
              >
                <Plus size={16} />
                Add Teachers
              </button>
            </div>
          </div>

          {
batch.teacherAssignments.map(
  (assignment) => {

    const teacher =
      assignment.teacher;

    const isSelected =
      selectedTeachers.includes(
        assignment._id
      );

    // ---------------- MODULE NAMES ----------------

    const assignedModules =
      batch.course?.modules?.filter(
        (module)=>

          assignment.modules.includes(
            module._id
          )
      ) || [];

    return (

      <div
        key={assignment._id}

        onClick={() =>
          toggleTeacher(
            assignment._id
          )
        }

        className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
          isSelected

          ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/50 shadow-md ring-1 ring-slate-900 dark:ring-slate-100"

          : "border-border-custom bg-card hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm"
        }`}
      >

        {/* CHECKBOX */}

        <div className="absolute top-4 right-4">

          <div
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              isSelected

              ? "bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900"

              : "border-slate-300 dark:border-slate-600"
            }`}
          >

            {
              isSelected &&
              <CheckSquare size={14} />
            }

          </div>

        </div>

        {/* TEACHER INFO */}

        <div className="flex items-start gap-4 pr-6">

          <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 shrink-0">

            <User size={22} />

          </div>

          <div className="overflow-hidden flex-1">

            <h3 className="font-semibold text-sm truncate text-foreground">
              {teacher?.userId?.fullName}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {teacher?.userId?.email}
            </p>

            {/* MODULES */}

            <div className="flex flex-wrap gap-2 mt-4">

              {
                assignedModules.map(
                  (module)=>(

                  <span
                    key={module._id}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-border-custom"
                  >

                    {module.title}

                  </span>

                ))
              }

            </div>

          </div>

        </div>

      </div>

    );

  }
)

}
        </div>

        {/* ----------------------------STUDENTS GRID SECTION */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Enrolled Students
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {studentCount} students currently enrolled in this batch
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {students.length > 0 && (
                <button
                  onClick={toggleAll}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-card border border-border-custom hover:bg-slate-50 dark:hover:bg-slate-800/50 px-4 py-2.5 rounded-xl transition-colors text-sm font-medium"
                >
                  {selectedStudents.length === students.length ? <Square size={16} /> : <CheckSquare size={16} />}
                  {selectedStudents.length === students.length ? "Deselect All" : "Select All"}
                </button>
              )}

              {selectedStudents.length > 0 && (
                <button
                  onClick={handleRemoveStudents}
                  disabled={isRemoving}
                  className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 px-4 py-2.5 rounded-xl transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} />
                  {isRemoving ? "Removing..." : `Remove (${selectedStudents.length})`}
                </button>
              )}

              <button
                onClick={() => setOpenModal(true)}
                className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl transition-colors text-sm font-medium shadow-sm"
              >
                <Plus size={18} />
                Add Students
              </button>
            </div>
          </div>

          {/* UPGRADED STUDENT CARDS GRID */}
          {students.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {students.map((student) => {
                const isSelected = selectedStudents.includes(student._id);
                return (
                  <div 
                    key={student._id}
                    onClick={() => toggleStudent(student._id)}
                    className={`relative group flex flex-col p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${isSelected ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/50 shadow-md ring-1 ring-slate-900 dark:ring-slate-100" : "border-border-custom bg-card hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"}`}
                  >
                    {/* Checkbox */}
                    <div className="absolute top-5 right-5 z-10">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-slate-400 dark:group-hover:border-slate-400"}`}>
                        {isSelected && <CheckSquare size={14} className="opacity-100" />}
                      </div>
                    </div>
                    
                    {/* Header: Avatar & Identity */}
                    <div className="flex items-start gap-4 mb-5 pr-8">
                      <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20">
                        <User size={24} />
                      </div>
                      <div className="overflow-hidden flex-1 mt-0.5">
                        <h3 className="font-semibold text-foreground truncate text-base group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors">
                          {student.userId?.fullName || "Unknown Student"}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {student.userId?.email || "No email"}
                        </p>
                      </div>
                    </div>

                    {/* Body: Key Details */}
                    <div className="space-y-2.5 flex-1 bg-white dark:bg-slate-900/40 p-4 rounded-xl border border-border-custom mt-auto">
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <Hash size={16} className="text-slate-400 shrink-0" />
                        <span className="font-medium truncate">{student.enrollmentNo || "N/A"}</span>
                      </div>
                      
                      {student.phone && (
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <Phone size={16} className="text-slate-400 shrink-0" />
                          <span className="truncate">{student.phone}</span>
                        </div>
                      )}

                      {student.guardianName && (
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <Shield size={16} className="text-slate-400 shrink-0" />
                          <span className="truncate">Guardian: {student.guardianName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="text-center bg-card border border-border-custom border-dashed rounded-2xl py-16">
              <div className="mx-auto w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <User size={32} />
              </div>
              <h3 className="text-lg font-medium text-foreground">No students enrolled</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">Get started by adding students to this batch.</p>
              <button
                onClick={() => setOpenModal(true)}
                className="inline-flex items-center gap-2 bg-card border border-border-custom text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-5 py-2.5 rounded-xl transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                Add Your First Student
              </button>
            </div>
          )}
        </div>
      </div>

      <EditBatchModal
        open={editOpen}
        onClose={() =>setEditOpen(false)}batch={batch}
        refreshBatch={fetchBatch}/>

      <AssignStudentsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        batchId={batchId}
        refreshBatch={fetchBatch}
      />

      <AssignTeachersModal
        open={teacherModalOpen}
        onClose={() => setTeacherModalOpen(false)}
        batchId={batchId}
        refreshBatch={fetchBatch}
      />

      <ManageFeeModal open={manageFeeOpen}

        onClose={()=>setManageFeeOpen(false)}

        feeId={selectedFeeId}

        refreshBatch={fetchBatch}

      />

    </DashboardLayout>
  );
}