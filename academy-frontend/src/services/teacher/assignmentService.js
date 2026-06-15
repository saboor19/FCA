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