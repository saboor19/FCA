import api from "@/lib/api";

// -------------------------------------
// GET MY PROFILE
// -------------------------------------

export const getMyProfile =
async()=>{

  const response =
  await api.get(
    "/student/profile"
  );

  return response.data;

};

// -------------------------------------
// UPDATE MY PROFILE
// -------------------------------------

export const updateMyProfile =
async(data)=>{

  const response =
  await api.patch(
    "/student/profile",
    data
  );

  return response.data;

};


// Upload image to GridFS, then return the fileId to store in profile
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file); // must match multer field name

  const { data } = await api.post("/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Return the full URL that getFile can serve
  return `/api/uploads/${data.fileId}`;
};