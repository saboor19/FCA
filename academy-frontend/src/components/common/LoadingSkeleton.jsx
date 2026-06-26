"use client";

export default function LoadingSkeleton({

rows=6

}){

return(

<div className="space-y-3">

{

Array.from({

length:rows

}).map((_,index)=>(

<div

key={index}

className="h-12 animate-pulse rounded bg-gray-200"

/>

))

}

</div>

);

}