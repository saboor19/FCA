"use client";

import {useEffect,useState} from "react";

import {useRouter} from "next/navigation";

import AssignmentForm from "@/components/teachers/assignments/AssignmentForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { createAssignment } from "@/services/teacher/assignmentService";

import {
  getAssignedBatches
} from "@/services/teacher/batchService";



export default function CreateAssignmentPage(){



  const router = useRouter();



  const [loading,setLoading] =
    useState(false);

  const [batches,setBatches] =
    useState([]);





  // ---------------- FETCH BATCHES ----------------

  useEffect(() => {

    fetchBatches();

  },[]);





  const fetchBatches = async() => {

    try{

      const data =
        await getAssignedBatches();

      setBatches(
        data.data || []
      );

    }
    catch(error){

      console.log(error);

    }

  };





  // ---------------- CREATE ASSIGNMENT ----------------

  const handleCreateAssignment =
  async(formData) => {

    try{

      setLoading(true);



      await createAssignment(
        formData
      );



      router.push(
        "/teacher/assignments"
      );

    }
    catch(error){

      console.log(error);

    }
    finally{

      setLoading(false);

    }

  };





  return (

<DashboardLayout role="TEACHER">
    <div className="space-y-8">

      {/* HEADER */}

      {/* FORM */}

      <AssignmentForm

        onSubmit={
          handleCreateAssignment
        }

        loading={loading}

        batches={batches}

      />

    </div>
    </DashboardLayout>

  );

}