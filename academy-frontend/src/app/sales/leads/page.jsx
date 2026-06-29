"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { getLeads } from "@/services/sales/leadService";
import {
    LEAD_STATUS,
    LEAD_PRIORITY,
    LEAD_SOURCE,
} from "@/constants/salesConstants";
import LeadFilters from "@/components/sales/lead/LeadFilters";
import LeadTable from "@/components/sales/lead/LeadTable";

export default function LeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
    });
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        priority: "",
        source: "",
    });

    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await getLeads({
                search: debouncedSearch,
                page: pagination.page,
                limit: pagination.limit,
                ...filters,
            });
            setLeads(response.data || []);
            setPagination((prev) => ({
                ...prev,
                total: response.total || 0,
                pages: response.pages || 1,
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [
        pagination.page,
        filters.status,
        filters.priority,
        filters.source,
        debouncedSearch,
    ]);

    const startIndex = (pagination.page - 1) * pagination.limit + 1;
    const endIndex = Math.min(pagination.page * pagination.limit, pagination.total);

    return (
        <div className="space-y-6">
            {/* ── Page Header ─────────────────────── */}
            <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                    <h1 className="text-lg font-bold uppercase tracking-wider text-foreground">
                        Leads
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage and track your admission enquiries
                    </p>
                </div>

                <Link
                    href="/sales/leads/create"
                    className="inline-flex items-center gap-2 h-9 px-4 text-sm font-semibold uppercase tracking-wider border border-primary bg-primary text-white hover:bg-primary-hover transition-colors duration-150"
                >
                    <Plus size={16} />
                    New Lead
                </Link>
            </div>

            {/* ── Filters ─────────────────────────── */}
            <LeadFilters filters={filters} setFilters={setFilters} />

            {/* ── Results Bar ─────────────────────── */}
            <div className="flex items-center justify-between border-b border-border pb-3">
                <p className="text-xs text-muted-foreground">
                    <span className="font-mono font-semibold text-foreground">
                        {startIndex}-{endIndex}
                    </span>
                    <span className="mx-1">of</span>
                    <span className="font-mono font-semibold text-foreground">
                        {pagination.total}
                    </span>
                    <span className="ml-1">records</span>
                </p>

                <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground mr-2">
                        Page {pagination.page} of {pagination.pages}
                    </span>
                </div>
            </div>

            {/* ── Table ───────────────────────────── */}
            <LeadTable leads={leads} loading={loading} />

            {/* ── Pagination ──────────────────────── */}
            <div className="flex items-center justify-between border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">
                    {pagination.total > 0
                        ? `Showing ${startIndex}–${endIndex} of ${pagination.total}`
                        : "No records"}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        className="inline-flex items-center h-8 px-3 text-xs font-semibold uppercase tracking-wider border border-border bg-background text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
                        disabled={pagination.page === 1}
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                page: prev.page - 1,
                            }))
                        }
                    >
                        Previous
                    </button>

                    <span className="inline-flex items-center justify-center h-8 px-3 text-xs font-mono font-semibold border border-border bg-muted text-foreground">
                        {pagination.page}
                    </span>

                    <button
                        className="inline-flex items-center h-8 px-3 text-xs font-semibold uppercase tracking-wider border border-border bg-background text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
                        disabled={pagination.page === pagination.pages}
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                page: prev.page + 1,
                            }))
                        }
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}