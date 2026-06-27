import api from "@/lib/api";

// ======================================================
// MATERIAL CRUD
// ======================================================

export const createStudyMaterial = async(data)=>{

const response =
await api.post(
"/teacher/study-materials",
data
);

return response.data;

};

export const getStudyMaterials = async(params={})=>{

const response =await api.get("/teacher/study-materials",{params});

return response.data;

};

export const getStudyMaterial = async(id)=>{

const response =
await api.get(
`/teacher/study-materials/${id}`
);

return response.data;

};

export const updateStudyMaterial =
async(id,data)=>{

const response =
await api.put(

`/teacher/study-materials/${id}`,

data

);

return response.data;

};

export const deleteStudyMaterial =
async(id)=>{

const response =
await api.delete(

`/teacher/study-materials/${id}`

);

return response.data;

};

export const restoreStudyMaterial =
async(id)=>{

const response =
await api.patch(

`/teacher/study-materials/${id}/restore`

);

return response.data;

};


// ======================================================
// STATUS
// ======================================================

export const publishStudyMaterial =
async(id)=>{

const response =
await api.patch(

`/teacher/study-materials/${id}/publish`

);

return response.data;

};

export const unpublishStudyMaterial =
async(id)=>{

const response =
await api.patch(

`/teacher/study-materials/${id}/unpublish`

);

return response.data;

};

export const archiveStudyMaterial =
async(id)=>{

const response =
await api.patch(

`/teacher/study-materials/${id}/archive`

);

return response.data;

};


// ======================================================
// ATTACHMENTS
// ======================================================

export const uploadAttachment =
async(id,file)=>{

const formData =
new FormData();

formData.append(
"file",
file
);

const response =
await api.post(

`/teacher/study-materials/${id}/attachments`,

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

export const getAttachments =
async(id)=>{

const response =
await api.get(

`/teacher/study-materials/${id}/attachments`

);

return response.data;

};

export const previewAttachment =
(id,attachmentId)=>{

window.open(

`${process.env.NEXT_PUBLIC_API_URL}/teacher/study-materials/${id}/attachments/${attachmentId}/preview`,

"_blank"

);

};

export const downloadAttachment =
(id,attachmentId)=>{

window.open(

`${process.env.NEXT_PUBLIC_API_URL}/teacher/study-materials/${id}/attachments/${attachmentId}/download`

);

};

export const deleteAttachment =
async(id,attachmentId)=>{

const response =
await api.delete(

`/teacher/study-materials/${id}/attachments/${attachmentId}`

);

return response.data;

};


// ======================================================
// SHARING
// ======================================================

export const shareStudyMaterial =
async(id,batchIds)=>{

const response =
await api.patch(

`/teacher/study-materials/${id}/share`,

{

batchIds

}

);

return response.data;

};

export const unshareStudyMaterial =
async(id,batchIds)=>{

const response =
await api.patch(

`/teacher/study-materials/${id}/unshare`,

{

batchIds

}

);

return response.data;

};

export const getShareableBatches =
async(id)=>{

const response =
await api.get(

`/teacher/study-materials/${id}/shareable-batches`

);

return response.data;

};


// ======================================================
// DUPLICATE
// ======================================================

export const duplicateStudyMaterial =
async(

id,

options={

includeAttachments:false,

includeSharedBatches:false

}

)=>{

const response =
await api.post(

`/teacher/study-materials/${id}/duplicate`,

options

);

return response.data;

};

const studyMaterialService = {
  createStudyMaterial,
  getStudyMaterials,
  getStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
  restoreStudyMaterial,

  publishStudyMaterial,
  unpublishStudyMaterial,
  archiveStudyMaterial,

  uploadAttachment,
  getAttachments,
  previewAttachment,
  downloadAttachment,
  deleteAttachment,

  shareStudyMaterial,
  unshareStudyMaterial,
  getShareableBatches,

  duplicateStudyMaterial,
};

export default studyMaterialService;