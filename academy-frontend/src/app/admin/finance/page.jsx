"use client";

// ===================================================
// app/admin/finance/page.jsx
// ===================================================

import {
  useEffect,
  useState,
  useCallback,
  useRef
} from "react";

import DashboardLayout
  from "@/components/dashboard/DashboardLayout";

import AcademyLoader
  from "@/components/ui/AcademyLoader";

import {
  IndianRupee,
  AlertCircle,
  CreditCard,
  TrendingUp,
  Tag,
  SlidersHorizontal,
  ArrowUpRight,
  Wallet
} from "lucide-react";

import {
  getFinanceOverview
} from "@/services/admin/financeService";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// ===================================================
// CONSTANTS
// ===================================================

const STATUS_COLORS = {
  PAID:    { bg: "#1D9E75", light: "#E1F5EE", dark: "#085041" },
  PARTIAL: { bg: "#BA7517", light: "#FAEEDA", dark: "#633806" },
  OVERDUE: { bg: "#E24B4A", light: "#FCEBEB", dark: "#791F1F" },
  PENDING: { bg: "#7F77DD", light: "#EEEDFE", dark: "#3C3489" }
};

const METHOD_LABELS = {
  UPI:           "UPI",
  CASH:          "Cash",
  CARD:          "Card",
  BANK_TRANSFER: "Bank"
};

const MONTHS = [
  "January","February","March","April",
  "May","June","July","August",
  "September","October","November","December"
];

// ===================================================
// SUB-COMPONENTS
// ===================================================

function KPICard({ title, value, sub, icon: Icon, accent }){
  return(
    <div
      className="
        bg-card
        border border-border-custom
        rounded-2xl
        p-5
      "
    >
      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <h2
            className="text-2xl font-bold mt-2 truncate"
            style={{ color: accent }}
          >
            {value}
          </h2>
          {sub && (
            <p className="text-xs text-slate-400 mt-1">
              {sub}
            </p>
          )}
        </div>

        <div
          className="
            h-11 w-11 shrink-0
            rounded-xl
            flex items-center justify-center
          "
          style={{ background: accent + "1A" }}
        >
          <Icon size={20} style={{ color: accent }} />
        </div>

      </div>
    </div>
  );
}

// ---------------------------------------------------

