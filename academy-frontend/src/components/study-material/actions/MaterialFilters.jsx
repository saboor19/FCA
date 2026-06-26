"use client";

import FilterSelect from "@/components/common/FilterSelect";

export default function MaterialFilters({

filters,

setFilters

}){

return(

<div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

<FilterSelect

value={filters.status}

onChange={value=>

setFilters({

...filters,

status:value

})

}

placeholder="Status"

options={[

{

label:"Draft",

value:"DRAFT"

},

{

label:"Published",

value:"PUBLISHED"

},

{

label:"Archived",

value:"ARCHIVED"

}

]}

/>

<FilterSelect

value={filters.type}

onChange={value=>

setFilters({

...filters,

type:value

})

}

placeholder="Type"

options={[

{

label:"Notes",

value:"NOTES"

},

{

label:"PDF",

value:"PDF"

},

{

label:"Video",

value:"VIDEO"

}

]}

/>

<FilterSelect

value={filters.difficulty}

onChange={value=>

setFilters({

...filters,

difficulty:value

})

}

placeholder="Difficulty"

options={[

{

label:"Beginner",

value:"BEGINNER"

},

{

label:"Intermediate",

value:"INTERMEDIATE"

},

{

label:"Advanced",

value:"ADVANCED"

}

]}

/>

</div>

);

}