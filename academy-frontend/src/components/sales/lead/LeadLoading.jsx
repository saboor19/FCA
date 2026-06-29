export default function LeadLoading() {
    return (
        <div className="border border-border bg-card">
            {/* Header skeleton */}
            <div className="flex items-center gap-4 px-4 py-3 border-b border-border bg-muted">
                {[...Array(9)].map((_, i) => (
                    <div
                        key={`h-${i}`}
                        className="h-3 bg-muted-foreground/20 animate-pulse flex-1"
                        style={{ maxWidth: i === 8 ? "4rem" : "none" }}
                    />
                ))}
            </div>

            {/* Row skeletons */}
            <div className="divide-y divide-border">
                {[...Array(8)].map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 px-4 py-3 animate-pulse"
                    >
                        <div className="h-3 bg-muted-foreground/15 w-16" />
                        <div className="h-3 bg-muted-foreground/15 flex-1" />
                        <div className="h-3 bg-muted-foreground/15 w-24" />
                        <div className="h-3 bg-muted-foreground/15 w-32" />
                        <div className="h-3 bg-muted-foreground/15 w-20" />
                        <div className="h-3 bg-muted-foreground/15 w-16" />
                        <div className="h-3 bg-muted-foreground/15 w-14" />
                        <div className="h-3 bg-muted-foreground/15 w-20" />
                        <div className="h-3 bg-muted-foreground/15 w-12" />
                    </div>
                ))}
            </div>
        </div>
    );
}