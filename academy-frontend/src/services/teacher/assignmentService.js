import api from "@/lib/api";



// CREATE ASSIGNMENT
export const createAssignment =
async(formData) => {

  const response =
    await api.post(
      "/teacher/assignments",
      formData
    );

  return response.data;

};



// GET ALL ASSIGNMENTS
export const getTeacherAssignments =
async() => {

  const response =
    await api.get(
      "/teacher/assignments"
    );

  return response.data;

};



// GET SINGLE ASSIGNMENT
export const getSingleAssignment =
async(id) => {

  const response =
    await api.get(
      `/teacher/assignments/${id}`
    );

  return response.data;

};



// UPDATE ASSIGNMENT
export const updateAssignment =
async(id,formData) => {

  const response =
    await api.put(
      `/teacher/assignments/${id}`,
      formData
    );

  return response.data;

};



// PUBLISH ASSIGNMENT
export const publishAssignment =
async(id) => {

  const response =
    await api.patch(
      `/teacher/assignments/${id}/publish`
    );

  return response.data;

};



// CLOSE ASSIGNMENT
export const closeAssignment =
async(id) => {

  const response =
    await api.patch(
      `/teacher/assignments/${id}/close`
    );

  return response.data;

};



// DELETE ASSIGNMENT
export const deleteAssignment =
async(id) => {

  const response =
    await api.delete(
      `/teacher/assignments/${id}`
    );

  return response.data;

};

//----------GET SUBMISSIONS OF THE ASSIGNMENT-----
export const getAssignmentSubmissions =
async(assignmentId)=>{

  const response =
  await api.get(
    `/teacher/assignments/${assignmentId}/submissions`
  );

  return response.data;

};


export const getSingleSubmission =
async(submissionId)=>{

  const response =
  await api.get(
    `/teacher/assignments/submissions/${submissionId}`
  );

  return response.data;

};

export const gradeSubmission =
async(
  submissionId,
  data
)=>{

  const response =
  await api.patch(

    `/teacher/assignments/submissions/${submissionId}/grade`,

    data

  );

  return response.data;

};