import api from "@/lib/api";


// GET TEACHER TIMETABLE

export const getTeacherTimetable =
async() => {

  const response =
    await api.get(
      "/teacher/timetable"
    );

  return response.data;

};