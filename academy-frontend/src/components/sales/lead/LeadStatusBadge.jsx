const colors = {
    NEW:          "bg-blue-100 text-blue-800",
    CONTACTED:    "bg-yellow-100 text-yellow-800",
    QUALIFIED:    "bg-purple-100 text-purple-800",
    INTERESTED:   "bg-cyan-100 text-cyan-800",
    NEGOTIATION:  "bg-orange-100 text-orange-800",
    CONVERTED:    "bg-green-100 text-green-800",
    LOST:         "bg-red-100 text-red-800",
};

const darkColors = {
    NEW:          "dark:bg-blue-950 dark:text-blue-300",
    CONTACTED:    "dark:bg-yellow-950 dark:text-yellow-300",
    QUALIFIED:    "dark:bg-purple-950 dark:text-purple-300",
    INTERESTED:   "dark:bg-cyan-950 dark:text-cyan-300",
    NEGOTIATION:  "dark:bg-orange-950 dark:text-orange-300",
    CONVERTED:    "dark:bg-green-950 dark:text-green-300",
    LOST:         "dark:bg-red-950 dark:text-red-300",
};

export default function LeadStatusBadge({ status }) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border ${colors[status] || "bg-muted text-muted-foreground border-border"} ${darkColors[status] || "dark:bg-muted dark:text-muted-foreground dark:border-border"}`}
        >
            {status}
        </span>
    );
}