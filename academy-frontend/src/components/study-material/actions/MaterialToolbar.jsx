"use client";

import Link from "next/link";

import { Plus, RefreshCw } from "lucide-react";

import SearchBar from "@/components/common/SearchBar";

export default function MaterialToolbar({

search,

setSearch,

refresh

}){

return(

<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

<div className="flex-1">

<SearchBar

value={search}

onChange={setSearch}

placeholder="Search study materials..."

/>

</div>

<div className="flex gap-3">

<button

onClick={refresh}

className="rounded-lg border px-4 py-2"

>

<RefreshCw
size={18}
/>

</button>

<Link

href="/teacher/study-materials/create"

className="rounded-lg bg-blue-600 px-5 py-2 text-white"

>

<Plus
size={18}
className="inline mr-2"
/>

Create Material

</Link>

</div>

</div>

);

}