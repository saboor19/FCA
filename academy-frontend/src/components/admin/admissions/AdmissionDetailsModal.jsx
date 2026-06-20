"use client";

import { useEffect, useState } from "react";
import {
  getAdmission,
  approveAdmission,
  rejectAdmission
} from "@/services/admin/admissionService";
import {
  getBatches
} from "@/services/admin/batchService";

// ─── Icons ───
const Icons = {
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Mail: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  GraduationCap: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>,
  BookOpen: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Heart: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  Target: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  MessageCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Loader: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
  Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
};

// ─── Section Card Component ───
function SectionCard({ icon: Icon, title, children, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-card border border-border-custom rounded-2xl p-6 transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon />
        </div>
        <h3 className="font-bold text-lg text-foreground">{title}</h3>
      </div>
      {children}
    </section>
  );
}

// ─── Info Field Component ───
function InfoField({ label, value, icon: Icon }) {
  return (
    <div className="group p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-200">
      <div className="flex items-center gap-2 mb-1.5">
        {Icon && <span className="text-muted-foreground"><Icon /></span>}
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-medium text-foreground text-sm">{value || "—"}</p>
    </div>
  );
}

// ─── Status Badge ───
function StatusBadge({ status }) {
  const config = {
    PENDING: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-500", icon: Icons.Clock },
    APPROVED: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500", icon: Icons.Check },
    REJECTED: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", dot: "bg-red-500", icon: Icons.X }
  };

  const conf = config[status] || config.PENDING;
  const StatusIcon = conf.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${conf.bg} ${conf.color} ${conf.border}`}>
      <span className={`w-2 h-2 rounded-full ${conf.dot} ${status === 'PENDING' ? 'animate-pulse' : ''}`} />
      <StatusIcon />
      {status}
    </span>
  );
}

// ─── Interest Chip ───
function InterestChip({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors cursor-default">
      <Icons.Target />
      {label}
    </span>
  );
}

// ─── Action Button ───
function ActionButton({ onClick, disabled, variant, children, icon: Icon }) {
  const variants = {
    approve: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20",
    reject: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20",
    neutral: "bg-muted hover:bg-muted/80 text-foreground border border-border-custom"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {disabled ? <Icons.Loader /> : <Icon />}
      {children}
    </button>
  );
}

// ─── Form Select ───
function FormSelect({ label, value, onChange, children, icon: Icon }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        {Icon && <Icon />}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border-custom text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none pr-10"
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </div>
  );
}

// ─── Form Textarea ───
function FormTextarea({ label, value, onChange, placeholder, icon: Icon }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        {Icon && <Icon />}
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 rounded-xl bg-muted border border-border-custom text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
      />
    </div>
  );
}

import { useRef } from "react";

export default function AdmissionDetailsModal({ id, onClose, refresh }) {
  const [request, setRequest] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [admissionResponse, batchResponse] = await Promise.all([
        getAdmission(id),
        getBatches()
      ]);
      setRequest(admissionResponse.data);
      setBatches(batchResponse.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedBatch) {
      return alert("Please select a batch");
    }
    try {
      setProcessing(true);
      await approveAdmission(id, selectedBatch);
      refresh();
      onClose();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to approve admission");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setProcessing(true);
      await rejectAdmission(id, rejectReason);
      refresh();
      onClose();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to reject admission");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-card border border-border-custom rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">Loading admission details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return null;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Icons.User },
    { id: "academic", label: "Academic", icon: Icons.GraduationCap },
    { id: "interests", label: "Interests", icon: Icons.Target },
    { id: "action", label: "Action", icon: Icons.Sparkles }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border-custom rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col animate-slide-up">
        
        {/* ─── Header ─── */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-xl border-b border-border-custom px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icons.User />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Admission Details</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <StatusBadge status={request.status} />
                <span className="text-xs text-muted-foreground">
                  Applied {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "—"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close modal"
          >
            <Icons.X />
          </button>
        </div>

        {/* ─── Tab Navigation (Mobile) ─── */}
        <div className="lg:hidden border-b border-border-custom px-4 py-2 flex gap-1 overflow-x-auto shrink-0">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <TabIcon />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── Content ─── */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-3 gap-6 p-6">
            
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Personal Information */}
              <SectionCard icon={Icons.User} title="Personal Information" delay={0}>
                <div className="grid md:grid-cols-2 gap-3">
                  <InfoField label="Full Name" value={request.fullName} icon={Icons.User} />
                  <InfoField label="Email" value={request.email} icon={Icons.Mail} />
                  <InfoField label="Phone" value={request.phone} icon={Icons.Phone} />
                  <InfoField label="Gender" value={request.gender} icon={Icons.User} />
                  <InfoField 
                    label="Date of Birth" 
                    value={request.dateOfBirth ? new Date(request.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "—"} 
                    icon={Icons.Calendar} 
                  />
                </div>
                <div className="mt-3">
                  <InfoField label="Address" value={request.address} icon={Icons.MapPin} />
                </div>
              </SectionCard>

              {/* Guardian Information */}
              <SectionCard icon={Icons.Heart} title="Guardian Information" delay={100}>
                <div className="grid md:grid-cols-2 gap-3">
                  <InfoField label="Guardian Name" value={request.guardianName} icon={Icons.User} />
                  <InfoField label="Guardian Phone" value={request.guardianPhone} icon={Icons.Phone} />
                </div>
              </SectionCard>

              {/* Academic Information */}
              <SectionCard icon={Icons.GraduationCap} title="Academic Information" delay={200}>
                <div className="grid md:grid-cols-2 gap-3">
                  <InfoField label="Qualification" value={request.currentEducation} icon={Icons.BookOpen} />
                  <InfoField label="Institution" value={request.institutionName} icon={Icons.BookOpen} />
                  <InfoField label="Passing Year" value={request.passingYear} icon={Icons.Calendar} />
                  <InfoField 
                    label="Preferred Course" 
                    value={request.preferredCourse?.title} 
                    icon={Icons.GraduationCap} 
                  />
                </div>
              </SectionCard>

              {/* Interests */}
              <SectionCard icon={Icons.Target} title="Interests & Goals" delay={300}>
                <div className="flex flex-wrap gap-2 mb-6">
                  {request.interests?.map((interest) => (
                    <InterestChip key={interest} label={interest} />
                  ))}
                  {(!request.interests || request.interests.length === 0) && (
                    <p className="text-muted-foreground text-sm italic">No interests specified</p>
                  )}
                </div>
                <div className="bg-muted/50 rounded-xl p-4 border border-border-custom">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Icons.Target />
                    Career Goals
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    {request.careerGoal || "No career goals specified"}
                  </p>
                </div>
              </SectionCard>

              {/* Lead Source */}
              <SectionCard icon={Icons.MessageCircle} title="Lead Source" delay={400}>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border-custom">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Icons.MessageCircle />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">How they heard about us</p>
                    <p className="font-medium text-foreground">{request.heardFrom || "—"}</p>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              
              {/* Applicant Profile Card */}
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-2xl p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 text-2xl font-bold">
                  {request.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || "?"}
                </div>
                <h3 className="font-bold text-foreground text-lg">{request.fullName}</h3>
                <p className="text-sm text-muted-foreground mt-1">{request.email}</p>
                <div className="mt-4 pt-4 border-t border-border-custom">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                      <p className="font-semibold text-sm mt-1">{request.status}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Applied</p>
                      <p className="font-semibold text-sm mt-1">
                        {request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Section - Only for PENDING */}
              {request.status === "PENDING" && (
                <div className="bg-card border border-border-custom rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Icons.Sparkles />
                    </div>
                    <h3 className="font-bold text-foreground">Admission Action</h3>
                  </div>

                  <div className="space-y-4">
                    <FormSelect
                      label="Assign to Batch"
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                      icon={Icons.Users}
                    >
                      <option value="">Select a batch</option>
                      {batches.map((batch) => (
                        <option key={batch._id} value={batch._id}>
                          {batch.name}
                        </option>
                      ))}
                    </FormSelect>

                    <FormTextarea
                      label="Rejection Reason (Optional)"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Provide reason if rejecting..."
                      icon={Icons.AlertTriangle}
                    />

                    <div className="flex gap-3 pt-2">
                      <ActionButton
                        onClick={handleApprove}
                        disabled={processing}
                        variant="approve"
                        icon={Icons.Check}
                      >
                        Approve
                      </ActionButton>
                      <ActionButton
                        onClick={handleReject}
                        disabled={processing}
                        variant="reject"
                        icon={Icons.X}
                      >
                        Reject
                      </ActionButton>
                    </div>
                  </div>
                </div>
              )}

              {/* Already Processed Notice */}
              {request.status !== "PENDING" && (
                <div className="bg-muted/50 border border-border-custom rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                    {request.status === "APPROVED" ? <Icons.Check /> : <Icons.AlertTriangle />}
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Already {request.status.toLowerCase()}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    This application has been {request.status.toLowerCase()} and cannot be modified.
                  </p>
                </div>
              )}

              {/* Notes */}
              {request.notes && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5">
                  <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Icons.MessageCircle />
                    Additional Notes
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                    {request.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}