"use client";

import {useEffect,useState} from "react";

import DashboardLayout
from "@/components/dashboard/DashboardLayout";

import SessionCreator
from "@/components/teachers/attendance/SessionCreator";

import ActiveSessionCard
from "@/components/teachers/attendance/ActiveSessionCard";

import {
  getAssignedBatches
}
from "@/services/teacher/batchService";

import {
  createAttendanceSession,
  getActiveAttendanceSession,
  closeAttendanceSession
}
from "@/services/teacher/teacherAttendanceService";

export default function AttendanceSessionPage(){

  const [batches,setBatches] =
    useState([]);

  const [selectedBatch,setSelectedBatch] =
    useState("");

  const [session,setSession] =
    useState(null);

  useEffect(() => {

    loadBatches();

  },[]);

  const loadBatches =
  async() => {

    try{

      const response = await getAssignedBatches();

      setBatches(response.data|| []);

    }

    catch(error){

      console.error(error);

    }

  };

  const handleCreateSession =
  async() => {

    try{

      const response =
        await createAttendanceSession(
          selectedBatch
        );

      setSession(
        response.session
      );

    }

    catch(error){

      console.error(error);

    }

  };

  const handleLoadSession =
  async(batchId) => {

    try{

      const response =
        await getActiveAttendanceSession(
          batchId
        );

      setSession(
        response.session
      );

    }

    catch(error){

      console.error(error);

    }

  };

  const handleCloseSession =
  async() => {

    try{

      await closeAttendanceSession(
        session._id
      );

      setSession(null);

    }

    catch(error){

      console.error(error);

    }

  };

  useEffect(() => {

    if(selectedBatch){

      handleLoadSession(
        selectedBatch
      );

    }

  },[selectedBatch]);

  return (

    <DashboardLayout role="TEACHER">

      <div className="space-y-6">

        <div>

          <h1 className="text-2xl font-bold">
            Attendance Sessions
          </h1>

          <p className="text-sm text-muted-foreground">
            Generate attendance codes for online classes.
          </p>

        </div>

        <SessionCreator
          batches={batches}
          selectedBatch={selectedBatch}
          setSelectedBatch={setSelectedBatch}
          onCreateSession={handleCreateSession}
        />

        {session && (

          <ActiveSessionCard
            session={session}
            onCloseSession={handleCloseSession}
          />

        )}

      </div>

    </DashboardLayout>

  );

}