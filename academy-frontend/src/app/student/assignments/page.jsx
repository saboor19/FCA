"use client";

import {useEffect,useState} from "react";

import AssignmentList
from "@/components/students/assignments/AssignmentList";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  getStudentAssignments
}
from "@/services/student/assignmentService";



export default function
StudentAssignmentsPage(){

  const [
    assignments,
    setAssignments
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);



  useEffect(()=>{

    fetchAssignments();

  },[]);



  const fetchAssignments =
  async()=>{

    try{

        const data =
        await getStudentAssignments();

        setAssignments(
        data.assignments
        );

    }

    catch(error){

      console.log(error);

    }

    finally{

      setLoading(false);

    }

  };



  return(
    <DashboardLayout role="STUDENT">

    <div
      className="
        min-h-screen
        bg-slate-50
        dark:bg-slate-950
        p-4
        md:p-6
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
        "
      >

        <div
          className="
            mb-6
          "
        >

          <h1
            className="
              text-2xl
              md:text-3xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            Assignments
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-600
              dark:text-slate-400
            "
          >
            View and manage
            your assignments
          </p>

        </div>



        <AssignmentList
          assignments={assignments}
          loading={loading}
        />

      </div>

    </div>
</DashboardLayout>
  );

}
