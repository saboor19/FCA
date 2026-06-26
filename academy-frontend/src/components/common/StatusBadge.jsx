"use client";

const COLORS={

DRAFT:
"bg-yellow-100 text-yellow-800",

PUBLISHED:
"bg-green-100 text-green-800",

ARCHIVED:
"bg-red-100 text-red-800"

};

export default function StatusBadge({

status

}){

return(

<span

className={`rounded-full px-3 py-1 text-xs font-medium ${COLORS[status]}`}

>

{status}

</span>

);

}