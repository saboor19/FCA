
import api from "@/lib/api";



// ---------------- GET ASSIGNMENTS ----------------

export const
getStudentAssignments =
async()=>{

  const response =
  await api.get(
    "/student/assignments"
  );

  return response.data;

};



// ---------------- GET SINGLE ASSIGNMENT ----------------

export const
getStudentAssignmentById =
async(assignmentId)=>{

  const response =
  await api.get(
    `/student/assignments/${assignmentId}`
  );

  return response.data;

};



// ---------------- START ASSIGNMENT ----------------

export const
startAssignmentAttempt =
async(assignmentId)=>{

  const response =
  await api.post(
    `/student/assignments/${assignmentId}/start`
  );

  return response.data;

};



// ---------------- SAVE ANSWERS ----------------

export const
saveAssignmentAnswers =
async(submissionId,data)=>{

  const response =
  await api.patch(

    `/student/assignments/submissions/${submissionId}/save`,

    data

  );

  return response.data;

};



// ---------------- SUBMIT ASSIGNMENT ----------------

export const
submitAssignment =
async(submissionId)=>{

  const response =
  await api.post(

    `/student/assignments/submissions/${submissionId}/submit`

  );

  return response.data;

};
