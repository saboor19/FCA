import api from "@/lib/api";

export const getNotices =
async(page = 1,limit = 10) => {

  const {data} =
    await api.get(

      `/student/notices?page=${page}&limit=${limit}`

    );

  return data;

};

export const getNotice =
async(id) => {

  const {data} =
    await api.get(

      `/student/notices/${id}`

    );

  return data;

};

export const markNoticeAsRead =
async(id) => {

  const {data} =
    await api.post(

      `/student/notices/${id}/read`

    );

  return data;

};

export const downloadNoticePdf = async (noticeId) => {

  const response = await api.get(

    `/student/notices/${noticeId}/pdf`,

    {
      responseType: "blob"
    }

  );

  return response.data;

};