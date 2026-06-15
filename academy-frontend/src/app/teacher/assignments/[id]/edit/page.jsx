"use client";

import {useEffect,useState} from "react";

import {useParams,useRouter}
from "next/navigation";

import AssignmentForm
from "@/components/teachers/assignments/AssignmentForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {

  getSingleAssignment,

  updateAssignment

} from "@/services/teacher/assignmentService";

import {

  getAssignedBatches 

} from "@/services/teacher/batchService";



export default function EditAssignmentPage(){



  const params = useParams();

  const router = useRouter();

  const id = params.id;



  const [loading,setLoading] =
    useState(true);

  const [saving,setSaving] =
    useState(false);

  const [assignment,setAssignment] =
    useState(null);

  const [batches,setBatches] =
    useState([]);





  // ---------------- FETCH DATA ----------------

  useEffect(() => {

    if(id){

      fetchData();

    }

  },[id]);





  const fetchData = async() => {

    try{

const [

  assignmentData,

  batchData

] = await Promise.all([

  getSingleAssignment(id),

  getAssignedBatches()

]);



setBatches(
  batchData.data || []
);;



      const assignment =
        assignmentData.assignment;



      setAssignment({

        ...assignment,



        batchId:
          assignment.batchId?._id,



        moduleId:
          assignment.moduleId,



        dueDate:
          assignment.dueDate
            ? new Date(
                assignment.dueDate
              )
              .toISOString()
              .slice(0,16)
            : ""

      });



      setBatches(
        batchData.batches || []
      );

    }
    catch(error){

      console.log(error);

    }
    finally{

      setLoading(false);

    }

  };





  // ---------------- UPDATE ----------------

  const handleUpdateAssignment =
  async(formData) => {

    try{

      setSaving(true);



      await updateAssignment(
        id,
        formData
      );



      router.push(
        `/teacher/assignments/${id}`
      );

    }
    catch(error){

      console.log(error);

    }
    finally{

      setSaving(false);

    }

  };





  // ---------------- LOADING ----------------

  if(loading){

    return (

      <div>
        Loading assignment...
      </div>

    );

  }





  // ---------------- NOT FOUND ----------------

  if(!assignment){

    return (

      <div>
        Assignment not found
      </div>

    );

  }





  return (
    <DashboardLayout role="TEACHER">

    <div className="space-y-8">


      {/* FORM */}

      <AssignmentForm

        initialData={assignment}

        onSubmit={
          handleUpdateAssignment
        }

        loading={saving}

        batches={batches}

      />

    </div>
    </DashboardLayout>

  );

}