"use client";

import LeadForm from "@/components/sales/lead/form/LeadForm";

export default function CreateLeadPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 ">
      {/* ── Page Header ─────────────────────── */}
      <div className="border-b border-border pb-4">
        <h1 className="text-lg font-bold uppercase tracking-wider bg-background">
          Create Lead
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Register a new admission enquiry
        </p>
      </div>

      <LeadForm />
    </div>
  );
}
