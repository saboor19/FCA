import api from "@/lib/api";

// ======================================================
// STUDENT STUDY MATERIALS — READ ONLY
// ======================================================

// ---------------- GET ALL MATERIALS ----------------
export const getStudentStudyMaterials = async () => {
  const response = await api.get("/student/study-materials");
  return response.data;
};

// ---------------- GET SINGLE MATERIAL ----------------
export const getStudentStudyMaterial = async (id) => {
  const response = await api.get(`/student/study-materials/${id}`);
  return response.data;
};

// ---------------- PREVIEW ATTACHMENT ----------------
export const previewStudentAttachment = (id, attachmentId) => {
  window.open(
    `${process.env.NEXT_PUBLIC_API_URL}/student/study-materials/${id}/attachments/${attachmentId}/preview`,
    "_blank"
  );
};

// ---------------- DOWNLOAD ATTACHMENT ----------------
export const downloadStudentAttachment = (id, attachmentId) => {
  window.open(
    `${process.env.NEXT_PUBLIC_API_URL}/student/study-materials/${id}/attachments/${attachmentId}/download`
  );
};

// ---------------- SERVICE OBJECT ----------------
const studentStudyMaterialService = {
  getStudentStudyMaterials,
  getStudentStudyMaterial,
  previewStudentAttachment,
  downloadStudentAttachment,
};

export default studentStudyMaterialService;