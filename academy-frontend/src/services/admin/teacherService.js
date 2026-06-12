import api from "@/lib/api";


// GET ALL
export const getTeachers = async () => {

  const response =
    await api.get("/teachers");

  return response.data;

};


// GET SINGLE
export const getTeacher = async (id) => {

  const response =
    await api.get(`/teachers/${id}`);

  return response.data;

};


// CREATE
export const createTeacher = async (data) => {

  const response =
    await api.post("/teachers",data);

  return response.data;

};


// UPDATE
export const updateTeacher = async(id,data) => {

  const response =
    await api.put(`/teachers/${id}`,data);

  return response.data;

};


// DELETE
export const deleteTeacher = async(id) => {

  const response =
    await api.delete(`/teachers/${id}`);

  return response.data;

};