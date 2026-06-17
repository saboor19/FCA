"use client";

import {useEffect,useState} from "react";

import DashboardLayout
from "@/components/dashboard/DashboardLayout";

import LeaveRequestsTable
from "@/components/teachers/leaves/LeaveRequestsTable";

import ApproveLeaveModal
from "@/components/teachers/leaves/ApproveLeaveModal";

import RejectLeaveModal
from "@/components/teachers/leaves/RejectLeaveModal";

import {
  getPendingLeaves,
  approveLeave,
  rejectLeave
}
from "@/services/teacher/teacherAttendanceService";

export default function TeacherLeavesPage(){

  const [requests,setRequests] =
    useState([]);

  const [selectedLeave,setSelectedLeave] =
    useState(null);

  const [approveOpen,setApproveOpen] =
    useState(false);

  const [rejectOpen,setRejectOpen] =
    useState(false);

  useEffect(() => {

    loadLeaves();

  },[]);

  const loadLeaves =
  async() => {

    try{

      const response =
        await getPendingLeaves();

      setRequests(
        response.requests || []
      );

    }

    catch(error){

      console.error(error);

    }

  };

  const handleApprove =
  async() => {

    try{

      await approveLeave(
        selectedLeave._id
      );

      setApproveOpen(false);

      setSelectedLeave(null);

      loadLeaves();

    }

    catch(error){

      console.error(error);

    }

  };

  const handleReject =
  async(remarks) => {

    try{

      await rejectLeave(
        selectedLeave._id,
        remarks
      );

      setRejectOpen(false);

      setSelectedLeave(null);

      loadLeaves();

    }

    catch(error){

      console.error(error);

    }

  };

  return (

    <DashboardLayout role="TEACHER">

      <div className="space-y-6">

        <div>

          <h1 className="text-2xl font-bold">
            Leave Requests
          </h1>

          <p className="text-sm text-gray-500">
            Review student leave requests.
          </p>

        </div>

        <LeaveRequestsTable
          requests={requests}
          onApprove={(leave) => {

            setSelectedLeave(leave);

            setApproveOpen(true);

          }}
          onReject={(leave) => {

            setSelectedLeave(leave);

            setRejectOpen(true);

          }}
        />

      </div>

      <ApproveLeaveModal
        open={approveOpen}
        leave={selectedLeave}
        onClose={() => {

          setApproveOpen(false);

          setSelectedLeave(null);

        }}
        onConfirm={handleApprove}
      />

      <RejectLeaveModal
        open={rejectOpen}
        leave={selectedLeave}
        onClose={() => {

          setRejectOpen(false);

          setSelectedLeave(null);

        }}
        onConfirm={handleReject}
      />

    </DashboardLayout>

  );

}