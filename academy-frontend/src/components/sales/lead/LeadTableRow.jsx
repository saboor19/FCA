import LeadStatusBadge from "./LeadStatusBadge";
import LeadPriorityBadge from "./LeadPriorityBadge";
import LeadSourceBadge from "./LeadSourceBadge";
import LeadActions from "./LeadActions";

export default function LeadTableRow({ lead }) {
  return (
    <tr className="border-b border-border transition-colors hover:bg-muted/50">
      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
        {lead.leadNumber}
      </td>

      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-foreground">
            {lead.fullName}
          </p>
          <p className="text-xs text-muted-foreground">{lead.email || "—"}</p>
        </div>
      </td>

      <td className="px-4 py-3 text-sm text-foreground">{lead.primaryPhone}</td>

      <td className="px-4 py-3 text-sm text-foreground">
        {lead.interestedCourse?.title || "—"}
      </td>

      <td className="px-4 py-3">
        <LeadSourceBadge source={lead.source} />
      </td>

      <td className="px-4 py-3">
        <LeadStatusBadge status={lead.status} />
      </td>

      <td className="px-4 py-3">
        <LeadPriorityBadge priority={lead.priority} />
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {lead.nextFollowupAt
          ? new Date(lead.nextFollowupAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—"}
      </td>

      <td className="px-4 py-3">
        <LeadActions lead={lead} />
      </td>
    </tr>
  );
}
