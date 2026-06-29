const sourceIcons = {
    "Website": "🌐",
    "Referral": "👤",
    "Social Media": "📱",
    "Email Campaign": "📧",
    "Cold Call": "📞",
    "Walk-in": "🚪",
    "Advertisement": "📢",
    "Event": "🎪",
    "Partner": "🤝",
};

export default function LeadSourceBadge({ source }) {
    const icon = sourceIcons[source] || "•";

    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
            <span className="text-muted-foreground" aria-hidden="true">{icon}</span>
            {source}
        </span>
    );
}