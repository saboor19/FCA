"use client";

import Link from "next/link";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";

// You only need to import Button. You can drop `buttonVariants` unless you are using it in a custom className string.
import { Button } from "@/components/ui/button"; 

export default function SalesTeamActions({ member, onDelete }) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold">Actions</h2>

      <div className="space-y-3">
        
        {/* Changed buttonVariants to variant, and used asChild to wrap the Link properly */}
        <Button asChild variant="outline" className="w-full">
          <Link href="/admin/sales-team">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sales Team
          </Link>
        </Button>

        <Button asChild variant="default" className="w-full">
          <Link href={`/admin/sales-team/${member._id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Member
          </Link>
        </Button>

        {/* Standard button with onClick doesn't need a Link or asChild */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => onDelete(member)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Member
        </Button>
        
      </div>
    </div>
  );
}