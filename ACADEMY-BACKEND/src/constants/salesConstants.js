// ======================================================
// EMPLOYMENT
// ======================================================

const EMPLOYMENT_STATUS = [

  "ACTIVE",

  "INACTIVE",

  "ON_LEAVE",

  "RESIGNED",

  "TERMINATED"

];

// ======================================================
// LEAD STATUS
// ======================================================

const LEAD_STATUS = [

  "NEW",

  "CONTACTED",

  "FOLLOW_UP",

  "VISIT_SCHEDULED",

  "COUNSELLING",

  "NEGOTIATION",

  "READY_FOR_ADMISSION",

  "CONVERTED",

  "LOST"

];

// ======================================================
// LEAD PRIORITY
// ======================================================

const LEAD_PRIORITY = [

  "LOW",

  "MEDIUM",

  "HIGH",

  "HOT"

];

// ======================================================
// LEAD SOURCE
// ======================================================

const LEAD_SOURCE = [

  "FACEBOOK",

  "INSTAGRAM",

  "GOOGLE",

  "WEBSITE",

  "WHATSAPP",

  "REFERRAL",

  "WALK_IN",

  "YOUTUBE",

  "SEMINAR",

  "OTHER"

];

// ======================================================
// STUDY MODE
// ======================================================

const STUDY_MODE = [

  "ONLINE",

  "OFFLINE",

  "HYBRID"

];

// ======================================================
// FOLLOWUP TYPE
// ======================================================

const FOLLOWUP_TYPE = [

  "PHONE",

  "WHATSAPP",

  "EMAIL",

  "VISIT",

  "MEETING",

  "VIDEO_CALL",

  "SMS"

];

// ======================================================
// FOLLOWUP STATUS
// ======================================================

const FOLLOWUP_STATUS = [

  "PENDING",

  "COMPLETED",

  "MISSED",

  "CANCELLED"

];

// ======================================================
// CUSTOMER RESPONSE
// ======================================================

const CUSTOMER_RESPONSE = [

  "VERY_INTERESTED",

  "INTERESTED",

  "THINKING",

  "CALL_BACK",

  "NO_RESPONSE",

  "NOT_INTERESTED",

  "SWITCHED_OFF"

];

// ======================================================
// TASK STATUS
// ======================================================

const TASK_STATUS = [

  "PENDING",

  "COMPLETED",

  "OVERDUE",

  "CANCELLED"

];

// ======================================================
// TASK PRIORITY
// ======================================================

const TASK_PRIORITY = [

  "LOW",

  "MEDIUM",

  "HIGH",

  "URGENT"

];

// ======================================================
// GENDER
// ======================================================

const GENDER = [

  "MALE",

  "FEMALE",

  "OTHER"

];
const LOST_REASON = [

  "NOT_INTERESTED",

  "FEE_TOO_HIGH",

  "JOINED_OTHER_INSTITUTE",

  "NO_RESPONSE",

  "INVALID_LEAD",

  "LOCATION_ISSUE",

  "TIME_ISSUE",

  "OTHER"

];
const ACTIVITY_TYPE = {
    CREATED: "CREATED",
    UPDATED: "UPDATED",
    STATUS_CHANGED: "STATUS_CHANGED",
    PHONE_CALL: "PHONE_CALL",
    EMAIL: "EMAIL",
    WHATSAPP: "WHATSAPP",
    SMS: "SMS",
    MEETING: "MEETING",
    FOLLOW_UP: "FOLLOW_UP",
    DEMO: "DEMO",
    NOTE: "NOTE",
    TASK: "TASK",
    ASSIGNED: "ASSIGNED",
    CONVERTED: "CONVERTED",
    SYSTEM: "SYSTEM"
};

const ACTIVITY_TYPE_VALUES = Object.values(ACTIVITY_TYPE);



// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  EMPLOYMENT_STATUS,

  LEAD_STATUS,

  LEAD_PRIORITY,

  LEAD_SOURCE,

  STUDY_MODE,

  ACTIVITY_TYPE_VALUES,

  FOLLOWUP_TYPE,

  FOLLOWUP_STATUS,

  CUSTOMER_RESPONSE,

  TASK_STATUS,

  TASK_PRIORITY,

  ACTIVITY_TYPE,

  GENDER,

  LOST_REASON

};