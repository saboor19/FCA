"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Activity,
  ArrowRightLeft,
  Trash2,
} from "lucide-react";

export default function LeadActions({ lead }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="inline-flex items-center justify-center w-8 h-8 border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 border border-border bg-card shadow-lg z-50">
          <ul className="divide-y divide-border">
            <li>
              <Link
                href={`/sales/leads/${lead._id}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setOpen(false)}
              >
                <Eye size={14} className="text-muted-foreground" />
                View
              </Link>
            </li>
            <li>
              <Link
                href={`/sales/leads/edit/${lead._id}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setOpen(false)}
              >
                <Pencil size={14} className="text-muted-foreground" />
                Edit
              </Link>
            </li>
            <li>
              <Link
                href={`/sales/leads/${lead._id}/activities`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setOpen(false)}
              >
                <Activity size={14} className="text-muted-foreground" />
                Activities
              </Link>
            </li>
            <li>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                onClick={() => setOpen(false)}
              >
                <ArrowRightLeft size={14} className="text-muted-foreground" />
                Convert
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                onClick={() => setOpen(false)}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
