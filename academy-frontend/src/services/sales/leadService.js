import api from "@/lib/api";

// ======================================================
// LEAD CRUD
// ======================================================

export const createLead = async (data) => {

    const response = await api.post(
        "/sales/leads",
        data
    );

    return response.data;

};

export const getLeads = async (params = {}) => {

    const response = await api.get(
        "/sales/leads",
        {
            params
        }
    );

    return response.data;

};

export const getLeadById = async (id) => {

    const response = await api.get(
        `/sales/leads/${id}`
    );

    return response.data;

};

export const updateLead = async (id, data) => {

    const response = await api.put(
        `/sales/leads/${id}`,
        data
    );

    return response.data;

};

export const deleteLead = async (id) => {

    const response = await api.delete(
        `/sales/leads/${id}`
    );

    return response.data;

};

export const convertLead = async (id) => {

    const response = await api.put(
        `/sales/leads/${id}/convert`
    );

    return response.data;

};

// ======================================================
// LEAD ACTIVITIES
// ======================================================

export const createLeadActivity = async (leadId, data) => {

    const response = await api.post(
        `/sales/leads/${leadId}/activities`,
        data
    );

    return response.data;

};

export const getLeadActivities = async (leadId, params = {}) => {

    const response = await api.get(
        `/sales/leads/${leadId}/activities`,
        {
            params
        }
    );

    return response.data;

};

export const getLeadActivity = async (activityId) => {

    const response = await api.get(
        `/sales/leads/activities/${activityId}`
    );

    return response.data;

};

export const updateLeadActivity = async (activityId, data) => {

    const response = await api.put(
        `/sales/leads/activities/${activityId}`,
        data
    );

    return response.data;

};

export const deleteLeadActivity = async (activityId) => {

    const response = await api.delete(
        `/sales/leads/activities/${activityId}`
    );

    return response.data;

};