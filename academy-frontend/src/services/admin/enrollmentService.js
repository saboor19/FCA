import api from "@/lib/api";

export const createEnrollment = async (data) => {

  const response =
  await api.post(
    "/enrollments",
    data
  );

  return response.data;

};

export const getEnrollments = async () => {

  const response =
  await api.get(
    "/enrollments"
  );

  return response.data;

};
export const deleteEnrollment = async (id) => {

  const response =
  await api.delete(
    `/enrollments/${id}`
  );

  return response.data;

};
export const getBatchEnrollments = async (batchId) => {

  const response =
  await api.get(
    `/enrollments/batch/${batchId}`
  );

  return response.data;

};