import api from "@/lib/api";

export const getTeacherStudents =
async() => {

  const response =
    await api.get(
      "/teacher/students"
    );

  return response.data;

};


export const getStudentById =
async(id) => {

  const response =
    await api.get(
      `/teacher/students/${id}`
    );

  return response.data;

};