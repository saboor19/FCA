import api from "@/lib/api";



// GET PROFILE
export const getMyProfile = async() => {

  const response =
    await api.get(
      "/teacher/profile/me"
    );

  return response.data;

};




// UPDATE PROFILE
export const updateMyProfile =
async(formData) => {

  const response =
    await api.put(
      "/teacher/profile/update",
      formData
    );

  return response.data;

};




// UPLOAD PROFILE IMAGE
export const uploadProfileImage =
async(formData) => {

  const response =
    await api.post(
      "/teacher/profile/upload-image",
      formData,
      {
        headers:{
          "Content-Type":
            "multipart/form-data"
        }
      }
    );

  return response.data;

};