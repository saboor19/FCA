"use client";

export default function FilterSelect({

value,

onChange,

options=[],

placeholder="All"

}){

return(

<select

value={value}

onChange={e=>onChange(e.target.value)}

className="rounded-lg border px-3 py-2"

>

<option value="">

{placeholder}

</option>

{

options.map(option=>(

<option

key={option.value}

value={option.value}

>

{option.label}

</option>

))

}

</select>

);

}