const LeadActivity =
require("../../models/sales/LeadActivity");

exports.createLeadActivity =
async({

lead,

performedBy,

type,

title,

description="",

source="USER",

metadata={},

outcome="",

scheduledAt=null,

completedAt=null

})=>{

return await LeadActivity.create({

lead,

performedBy,

type,

title,

description,

outcome,

source,

scheduledAt,

completedAt,

metadata

});

};