function StatusBadge({ status }){
  const c = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
  return(
    <span
      className="
        inline-block
        px-2 py-0.5
        rounded text-xs font-medium
      "
      style={{
        background: c.light,
        color:      c.dark
      }}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

// ---------------------------------------------------

function MethodBadge({ method }){
  return(
    <span
      className="
        inline-block
        px-2 py-0.5
        rounded text-xs font-medium
        bg-slate-100 text-slate-600
        dark:bg-slate-800 dark:text-slate-300
      "
    >
      {METHOD_LABELS[method] || method}
    </span>
  );
}

// ---------------------------------------------------

function SectionPanel({ title, sub, icon: Icon, count, children }){
  return(
    <div
      className="
        bg-card
        border border-border-custom
        rounded-2xl
        p-5
      "
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
        </div>
        <div className="flex items-center gap-2">
          {count !== undefined && (
            <span
              className="
                text-xs px-2 py-0.5 rounded-full
                border border-border-custom
                text-slate-500
              "
            >
              {count}
            </span>
          )}
          {Icon && (
            <Icon size={16} className="text-slate-400" />
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ===================================================
// MAIN PAGE
// ===================================================

export default function FinancePage(){

  const [loading,  setLoading ] = useState(true);
  const [finance,  setFinance ] = useState(null);

  // ---------------------------------------------------
  // FILTER STATE
  // ---------------------------------------------------

  const [filters, setFilters] = useState({
    batchId:     "",
    status:      "",
    paymentType: "",
    month:       ""
  });

  // ---------------------------------------------------
  // FETCH
  // ---------------------------------------------------

  const fetchFinance = useCallback(async () => {

    setLoading(true);

    try{

      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "")
      );

      const data = await getFinanceOverview(params);
      setFinance(data.data);

    }catch(error){

      console.error(error);

    }finally{

      setLoading(false);

    }

  }, [filters]);

  // ---------------------------------------------------

  useEffect(() => {
    fetchFinance();
  }, [fetchFinance]);

  // ---------------------------------------------------
  // FILTER CHANGE
  // ---------------------------------------------------

  function handleFilter(key, value){
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  // ---------------------------------------------------
  // DERIVED: batch options from batchSummary
  // ---------------------------------------------------

  const batchOptions = finance?.batchSummary || [];

  // ---------------------------------------------------
  // CHARTS DATA
  // ---------------------------------------------------

  const barData = {
    labels: (finance?.batchSummary || []).map(
      b => b.batchName || "Unknown"
    ),
    datasets:[
      {
        label:           "Collected",
        data:            (finance?.batchSummary || []).map(b => b.collected),
        backgroundColor: "#1D9E75",
        borderRadius:    4,
        barPercentage:   0.6
      },
      {
        label:           "Pending",
        data:            (finance?.batchSummary || []).map(b => b.pending),
        backgroundColor: "#F09995",
        borderRadius:    4,
        barPercentage:   0.6
      }
    ]
  };

  const barOptions = {
    responsive:          true,
    maintainAspectRatio: false,
    plugins:{
      legend:{ display: false },
      tooltip:{
        callbacks:{
          label: c =>
            `${c.dataset.label}: ₹${Number(c.raw).toLocaleString("en-IN")}`
        }
      }
    },
    scales:{
      x:{
        grid:{ display: false },
        ticks:{ font:{ size: 11 } }
      },
      y:{
        grid:{ color: "rgba(128,128,128,0.1)" },
        ticks:{
          callback: v =>
            "₹" + (v / 1000).toFixed(0) + "k",
          font:{ size: 11 }
        }
      }
    }
  };

  // ---------------------------------------------------

  const statusBreakdown = finance?.statusBreakdown || [];

  const donutLabels = statusBreakdown.map(s => s._id);
  const donutData   = statusBreakdown.map(s => s.count);
  const donutColors = donutLabels.map(
    l => STATUS_COLORS[l]?.bg || "#888"
  );

  const donutChartData = {
    labels: donutLabels,
    datasets:[{
      data:            donutData,
      backgroundColor: donutColors,
      borderWidth:     0,
      hoverOffset:     4
    }]
  };

  const donutOptions = {
    responsive:          true,
    maintainAspectRatio: false,
    cutout:              "70%",
    plugins:{
      legend:{ display: false }
    }
  };

  // ---------------------------------------------------
  // RENDER: LOADING
  // ---------------------------------------------------

  if(loading){
    return(
      <DashboardLayout role="ADMIN">
        <AcademyLoader text="Loading Finance Dashboard..." />
      </DashboardLayout>
    );
  }

  // ---------------------------------------------------
  // KPI DATA
  // ---------------------------------------------------

  const kpis = [

    {
      title:  "Total collected",
      value:  `₹${Number(finance?.totalRevenue || 0).toLocaleString("en-IN")}`,
      sub:    `${(finance?.statusBreakdown?.find(s => s._id === "PAID")?.count || 0)} fully paid accounts`,
      icon:   IndianRupee,
      accent: "#0F6E56"
    },

    {
      title:  "Pending dues",
      value:  `₹${Number(finance?.totalPending || 0).toLocaleString("en-IN")}`,
      sub:    `${finance?.totalOverdue || 0} overdue accounts`,
      icon:   AlertCircle,
      accent: "#993C1D"
    },

    {
      title:  "Active EMIs",
      value:  finance?.activeEMIs || 0,
      sub:    "instalment plans running",
      icon:   CreditCard,
      accent: "#534AB7"
    },

    {
      title:  "Collection rate",
      value:  `${finance?.collectionRate || 0}%`,
      sub:    "of total billed amount",
      icon:   TrendingUp,
      accent: "#185FA5"
    },

    {
      title:  "Discounts given",
      value:  `₹${Number(finance?.totalDiscount || 0).toLocaleString("en-IN")}`,
      sub:    "across all fee accounts",
      icon:   Tag,
      accent: "#854F0B"
    }

  ];

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------

  return(

    <DashboardLayout role="ADMIN">

      <div className="space-y-6">

        {/* ---- HEADER ---- */}

        <div>
          <h1 className="text-2xl font-bold">
            Finance Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor collections, dues, and payment activity.
          </p>
        </div>

        {/* ---- FILTER BAR ---- */}

        <div
          className="
            flex flex-wrap items-center gap-3
            bg-card
            border border-border-custom
            rounded-2xl
            px-4 py-3
          "
        >

          <SlidersHorizontal
            size={15}
            className="text-slate-400 shrink-0"
          />

          <span className="text-xs text-slate-500 shrink-0">
            Filters
          </span>

          <select
            value={filters.batchId}
            onChange={e => handleFilter("batchId", e.target.value)}
            className="
              text-sm
              border border-border-custom
              rounded-lg px-3 py-1.5
              bg-background text-foreground
              focus:outline-none
            "
          >
            <option value="">All batches</option>
            {batchOptions.map(b => (
              <option key={b._id} value={b._id}>
                {b.batchName}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={e => handleFilter("status", e.target.value)}
            className="
              text-sm
              border border-border-custom
              rounded-lg px-3 py-1.5
              bg-background text-foreground
              focus:outline-none
            "
          >
            <option value="">All statuses</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="OVERDUE">Overdue</option>
            <option value="PENDING">Pending</option>
          </select>

          <select
            value={filters.paymentType}
            onChange={e => handleFilter("paymentType", e.target.value)}
            className="
              text-sm
              border border-border-custom
              rounded-lg px-3 py-1.5
              bg-background text-foreground
              focus:outline-none
            "
          >
            <option value="">All payment types</option>
            <option value="FULL">Full payment</option>
            <option value="EMI">EMI</option>
          </select>

          <select
            value={filters.month}
            onChange={e => handleFilter("month", e.target.value)}
            className="
              text-sm
              border border-border-custom
              rounded-lg px-3 py-1.5
              bg-background text-foreground
              focus:outline-none
            "
          >
            <option value="">All months</option>
            {MONTHS.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          {/* ACTIVE FILTER INDICATORS */}

          {Object.values(filters).some(v => v !== "") && (
            <button
              onClick={() => setFilters({
                batchId: "", status: "", paymentType: "", month: ""
              })}
              className="
                ml-auto
                text-xs text-slate-500
                hover:text-red-500
                transition-colors
              "
            >
              Clear filters ×
            </button>
          )}

        </div>

        {/* ---- KPI STRIP ---- */}

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            xl:grid-cols-5
            gap-4
          "
        >
          {kpis.map((k, i) => (
            <KPICard key={i} {...k} />
          ))}
        </div>

        {/* ---- CHARTS ROW ---- */}

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-5
            gap-5
          "
        >

          {/* BAR CHART — 3 cols */}

          <div
            className="
              xl:col-span-3
              bg-card
              border border-border-custom
              rounded-2xl
              p-5
            "
          >

            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold">
                Collections vs dues — by batch
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ background: "#1D9E75" }}
                  />
                  Collected
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ background: "#F09995" }}
                  />
                  Pending
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Collected amount vs outstanding dues per batch
            </p>

            <div style={{ height: 240 }}>
              {(finance?.batchSummary?.length || 0) > 0
                ? <Bar data={barData} options={barOptions} />
                : <p className="text-sm text-slate-400 pt-16 text-center">
                    No data for current filters.
                  </p>
              }
            </div>

          </div>

          {/* DONUT CHART — 2 cols */}

          <div
            className="
              xl:col-span-2
              bg-card
              border border-border-custom
              rounded-2xl
              p-5
            "
          >

            <h2 className="text-base font-semibold mb-1">
              Fee status breakdown
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Distribution across payment statuses
            </p>

            {/* custom legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
              {statusBreakdown.map((s, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-slate-500"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ background: STATUS_COLORS[s._id]?.bg || "#888" }}
                  />
                  {s._id.charAt(0) + s._id.slice(1).toLowerCase()}
                  {" "}{s.count}
                </span>
              ))}
            </div>

            <div style={{ height: 180 }}>
              {donutData.length > 0
                ? <Doughnut data={donutChartData} options={donutOptions} />
                : <p className="text-sm text-slate-400 pt-12 text-center">
                    No data for current filters.
                  </p>
              }
            </div>

          </div>

        </div>

        {/* ---- TABLES ROW ---- */}

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-5
          "
        >

          {/* RECENT TRANSACTIONS */}

          <SectionPanel
            title="Recent transactions"
            sub="Latest payments received, newest first"
            icon={ArrowUpRight}
            count={`${finance?.recentTransactions?.length || 0} entries`}
          >

            {(finance?.recentTransactions?.length || 0) > 0

              ?

              <div className="overflow-x-auto">
                <table className="w-full text-sm">

                  <thead>
                    <tr className="border-b border-border-custom">
                      <th className="text-left text-xs text-slate-500 font-normal pb-2 pr-3">
                        Student
                      </th>
                      <th className="text-left text-xs text-slate-500 font-normal pb-2 pr-3">
                        Batch
                      </th>
                      <th className="text-right text-xs text-slate-500 font-normal pb-2 pr-3">
                        Amount
                      </th>
                      <th className="text-right text-xs text-slate-500 font-normal pb-2 pr-3">
                        Method
                      </th>
                      <th className="text-right text-xs text-slate-500 font-normal pb-2">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {finance.recentTransactions.map((tx, i) => (
                      <tr
                        key={i}
                        className="
                          border-b border-border-custom
                          last:border-0
                          hover:bg-muted/30
                          transition-colors
                        "
                      >
                        <td className="py-2.5 pr-3 font-medium max-w-[120px] truncate">
                          {tx.student || "—"}
                        </td>
                        <td className="py-2.5 pr-3 text-slate-500 text-xs max-w-[100px] truncate">
                          {tx.batch || "—"}
                        </td>
                        <td className="py-2.5 pr-3 text-right font-semibold"
                          style={{ color: "#0F6E56" }}
                        >
                          ₹{Number(tx.amount).toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 pr-3 text-right">
                          <MethodBadge method={tx.paymentMethod} />
                        </td>
                        <td className="py-2.5 text-right text-xs text-slate-400">
                          {tx.paymentDate
                            ? new Date(tx.paymentDate).toLocaleDateString(
                                "en-IN",
                                { day: "2-digit", month: "short" }
                              )
                            : "—"
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

              :

              <p className="text-sm text-slate-400 py-6 text-center">
                No transactions match the current filters.
              </p>

            }

          </SectionPanel>

          {/* UPCOMING DUES */}

          <SectionPanel
            title="Upcoming EMI dues"
            sub="Sorted by nearest due date"
            icon={Wallet}
            count={`${finance?.upcomingDues?.length || 0} entries`}
          >

            {(finance?.upcomingDues?.length || 0) > 0

              ?

              <div className="space-y-0">

                {finance.upcomingDues.map((item) => {

                  const today  = new Date();
                  const due    = new Date(item.nextDueDate);
                  const diff   = Math.round(
                    (due - today) / (1000 * 60 * 60 * 24)
                  );

                  const urgencyColor =
                    diff < 0  ? "#E24B4A" :
                    diff <= 7 ? "#BA7517" :
                    undefined;

                  const dueLabel =
                    diff < 0   ? `${Math.abs(diff)}d overdue` :
                    diff === 0 ? "Due today" :
                    `${diff}d left`;

                  return(

                    <div
                      key={item._id}
                      className="
                        flex items-center justify-between
                        py-3
                        border-b border-border-custom
                        last:border-0
                      "
                    >

                      <div>
                        <p className="font-medium text-sm">
                          {item.student?.userId?.fullName || "—"}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.batch?.name || "—"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className="font-bold text-sm"
                          style={{ color: "#993C1D" }}
                        >
                          ₹{Number(item.emiAmount).toLocaleString("en-IN")}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{
                            color: urgencyColor || "var(--color-text-tertiary, #94a3b8)"
                          }}
                        >
                          {dueLabel}
                          {" · "}
                          {due.toLocaleDateString("en-IN", {
                            day:   "2-digit",
                            month: "short"
                          })}
                        </p>
                      </div>

                    </div>

                  );

                })}

              </div>

              :

              <p className="text-sm text-slate-400 py-6 text-center">
                No upcoming EMI dues.
              </p>

            }

          </SectionPanel>

        </div>

      </div>

    </DashboardLayout>

  );

}