"use client";

export default function EmptyState({

title,

description,

action

}){

return(

<div className="flex flex-col items-center justify-center py-20">

<div className="text-6xl mb-6">

📚

</div>

<h2 className="text-2xl font-bold">

{title}

</h2>

<p className="mt-2 text-gray-500">

{description}

</p>

<div className="mt-6">

{action}

</div>

</div>

);

}