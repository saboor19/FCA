export default function LeadEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center border border-border bg-card py-20 px-6">
            <div className="mb-6 p-4 border border-border bg-muted">
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-muted-foreground"
                    aria-hidden="true"
                >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            </div>

            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                No Leads Found
            </h2>

            <p className="mt-2 text-xs text-muted-foreground max-w-xs text-center leading-relaxed">
                There are no leads in the system. Use the action above to create your first lead record.
            </p>
        </div>
    );
}