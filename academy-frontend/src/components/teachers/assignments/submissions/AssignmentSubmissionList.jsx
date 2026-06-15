"use client";

import {useEffect,useState}
from "react";

import {useParams}
from "next/navigation";

import DashboardLayout
from "@/components/dashboard/DashboardLayout";

import SubmissionList
from "@/components/teacher/assignments/submissions/SubmissionList";

import {
  getAssignmentSubmissions
}
from "@/services/teacher/assignmentService";



export default function
AssignmentSubmissionsPage(){

  const {id} = useParams();

  const [
    submissions,
    setSubmissions
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);



  useEffect(()=>{

    if(id){

      fetchSubmissions();

    }

  },[id]);



  const fetchSubmissions =
  async()=>{

    try{

      const data =
      await getAssignmentSubmissions(
        id
      );

      setSubmissions(
        data.submissions
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

    <DashboardLayout role="TEACHER">

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

          <h1
            className="
              text-2xl
              font-bold
              text-slate-900
              dark:text-white
              mb-6
            "
          >
            Assignment Submissions
          </h1>

          <SubmissionList
            submissions={submissions}
            loading={loading}
          />

        </div>

      </div>

    </DashboardLayout>

  );

}