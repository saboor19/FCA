import api from "@/lib/api";

export const createStudent = async (data) => {

  const response = await api.post(
    "/admin/students",
    data
  );

  return response.data;

};

export const getStudents = async () => {

  const response = await api.get(
    "/admin/students"
  );

  return response.data;

};

export const deleteStudent = async (id) => {

  const response = await api.delete(
    `/admin/students/${id}`
  );

  return response.data;

};

export const getStudent = async (id) => {

  const response =
  await api.get(`/admin/students/${id}`);

  return response.data;

};

export const updateStudent = async (id,data) => {

  const response =
  await api.put(
    `/admin/students/${id}`,
    data
  );

  return response.data;

};


export const getAvailableStudents = async (batchId) => {

  const response =
    await api.get(
      `/batches/students/available/${batchId}`
    );

  return response.data;

};