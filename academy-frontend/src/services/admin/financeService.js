// ===================================================
// services/admin/financeService.js
// ===================================================

import api from "@/lib/api";

// ---------------------------------------------------
// GET FINANCE OVERVIEW
// params: { batchId?, status?, paymentType?, month?, year? }
// ---------------------------------------------------

export async function getFinanceOverview(params = {}){

  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    )
  ).toString();

  const url = query
    ? `/admin/finance/overview?${query}`
    : `/admin/finance/overview`;

  const res = await api.get(url);

  return res.data;

}