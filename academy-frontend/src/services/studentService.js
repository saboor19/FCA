export const getStudentDashboard =
async() => {

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL/student/dashboard,
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