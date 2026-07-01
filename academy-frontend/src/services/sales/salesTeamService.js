import api from "@/lib/api";

// ======================================================
// GET ALL SALES TEAM MEMBERS
// ======================================================

export const getSalesTeam = async (params = {}) => {

    const res = await api.get(
        "/sales/team",
        {
            params
        }
    );

    return res.data;

};

// ======================================================
// GET SINGLE SALES TEAM MEMBER
// ======================================================

export const getSalesTeamMember = async (id) => {

    const res = await api.get(
        `/sales/team/${id}`
    );

    return res.data;

};