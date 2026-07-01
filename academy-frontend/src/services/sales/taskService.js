import api from "@/lib/api";

// ======================================================
// CREATE TASK
// ======================================================

export const createLeadTask = async (leadId, data) => {
    const res = await api.post(
        `/sales/leads/${leadId}/tasks`,
        data
    );

    return res.data;
};

// ======================================================
// GET ALL TASKS OF A LEAD
// ======================================================

export const getLeadTasks = async (
    leadId,
    params = {}
) => {
    const res = await api.get(
        `/sales/leads/${leadId}/tasks`,
        {
            params
        }
    );

    return res.data;
};

// ======================================================
// GET SINGLE TASK
// ======================================================

export const getLeadTask = async (taskId) => {
    const res = await api.get(
        `/sales/leads/tasks/${taskId}`
    );

    return res.data;
};

// ======================================================
// UPDATE TASK
// ======================================================

export const updateLeadTask = async (
    taskId,
    data
) => {
    const res = await api.put(
        `/sales/leads/tasks/${taskId}`,
        data
    );

    return res.data;
};

// ======================================================
// DELETE TASK
// ======================================================

export const deleteLeadTask = async (
    taskId
) => {
    const res = await api.delete(
        `/sales/leads/tasks/${taskId}`
    );

    return res.data;
};