"use client";

export default function SearchBar({

    value,

    onChange,

    placeholder = "Search..."

}){

return(

<input

type="text"

value={value}

onChange={e=>onChange(e.target.value)}

placeholder={placeholder}

className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"

/>

);

}