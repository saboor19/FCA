"use client";

export default function SectionCard({ title, description, children }) {
    return (
        <div className="border border-border bg-card">
            <div className="border-b border-border px-6 py-4 bg-muted">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    {title}
                </h2>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}