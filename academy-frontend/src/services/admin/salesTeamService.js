import api from "@/lib/api";

// ======================================================
// GET ALL SALES TEAM MEMBERS
// ======================================================

export const getSalesTeamMembers = async (params = {}) => {
  const response = await api.get("/admin/sales-team", {
    params,
  });

  return response.data;
};

// ======================================================
// GET SINGLE SALES TEAM MEMBER
// ======================================================

export const getSalesTeamMember = async (id) => {
  const response = await api.get(`/admin/sales-team/${id}`);

  return response.data;
};

// ======================================================
// CREATE SALES TEAM MEMBER
// ======================================================

export const createSalesTeamMember = async (data) => {
  const response = await api.post("/admin/sales-team", data);

  return response.data;
};

// ======================================================
// UPDATE SALES TEAM MEMBER
// ======================================================

export const updateSalesTeamMember = async (id, data) => {
  const response = await api.put(`/admin/sales-team/${id}`, data);

  return response.data;
};

// ======================================================
// DELETE SALES TEAM MEMBER
// ======================================================

export const deleteSalesTeamMember = async (id) => {
  const response = await api.delete(`/admin/sales-team/${id}`);

  return response.data;
};

// ======================================================
// TOGGLE STATUS
// ======================================================

export const toggleSalesTeamStatus = async (id) => {
  const response = await api.patch(
    `/admin/sales-team/${id}/toggle-status`
  );

  return response.data;
};