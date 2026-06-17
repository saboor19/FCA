import api from "@/lib/api";



export const getMyTimetable =
async()=>{

  const response =
  await api.get(
    "/student/timetable"
  );

  return response.data;

};