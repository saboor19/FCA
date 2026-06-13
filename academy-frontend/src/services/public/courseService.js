import api from "./api";


// Get All Courses
export const getAllCourses = async () => {

  const response = await api.get("/courses");

  return response.data;

};