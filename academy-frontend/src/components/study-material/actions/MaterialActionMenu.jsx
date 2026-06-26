"use client";

import Link from "next/link";

import {
    MoreHorizontal,
    Eye,
    Pencil,
    Paperclip,
    Share2,
    Copy,
    Upload,
    Archive,
    Trash2
} from "lucide-react";

import {

DropdownMenu,

DropdownMenuContent,

DropdownMenuItem,

DropdownMenuSeparator,

DropdownMenuTrigger

} from "@/components/ui/dropdown-menu";

export default function MaterialActionMenu({

material,

onPublish,

onUnpublish,

onArchive,

onDelete,

onDuplicate,

onShare

}){

return(

<DropdownMenu>

<DropdownMenuTrigger asChild>

<button
className="rounded-md p-2 hover:bg-gray-100"
>

<MoreHorizontal
size={18}
/>

</button>

</DropdownMenuTrigger>

<DropdownMenuContent
align="end"
className="w-56"
>

<Link
href={`/teacher/study-materials/${material._id}`}
>

<DropdownMenuItem>

<Eye
size={16}
className="mr-2"
/>

View

</DropdownMenuItem>

</Link>

<Link
href={`/teacher/study-materials/${material._id}/edit`}
>

<DropdownMenuItem>

<Pencil
size={16}
className="mr-2"
/>

Edit

</DropdownMenuItem>

</Link>

<Link
href={`/teacher/study-materials/${material._id}/attachments`}
>

<DropdownMenuItem>

<Paperclip
size={16}
className="mr-2"
/>

Attachments

</DropdownMenuItem>

</Link>

<DropdownMenuItem
onClick={()=>onShare(material)}
>

<Share2
size={16}
className="mr-2"
/>

Share

</DropdownMenuItem>

<DropdownMenuItem
onClick={()=>onDuplicate(material)}
>

<Copy
size={16}
className="mr-2"
/>

Duplicate

</DropdownMenuItem>

<DropdownMenuSeparator/>

{

material.status==="DRAFT" && (

<DropdownMenuItem
onClick={()=>onPublish(material)}
>

<Upload
size={16}
className="mr-2"
/>

Publish

</DropdownMenuItem>

)

}

{

material.status==="PUBLISHED" && (

<DropdownMenuItem
onClick={()=>onUnpublish(material)}
>

<Upload
size={16}
className="mr-2 rotate-180"
/>

Move To Draft

</DropdownMenuItem>

)

}

<DropdownMenuItem
onClick={()=>onArchive(material)}
>

<Archive
size={16}
className="mr-2"
/>

Archive

</DropdownMenuItem>

<DropdownMenuSeparator/>

<DropdownMenuItem

onClick={()=>onDelete(material)}

className="text-red-600"

>

<Trash2
size={16}
className="mr-2"
/>

Delete

</DropdownMenuItem>

</DropdownMenuContent>

</DropdownMenu>

);

}