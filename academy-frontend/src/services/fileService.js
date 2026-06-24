import api from "@/lib/api";

export const uploadFile =
async(formData)=>{

  const { data } =
  await api.post(
    "/uploads",
    formData,
    {
      headers:{
        "Content-Type":
          "multipart/form-data"
      }
    }
  );

  return data;
};