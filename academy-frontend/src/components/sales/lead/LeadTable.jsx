import LeadTableRow from "./LeadTableRow";
import LeadEmptyState from "./LeadEmptyState";
import LeadLoading from "./LeadLoading";

export default function LeadTable({ leads, loading }) {
  if (loading) return <LeadLoading />;

  if (!leads.length) return <LeadEmptyState />;

  return (
    <div className="overflow-x-auto border border-border bg-card">
      <table className="w-full  text-left border-collapse">
        <thead className="bg-muted border-b border-border">
          <tr>
            <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Lead #
            </th>
            <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Name
            </th>
            <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Phone
            </th>
            <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Course
            </th>
            <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Source
            </th>
            <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Priority
            </th>
            <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Next Follow-up
            </th>
            <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground w-16">
              {/* Actions — intentionally blank header */}
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <LeadTableRow key={lead._id} lead={lead} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
