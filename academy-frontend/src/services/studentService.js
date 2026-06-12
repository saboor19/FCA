export const getStudentDashboard =
async() => {

  const response = await fetch(
    "http://localhost:5000/api/student/dashboard",
    {
      credentials:"include"
    }
  );

  const data = await response.json();

  if(!response.ok){
    throw new Error(
      data.message
    );
  }

  return data;
};