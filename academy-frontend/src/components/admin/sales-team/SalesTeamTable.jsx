// app/admin/sales-team/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  ArrowUpDown,
  X,
  ChevronDown,
  Users,
  Target,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SalesTeamForm from "@/components/admin/sales-team/SalesTeamForm";

import {
  createSalesTeamMember,
  deleteSalesTeamMember,
  getSalesTeamMembers,
} from "@/services/admin/salesTeamService";

export default function SalesTeamPage() {
  const [members, setMembers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await getSalesTeamMembers();
      const data = response.data || [];
      setMembers(data);
      setManagers(data.filter((m) => m.employmentStatus === "ACTIVE"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load sales team.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Delete ${member.userId?.fullName}? This action cannot be undone.`)) return;
    try {
      const response = await deleteSalesTeamMember(member._id);
      toast.success(response.message);
      loadMembers();
      setSelectedMembers((prev) => {
        const next = new Set(prev);
        next.delete(member._id);
        return next;
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete member.");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedMembers.size} selected members?`)) return;
    // Implement bulk delete API call
    toast.success("Bulk delete initiated");
    setSelectedMembers(new Set());
    loadMembers();
  };

  const handleCreate = async (formData) => {
    try {
      setSubmitting(true);
      const response = await createSalesTeamMember(formData);
      toast.success(response.message);
      setCreating(false);
      loadMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleSelectAll = () => {
    if (selectedMembers.size === filteredMembers.length) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(filteredMembers.map((m) => m._id)));
    }
  };

  const toggleSelect = (id) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredMembers = members
    .filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.userId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.designation?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || m.employmentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aVal = sortConfig.key === "name" ? a.userId?.fullName : a[sortConfig.key];
      const bVal = sortConfig.key === "name" ? b.userId?.fullName : b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const stats = [
    {
      label: "Total Members",
      value: members.length,
      icon: Users,
      accent: "primary",
    },
    {
      label: "Active",
      value: members.filter((m) => m.employmentStatus === "ACTIVE").length,
      icon: TrendingUp,
      accent: "success",
    },
    {
      label: "On Leave",
      value: members.filter((m) => m.employmentStatus === "ON_LEAVE").length,
      icon: AlertCircle,
      accent: "warning",
    },
    {
      label: "Avg Monthly Target",
      value: members.length
        ? Math.round(
            members.reduce((sum, m) => sum + (m.monthlyLeadTarget || 0), 0) /
              members.length
          )
        : 0,
      icon: Target,
      accent: "info",
    },
  ];

  const statusBadge = (status) => {
    const variants = {
      ACTIVE: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
      ON_LEAVE: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
      RESIGNED: "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]",
      TERMINATED: "bg-[var(--destructive)]/10 text-[var(--destructive)] border-[var(--destructive)]/20",
    };
    return variants[status] || variants.TERMINATED;
  };

  if (creating) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="space-y-6">
          {/* Breadcrumb + Header */}
          <div className="border-b border-[var(--border)] pb-4">
            <nav className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-3">
              <button onClick={() => setCreating(false)} className="hover:text-[var(--foreground)] transition-colors">
                Sales Team
              </button>
              <span>/</span>
              <span className="text-[var(--foreground)] font-medium">Add Member</span>
            </nav>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Add Sales Team Member</h1>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  Create a new member profile with targets and assignments.
                </p>
              </div>
              <button
                onClick={() => setCreating(false)}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>

          <SalesTeamForm managers={managers} loading={submitting} onSubmit={handleCreate} />
        </div>
      </DashboardLayout>
    );
  }

  return (
      <div className="space-y-6">
        {/* Page Header */}
        {/* <div className="flex items-end justify-between border-b border-[var(--border)] pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sales Team</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Manage team members, targets, and employment status.
            </p>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2.5 font-medium hover:bg-[var(--primary-hover)] transition-colors"
          >
            <Plus size={18} />
            Add Member
          </button>
        </div> */}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border border-[var(--border)] bg-[var(--card)] p-4 flex items-center gap-4"
            >
              <div
                className="p-3 bg-[var(--primary-muted)] text-[var(--primary)]"
                style={{
                  backgroundColor: `var(--${stat.accent}-muted, var(--primary-muted))`,
                  color: `var(--${stat.accent}, var(--primary))`,
                }}
              >
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="border border-[var(--border)] bg-[var(--card)]">
          {/* Search & Filters Bar */}
          <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Search by name, email, ID, or designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 border text-sm font-medium transition-colors ${
                  showFilters || statusFilter !== "ALL"
                    ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--primary-muted)]"
                    : "border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                <Filter size={16} />
                Filters
                {statusFilter !== "ALL" && (
                  <span className="ml-1 w-2 h-2 bg-[var(--primary)]" />
                )}
              </button>
              {selectedMembers.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2.5 border border-[var(--destructive)] text-[var(--destructive)] text-sm font-medium hover:bg-[var(--destructive)] hover:text-white transition-colors"
                >
                  <Trash2 size={16} />
                  Delete ({selectedMembers.size})
                </button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--muted)]/50 flex flex-wrap gap-3 items-center">
              <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Status:
              </span>
              {["ALL", "ACTIVE", "ON_LEAVE", "RESIGNED", "TERMINATED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                    statusFilter === status
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {status === "ALL" ? "All Status" : status.replace("_", " ")}
                </button>
              ))}
              {statusFilter !== "ALL" && (
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] ml-auto flex items-center gap-1"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)] text-left text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={filteredMembers.length > 0 && selectedMembers.size === filteredMembers.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                  </th>
                  <th className="px-4 py-3 cursor-pointer hover:text-[var(--foreground)] transition-colors" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1">
                      Employee
                      <ArrowUpDown size={12} className={sortConfig.key === "name" ? "text-[var(--primary)]" : ""} />
                    </div>
                  </th>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3 cursor-pointer hover:text-[var(--foreground)] transition-colors" onClick={() => handleSort("employmentStatus")}>
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown size={12} className={sortConfig.key === "employmentStatus" ? "text-[var(--primary)]" : ""} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:text-[var(--foreground)] transition-colors" onClick={() => handleSort("dailyLeadTarget")}>
                    <div className="flex items-center justify-end gap-1">
                      Daily
                      <ArrowUpDown size={12} className={sortConfig.key === "dailyLeadTarget" ? "text-[var(--primary)]" : ""} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:text-[var(--foreground)] transition-colors" onClick={() => handleSort("monthlyLeadTarget")}>
                    <div className="flex items-center justify-end gap-1">
                      Monthly
                      <ArrowUpDown size={12} className={sortConfig.key === "monthlyLeadTarget" ? "text-[var(--primary)]" : ""} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center text-[var(--muted-foreground)]">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[var(--border)] border-t-[var(--primary)] animate-spin" />
                        <span className="text-sm">Loading team members...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-[var(--muted-foreground)]">
                        <Search size={32} className="opacity-40" />
                        <p className="text-sm">No members found matching your criteria.</p>
                        {(searchQuery || statusFilter !== "ALL") && (
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setStatusFilter("ALL");
                            }}
                            className="text-[var(--primary)] hover:underline text-sm"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr
                      key={member._id}
                      className={`border-b border-[var(--border)] last:border-0 transition-colors ${
                        selectedMembers.has(member._id)
                          ? "bg-[var(--primary-muted)]"
                          : "hover:bg-[var(--muted)]"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedMembers.has(member._id)}
                          onChange={() => toggleSelect(member._id)}
                          className="w-4 h-4 border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[var(--primary)] text-white flex items-center justify-center text-sm font-bold">
                            {member.userId?.fullName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-[var(--foreground)]">{member.userId?.fullName}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">{member.userId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">
                        {member.employeeId}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-1 bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]">
                          {member.designation}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{member.department}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{member.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold border ${statusBadge(member.employmentStatus)}`}>
                          {member.employmentStatus?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm">{member.dailyLeadTarget || 0}</td>
                      <td className="px-4 py-3 text-right font-mono text-sm">{member.monthlyLeadTarget || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => window.location.href = `/admin/sales-team/${member._id}`}
                            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary-muted)] transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => window.location.href = `/admin/sales-team/${member._id}/edit`}
                            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--info)] hover:bg-[var(--info)]/10 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(member)}
                            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination Placeholder */}
          {!loading && filteredMembers.length > 0 && (
            <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--muted)]/30 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
              <span>
                Showing <span className="font-medium text-[var(--foreground)]">{filteredMembers.length}</span> of{" "}
                <span className="font-medium text-[var(--foreground)]">{members.length}</span> members
              </span>
              <div className="flex gap-1">
                <button className="px-3 py-1.5 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors disabled:opacity-40" disabled>
                  Previous
                </button>
                <button className="px-3 py-1.5 border border-[var(--border)] bg-[var(--primary)] text-white font-medium">
                  1
                </button>
                <button className="px-3 py-1.5 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors disabled:opacity-40" disabled>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
   
  );
}