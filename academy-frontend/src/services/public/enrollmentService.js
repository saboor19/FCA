import api from "@/lib/api";

export const submitEnrollmentRequest = async(data) => {

  const response =
    await api.post(
      "/public/enrollment/apply",
      data
    );

  return response.data;
};