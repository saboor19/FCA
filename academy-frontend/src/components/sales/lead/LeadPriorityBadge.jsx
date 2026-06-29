const colors = {
    LOW:    "bg-neutral-100 text-neutral-700 border-neutral-300",
    MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-300",
    HIGH:   "bg-red-100 text-red-800 border-red-300",
};

const darkColors = {
    LOW:    "dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-700",
    MEDIUM: "dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
    HIGH:   "dark:bg-red-950 dark:text-red-300 dark:border-red-800",
};

const priorityIcons = {
    LOW:    "↓",
    MEDIUM: "→",
    HIGH:   "↑",
};

export default function LeadPriorityBadge({ priority }) {
    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border ${colors[priority] || "bg-muted text-muted-foreground border-border"} ${darkColors[priority] || "dark:bg-muted dark:text-muted-foreground dark:border-border"}`}
        >
            <span className="text-[10px]" aria-hidden="true">
                {priorityIcons[priority] || "•"}
            </span>
            {priority}
        </span>
    );
}