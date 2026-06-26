exports.isPreviewable=(contentType)=>{

const previewable=[

"application/pdf",

"image/png",

"image/jpeg",

"image/webp",

"video/mp4",

"text/plain"

];

return previewable.includes(contentType);

};