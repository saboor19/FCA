"use client";

export default function LeadFilters({ filters, setFilters }) {
  return (
    <div className="border border-border bg-card p-4 mb-6 grid grid-cols-5 gap-3">
      {/* Search */}
      <div className="relative">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search leads..."
          className="w-full h-9 pl-9 pr-3 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          value={filters.search}
          onChange={(e) =>
            setFilters({
              ...filters,
              search: e.target.value,
            })
          }
        />
      </div>

      {/* Status */}
      <select
        className="h-9 px-3 text-sm bg-background border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
        value={filters.status}
        onChange={(e) =>
          setFilters({
            ...filters,
            status: e.target.value,
          })
        }
      >
        <option value="">All Status</option>
        <option value="NEW">NEW</option>
        <option value="CONTACTED">CONTACTED</option>
        <option value="QUALIFIED">QUALIFIED</option>
        <option value="INTERESTED">INTERESTED</option>
        <option value="NEGOTIATION">NEGOTIATION</option>
        <option value="CONVERTED">CONVERTED</option>
        <option value="LOST">LOST</option>
      </select>

      {/* Priority */}
      <select
        className="h-9 px-3 text-sm bg-background border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
        value={filters.priority}
        onChange={(e) =>
          setFilters({
            ...filters,
            priority: e.target.value,
          })
        }
      >
        <option value="">All Priority</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>

      {/* Source */}
      <select
        className="h-9 px-3 text-sm bg-background border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
        value={filters.source}
        onChange={(e) =>
          setFilters({
            ...filters,
            source: e.target.value,
          })
        }
      >
        <option value="">All Sources</option>
        <option value="WEBSITE">Website</option>
        <option value="FACEBOOK">Facebook</option>
        <option value="INSTAGRAM">Instagram</option>
        <option value="REFERRAL">Referral</option>
        <option value="EMAIL_CAMPAIGN">Email Campaign</option>
        <option value="COLD_CALL">Cold Call</option>
        <option value="WALK_IN">Walk-in</option>
      </select>

      {/* Reset */}
      <button
        className="h-9 px-4 text-sm font-semibold uppercase tracking-wider border border-border bg-muted text-muted-foreground hover:bg-background hover:text-foreground transition-colors duration-150"
        onClick={() =>
          setFilters({
            search: "",
            status: "",
            priority: "",
            source: "",
          })
        }
      >
        Reset
      </button>
    </div>
  );
}
