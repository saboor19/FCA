export const LEAD_STATUS = [

    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "INTERESTED",
    "NEGOTIATION",
    "FOLLOW_UP",
    "CONVERTED",
    "LOST"

];

export const LEAD_PRIORITY = [

    "LOW",
    "MEDIUM",
    "HIGH"

];

export const LEAD_SOURCE = [

    "WEBSITE",
    "FACEBOOK",
    "INSTAGRAM",
    "GOOGLE",
    "REFERRAL",
    "WALK_IN",
    "OTHER"

];

export const GENDER =["MALE","FEMALE", "PREFER NOT TO SAY"];

export const STUDY_MODE=["ONLINE", "OFFLINE", "HYBRID"];

export const TIMING=["MORNING","EVENING", "WEEKEND", "FULL DAY" , "PRE SCHEDULED"];

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

// ======================================================
// TASKS
// ======================================================

export const TASK_STATUS = [

    "PENDING",

    "IN_PROGRESS",

    "COMPLETED",

    "OVERDUE",

    "CANCELLED"

];

export const TASK_PRIORITY = [

    "LOW",

    "MEDIUM",

    "HIGH",

    "URGENT"

];

// --------------------------------------------
// GENDER
// --------------------------------------------

export const SALES_TEAM_GENDER = [
  "MALE",
  "FEMALE",
  "OTHER",
];

// --------------------------------------------
// EMPLOYMENT STATUS
// --------------------------------------------

export const SALES_TEAM_EMPLOYMENT_STATUS = [
  "ACTIVE",
  "INACTIVE",
  "ON_LEAVE",
  "RESIGNED",
  "TERMINATED",
];

// --------------------------------------------
// DEFAULT DESIGNATIONS
// --------------------------------------------

export const SALES_TEAM_DESIGNATIONS = [
  "Sales Executive",
  "Senior Sales Executive",
  "Sales Associate",
  "Business Development Executive",
  "Business Development Manager",
  "Sales Manager",
  "Regional Sales Manager",
  "Team Lead",
  "Counsellor",
];

// --------------------------------------------
// DEPARTMENTS
// --------------------------------------------

export const SALES_TEAM_DEPARTMENTS = [
  "Sales",
  "Admissions",
  "Business Development",
  "Marketing",
];

export const ACTIVITY_TYPE_VALUES = Object.values(ACTIVITY_TYPE);


