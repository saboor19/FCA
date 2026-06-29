"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createLead, updateLead } from "@/services/sales/leadService";
import LeadPersonalSection from "./LeadPersonalSection";
import LeadContactSection from "./LeadContactSection";
import LeadAcademicSection from "./LeadAcademicSection";
import LeadCourseSection from "./LeadCourseSection";
import LeadMarketingSection from "./LeadMarketingSection";
import LeadPipelineSection from "./LeadPipelineSection";
import LeadAddressSection from "./LeadAddressSection";

export default function LeadForm({ mode = "create", initialData = {} }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    primaryPhone: "",
    alternatePhone: "",
    whatsappNumber: "",
    email: "",
    country: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
    qualification: "",
    institution: "",
    passingYear: "",
    occupation: "",
    experience: 0,
    interestedCourse: "",
    preferredBatch: "",
    studyMode: "",
    preferredTiming: "",
    budget: "",
    expectedJoiningDate: "",
    source: "",
    subSource: "",
    campaign: "",
    referredBy: "",
    priority: "MEDIUM",
    leadScore: 0,
    initialRemarks: "",
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (mode === "create") {
        await createLead(formData);
        toast.success("Lead created successfully.");
      } else {
        await updateLead(initialData._id, formData);
        toast.success("Lead updated successfully.");
      }
      router.push("/sales/leads");
    } catch (error) {
      toast.error(error?.response?.data?.message || `Failed to ${mode} lead.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LeadPersonalSection formData={formData} handleChange={handleChange} />
      <LeadContactSection formData={formData} handleChange={handleChange} />
      <LeadAcademicSection formData={formData} handleChange={handleChange} />
      <LeadAddressSection formData={formData} handleChange={handleChange} />
      <LeadCourseSection formData={formData} handleChange={handleChange} />
      <LeadMarketingSection formData={formData} handleChange={handleChange} />
      <LeadPipelineSection formData={formData} handleChange={handleChange} />

      {/* ── Form Actions ─────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border bg-background">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-9 px-5 text-xs font-semibold uppercase tracking-wider border border-border bg-background text-foreground hover:bg-muted transition-colors duration-150"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 h-9 px-5 text-xs font-semibold uppercase tracking-wider border border-primary bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving...
            </>
          ) : mode === "create" ? (
            "Create Lead"
          ) : (
            "Update Lead"
          )}
        </button>
      </div>
    </form>
  );
}
