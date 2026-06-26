class APIFeatures{

constructor(query,queryString){

this.query=query;
this.queryString=queryString;

this.page=1;
this.limit=10;
this.skip=0;

}

// ====================================================
// SEARCH
// ====================================================

search(searchFields=[]){

if(
this.queryString.search &&
searchFields.length
){

const keyword=this.queryString.search;

this.query=this.query.find({

$or:searchFields.map(field=>({

[field]:{

$regex:keyword,

$options:"i"

}

}))

});

}

return this;

}

// ====================================================
// FILTER
// ====================================================

filter(){

const queryObj={

...this.queryString

};

const excludedFields=[

"page",
"limit",
"sort",
"search",
"fields"

];

excludedFields.forEach(field=>delete queryObj[field]);

Object.keys(queryObj).forEach(key=>{

if(
queryObj[key]!==undefined &&
queryObj[key]!==""
){

this.query=this.query.find({

[key]:queryObj[key]

});

}

});

return this;

}

// ====================================================
// SORT
// ====================================================

sort(defaultSort={createdAt:-1}){

let sortOption=defaultSort;

switch(this.queryString.sort){

case "newest":

sortOption={createdAt:-1};

break;

case "oldest":

sortOption={createdAt:1};

break;

case "title":

sortOption={title:1};

break;

case "published":

sortOption={publishedAt:-1};

break;

default:

sortOption=defaultSort;

}

this.query=this.query.sort(sortOption);

return this;

}

// ====================================================
// FIELD SELECTION
// ====================================================

select(defaultFields=""){

if(this.queryString.fields){

const fields=

this.queryString.fields

.split(",")

.join(" ");

this.query=this.query.select(fields);

}

else if(defaultFields){

this.query=this.query.select(defaultFields);

}

return this;

}

// ====================================================
// POPULATE
// ====================================================

populate(populateOptions=[]){

populateOptions.forEach(option=>{

this.query=this.query.populate(option);

});

return this;

}

// ====================================================
// PAGINATION
// ====================================================

paginate(defaultLimit=10){

this.page=

Number(this.queryString.page)||1;

this.limit=

Number(this.queryString.limit)||defaultLimit;

this.skip=

(this.page-1)*this.limit;

this.query=this.query

.skip(this.skip)

.limit(this.limit);

return this;

}

// ====================================================
// LEAN
// ====================================================

lean(){

this.query=this.query.lean();

return this;

}

}

module.exports=APIFeatures;