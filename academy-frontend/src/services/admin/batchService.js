import api from "@/lib/api";

export const getBatches = async () => {
  const response = await api.get("/batches");
  return response.data;
};

export const createBatch = async (data) => {
  const response = await api.post("/batches", data);
  return response.data;
};
export const deleteBatch = async (id) => {
  const response = await api.delete(
    `/batches/${id}`
  );

  return response.data;
};

export const getBatch = async (id) => {

  const response =
    await api.get(`/batches/${id}`);

  return response.data;

};

export const assignStudents = async (
  batchId,
  studentIds
) => {

  const response =
    await api.post(
      `/batches/${batchId}/students`,
      {
        studentIds
      }
    );

  return response.data;

};


export const updateBatch =
async(id,data) => {

  const response =
    await api.put(
      `/batches/${id}`,
      data
    );

  return response.data;

};


export const assignTeachers =
  async(batchId,data) => {

    const response =
      await api.put(

        `/batches/${batchId}/teachers`,

        data

      );

    return response.data;

};

export const removeTeachers =
  async(batchId,data) => {

    const response =
      await api.put(

        `/batches/${batchId}/teachers/remove`,

        data

      );

    return response.data;

};


export const getAvailableTeachers =
  async(batchId) => {

    const response =
      await api.get(
        `/batches/${batchId}/teachers/available`
      );

    return response.data;

};


export const removeStudentsFromBatch = async(batchId,studentIds) => { const response = await api.put( `/batches/${batchId}/students/remove`, { studentIds } ); return response.data; };