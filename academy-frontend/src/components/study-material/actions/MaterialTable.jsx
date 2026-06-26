"use client";

import DataTable from "@/components/common/table/DataTable";

import StatusBadge from "@/components/common/StatusBadge";

import MaterialActionMenu from "./MaterialActionMenu";

export default function MaterialTable({

materials,

onPublish,

onUnpublish,

onArchive,

onDelete,

onDuplicate,

onShare

}){

const columns=[

{

key:"materialNumber",

label:"Material No"

},

{

key:"title",

label:"Title"

},

{

key:"course",

label:"Course",

render:row=>row.course?.title

},

{

key:"type",

label:"Type"

},

{

key:"difficulty",

label:"Difficulty"

},

{

key:"status",

label:"Status",

render:row=>

<StatusBadge
status={row.status}
/>

},

{

key:"version",

label:"Version"

},

{

key:"createdAt",

label:"Created",

render:row=>

new Date(

row.createdAt

).toLocaleDateString()

}

];

return(

<DataTable

columns={columns}

data={materials}

renderActions={row=>

<MaterialActionMenu

material={row}

onPublish={onPublish}

onUnpublish={onUnpublish}

onArchive={onArchive}

onDelete={onDelete}

onDuplicate={onDuplicate}

onShare={onShare}

/>

}

/>

);

}