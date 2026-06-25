import api from "@/lib/api";

export const getTeacherNotices =
async() => {

  const response =
    await api.get(
      "/teacher/notices"
    );

  return response.data;

};

export const getTeacherNoticeById =
async(id) => {

  const response =
    await api.get(
      `/teacher/notices/${id}`
    );

  return response.data;

};

export const markNoticeAsRead =
async(id) => {

  const response =
    await api.post(
      `/teacher/notices/${id}/read`
    );

  return response.data;

};
export const downloadNoticePdf = async (noticeId) => {

  const response = await api.get(

    `/teacher/notices/${noticeId}/pdf`,

    {
      responseType: "blob"
    }

  );

  return response.data;

};