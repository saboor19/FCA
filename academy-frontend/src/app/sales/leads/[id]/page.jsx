"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  DollarSign,
  User,
  ChevronRight,
  Clock,
  Tag,
  Flag,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Plus,
  MoreVertical,
  Copy,
  AlertTriangle,
  Building,
  BookOpen,
  Target,
  TrendingUp,
  UserCheck,
  Send,
  Save,
  Star,
} from "lucide-react";
import LeadTasks from "@/components/sales/tasks/LeadTasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import {
  LEAD_STATUS,
  LEAD_PRIORITY,
  LEAD_SOURCE,
  GENDER,
  STUDY_MODE,
  TIMING,
  ACTIVITY_TYPE_VALUES,
} from "@/constants/salesConstants";

import {
  getLeadById,
  updateLead,
  deleteLead,
  convertLead,
  getLeadActivities,
  createLeadActivity,
  updateLeadActivity,
  deleteLeadActivity,
} from "@/services/sales/leadService";

/* ──────────────────────────────────────────────
   STATUS & PRIORITY CONFIG — synced to constants
   ────────────────────────────────────────────── */
const STATUS_STYLES = {
  NEW: "bg-[var(--primary-muted)] text-[var(--primary)] border-[var(--primary)]",
  CONTACTED:
    "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-400",
  QUALIFIED:
    "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400",
  INTERESTED:
    "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-400",
  NEGOTIATION:
    "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-400",
  FOLLOW_UP:
    "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-400",
  CONVERTED:
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-400",
  LOST: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-400",
};

const PRIORITY_STYLES = {
  LOW: "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]",
  MEDIUM:
    "bg-[var(--primary-muted)] text-[var(--primary)] border-[var(--primary)]",
  HIGH: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-400",
};

const ACTIVITY_ICONS = {
  CREATED: User,
  NOTE: MessageSquare,
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Calendar,
  TASK: CheckCircle2,
  STATUS_CHANGE: TrendingUp,
  FOLLOW_UP: Clock,
  CONVERTED: UserCheck,
  LOST: XCircle,
};

/* ──────────────────────────────────────────────
   UTILITY
   ────────────────────────────────────────────── */
function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ──────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────── */
export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const [convertOpen, setConvertOpen] = useState(false);
  const [converting, setConverting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [activityForm, setActivityForm] = useState({
    type: "NOTE",
    title: "",
    description: "",
    outcome: "",
  });
  const [addingActivity, setAddingActivity] = useState(false);

  const [editingActivity, setEditingActivity] = useState(null);

  useEffect(() => {
    fetchLeadData();
  }, [id]);

  async function fetchLeadData() {
    setLoading(true);
    try {
      const [leadRes, activitiesRes] = await Promise.all([
        getLeadById(id),
        getLeadActivities(id, { limit: 50 }),
      ]);

      setLead(leadRes.data);

      // FIX: API returns { success, data: [...], pagination }
      // activitiesRes.data is the array, not activitiesRes.data.activities
      const activityList = Array.isArray(activitiesRes.data)
        ? activitiesRes.data
        : activitiesRes.data?.data || [];
      setActivities(activityList);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load lead");
      router.push("/sales/leads");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateLead() {
    try {
      const res = await updateLead(id, editData);
      setLead(res.data);
      setEditOpen(false);
      toast.success("Lead updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update lead");
    }
  }

  async function handleConvert() {
    setConverting(true);
    try {
      const res = await convertLead(id);
      setLead(res.data);
      setConvertOpen(false);
      toast.success("Lead converted to student successfully");
      fetchLeadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to convert lead");
    } finally {
      setConverting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteLead(id);
      setDeleteOpen(false);
      toast.success("Lead deleted successfully");
      router.push("/sales/leads");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete lead");
      setDeleting(false);
    }
  }

  async function handleAddActivity(e) {
    e.preventDefault();
    if (!activityForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setAddingActivity(true);
    try {
      const res = await createLeadActivity(id, {
        ...activityForm,
        source: "USER",
      });
      setActivities((prev) => [res.data, ...prev]);
      setActivityForm({
        type: "NOTE",
        title: "",
        description: "",
        outcome: "",
      });
      toast.success("Activity added");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add activity");
    } finally {
      setAddingActivity(false);
    }
  }

  async function handleUpdateActivity(e) {
    e.preventDefault();
    try {
      const res = await updateLeadActivity(
        editingActivity._id,
        editingActivity,
      );
      setActivities((prev) =>
        prev.map((a) => (a._id === editingActivity._id ? res.data : a)),
      );
      setEditingActivity(null);
      toast.success("Activity updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update activity");
    }
  }

  async function handleDeleteActivity(activityId) {
    try {
      await deleteLeadActivity(activityId);
      setActivities((prev) => prev.filter((a) => a._id !== activityId));
      toast.success("Activity deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete activity");
    }
  }

  function openEdit() {
    setEditData({
      firstName: lead.firstName || "",
      lastName: lead.lastName || "",
      primaryPhone: lead.primaryPhone || "",
      alternatePhone: lead.alternatePhone || "",
      email: lead.email || "",
      whatsappNumber: lead.whatsappNumber || "",
      gender: lead.gender || "",
      dateOfBirth: lead.dateOfBirth ? lead.dateOfBirth.split("T")[0] : "",
      country: lead.country || "",
      state: lead.state || "",
      city: lead.city || "",
      address: lead.address || "",
      pincode: lead.pincode || "",
      qualification: lead.qualification || "",
      institution: lead.institution || "",
      passingYear: lead.passingYear || "",
      occupation: lead.occupation || "",
      experience: lead.experience || 0,
      studyMode: lead.studyMode || "",
      preferredTiming: lead.preferredTiming || "",
      budget: lead.budget || "",
      expectedJoiningDate: lead.expectedJoiningDate
        ? lead.expectedJoiningDate.split("T")[0]
        : "",
      source: lead.source || "",
      subSource: lead.subSource || "",
      campaign: lead.campaign || "",
      referredBy: lead.referredBy || "",
      status: lead.status || "",
      priority: lead.priority || "",
      lostReason: lead.lostReason || "",
      lostTo: lead.lostTo || "",
      initialRemarks: lead.initialRemarks || "",
    });
    setEditOpen(true);
  }

  /* ──────────────────────────────────────────────
     LOADING STATE
     ────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ───────────── HEADER ───────────── */}
      <header className="sticky top-0 z-30 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/sales/leads")}
              className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-semibold truncate">
                  {lead.fullName}
                </h1>
                <Badge
                  variant="outline"
                  className={`text-xs font-medium ${STATUS_STYLES[lead.status] || ""}`}
                >
                  {lead.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs font-medium ${PRIORITY_STYLES[lead.priority] || ""}`}
                >
                  {lead.priority}
                </Badge>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] truncate">
                {lead.leadNumber} · Created {formatDate(lead.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!lead.isConverted && lead.status !== "LOST" && (
              <Button
                onClick={() => setConvertOpen(true)}
                className="bg-[var(--success)] text-white hover:bg-[var(--success)]/90 h-8 text-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                Convert
              </Button>
            )}
            <Button
              variant="outline"
              onClick={openEdit}
              className="h-8 text-xs border-[var(--border)]"
            >
              <Edit3 className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[var(--card)] border-[var(--border)]"
              >
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(lead.leadNumber);
                    toast.success("Lead number copied");
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Lead Number
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="text-[var(--destructive)] focus:text-[var(--destructive)]"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Lead
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ───────────── MAIN CONTENT ───────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── LEFT COLUMN ─── */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-[var(--muted)] border border-[var(--border)] w-full justify-start h-10">
                <TabsTrigger
                  value="overview"
                  className="text-xs data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--primary)] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--primary)]"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="tasks"
                  className="text-xs data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--primary)] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--primary)]"
                >
                  Tasks
                </TabsTrigger>
                <TabsTrigger
                  value="activities"
                  className="text-xs data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--primary)] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--primary)]"
                >
                  Activities
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-[var(--primary-muted)] text-[var(--primary)]">
                    {activities.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="course"
                  className="text-xs data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--primary)] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--primary)]"
                >
                  Course Interest
                </TabsTrigger>
              </TabsList>

              {/* ── OVERVIEW TAB ── */}
              <TabsContent value="overview" className="mt-6 space-y-6">
                {/* Contact Info */}
                <Card className="bg-[var(--card)] border-[var(--border)] shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-[var(--primary)]" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoItem
                        icon={<Phone className="h-4 w-4" />}
                        label="Primary Phone"
                        value={lead.primaryPhone}
                        href={`tel:${lead.primaryPhone}`}
                      />
                      {lead.alternatePhone && (
                        <InfoItem
                          icon={<Phone className="h-4 w-4" />}
                          label="Alternate Phone"
                          value={lead.alternatePhone}
                          href={`tel:${lead.alternatePhone}`}
                        />
                      )}
                      {lead.email && (
                        <InfoItem
                          icon={<Mail className="h-4 w-4" />}
                          label="Email"
                          value={lead.email}
                          href={`mailto:${lead.email}`}
                        />
                      )}
                      {lead.whatsappNumber && (
                        <InfoItem
                          icon={<MessageSquare className="h-4 w-4" />}
                          label="WhatsApp"
                          value={lead.whatsappNumber}
                        />
                      )}
                      {lead.gender && (
                        <InfoItem
                          icon={<User className="h-4 w-4" />}
                          label="Gender"
                          value={lead.gender}
                        />
                      )}
                      {lead.dateOfBirth && (
                        <InfoItem
                          icon={<Calendar className="h-4 w-4" />}
                          label="Date of Birth"
                          value={formatDate(lead.dateOfBirth)}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Address */}
                {(lead.address || lead.city || lead.state || lead.country) && (
                  <Card className="bg-[var(--card)] border-[var(--border)] shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[var(--primary)]" />
                        Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-[var(--foreground)]">
                        {[
                          lead.address,
                          lead.city,
                          lead.state,
                          lead.country,
                          lead.pincode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Academic & Professional */}
                <Card className="bg-[var(--card)] border-[var(--border)] shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-[var(--primary)]" />
                      Academic & Professional
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {lead.qualification && (
                        <InfoItem
                          icon={<BookOpen className="h-4 w-4" />}
                          label="Qualification"
                          value={lead.qualification}
                        />
                      )}
                      {lead.institution && (
                        <InfoItem
                          icon={<Building className="h-4 w-4" />}
                          label="Institution"
                          value={lead.institution}
                        />
                      )}
                      {lead.passingYear && (
                        <InfoItem
                          icon={<Calendar className="h-4 w-4" />}
                          label="Passing Year"
                          value={lead.passingYear}
                        />
                      )}
                      {lead.occupation && (
                        <InfoItem
                          icon={<Briefcase className="h-4 w-4" />}
                          label="Occupation"
                          value={lead.occupation}
                        />
                      )}
                      {lead.experience > 0 && (
                        <InfoItem
                          icon={<Clock className="h-4 w-4" />}
                          label="Experience"
                          value={`${lead.experience} years`}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Marketing */}
                <Card className="bg-[var(--card)] border-[var(--border)] shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Target className="h-4 w-4 text-[var(--primary)]" />
                      Source & Marketing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoItem
                        icon={<Tag className="h-4 w-4" />}
                        label="Source"
                        value={lead.source}
                      />
                      {lead.subSource && (
                        <InfoItem
                          icon={<ChevronRight className="h-4 w-4" />}
                          label="Sub Source"
                          value={lead.subSource}
                        />
                      )}
                      {lead.campaign && (
                        <InfoItem
                          icon={<Flag className="h-4 w-4" />}
                          label="Campaign"
                          value={lead.campaign}
                        />
                      )}
                      {lead.referredBy && (
                        <InfoItem
                          icon={<UserCheck className="h-4 w-4" />}
                          label="Referred By"
                          value={lead.referredBy}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Remarks */}
                {lead.initialRemarks && (
                  <Card className="bg-[var(--card)] border-[var(--border)] shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[var(--primary)]" />
                        Initial Remarks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-[var(--foreground)] whitespace-pre-wrap">
                        {lead.initialRemarks}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Lost Info */}
                {lead.status === "LOST" && (lead.lostReason || lead.lostTo) && (
                  <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[var(--destructive)]">
                        <AlertTriangle className="h-4 w-4" />
                        Lost Lead Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {lead.lostReason && (
                          <InfoItem
                            icon={<XCircle className="h-4 w-4" />}
                            label="Lost Reason"
                            value={lead.lostReason}
                          />
                        )}
                        {lead.lostTo && (
                          <InfoItem
                            icon={<Building className="h-4 w-4" />}
                            label="Lost To"
                            value={lead.lostTo}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* ── ACTIVITIES TAB ── */}
              <TabsContent value="activities" className="mt-6 space-y-6">
                {/* Add Activity */}
                <Card className="bg-[var(--card)] border-[var(--border)] shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Plus className="h-4 w-4 text-[var(--primary)]" />
                      Add Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <form onSubmit={handleAddActivity} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-[var(--muted-foreground)]">
                            Type
                          </Label>
                          <Select
                            value={activityForm.type}
                            onValueChange={(v) =>
                              setActivityForm((p) => ({ ...p, type: v }))
                            }
                          >
                            <SelectTrigger className="bg-[var(--background)] border-[var(--border)] h-9 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                              {ACTIVITY_TYPE_VALUES.map((s) => (
                                <SelectItem
                                  key={s}
                                  value={s}
                                  className="text-xs"
                                >
                                  {s.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs text-[var(--muted-foreground)]">
                            Title
                          </Label>
                          <Input
                            value={activityForm.title}
                            onChange={(e) =>
                              setActivityForm((p) => ({
                                ...p,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Activity title..."
                            className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-[var(--muted-foreground)]">
                          Description
                        </Label>
                        <Textarea
                          value={activityForm.description}
                          onChange={(e) =>
                            setActivityForm((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Describe the activity..."
                          className="bg-[var(--background)] border-[var(--border)] min-h-[80px] text-xs"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={addingActivity}
                          className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] h-8 text-xs"
                        >
                          <Send className="h-3.5 w-3.5 mr-1.5" />
                          {addingActivity ? "Adding..." : "Add Activity"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Activity Timeline */}
                <div className="space-y-3">
                  {activities.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[var(--border)] bg-[var(--card)]">
                      <Clock className="h-8 w-8 mx-auto text-[var(--muted-foreground)] mb-2" />
                      <p className="text-sm text-[var(--muted-foreground)]">
                        No activities yet
                      </p>
                    </div>
                  ) : (
                    activities.map((activity) => {
                      const Icon =
                        ACTIVITY_ICONS[activity.type] || MessageSquare;
                      const performerName =
                        activity.performedBy?.userId?.fullName ||
                        activity.performedBy?.employeeId ||
                        "System";

                      return (
                        <Card
                          key={activity._id}
                          className="bg-[var(--card)] border-[var(--border)] shadow-none group"
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <div className="shrink-0 mt-0.5">
                                <div className="h-8 w-8 flex items-center justify-center bg-[var(--primary-muted)] text-[var(--primary)]">
                                  <Icon className="h-4 w-4" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-medium">
                                      {activity.title}
                                    </p>
                                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                                      {activity.type.replace(/_/g, " ")} ·{" "}
                                      {performerName} ·{" "}
                                      {formatDateTime(activity.createdAt)}
                                      {activity.source === "SYSTEM" && (
                                        <Badge
                                          variant="outline"
                                          className="ml-2 text-[10px] bg-[var(--muted)] border-[var(--border)]"
                                        >
                                          SYSTEM
                                        </Badge>
                                      )}
                                    </p>
                                  </div>
                                  {activity.source === "USER" && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <MoreVertical className="h-3.5 w-3.5" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="bg-[var(--card)] border-[var(--border)]"
                                      >
                                        <DropdownMenuItem
                                          onClick={() =>
                                            setEditingActivity(activity)
                                          }
                                        >
                                          <Edit3 className="h-3.5 w-3.5 mr-2" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleDeleteActivity(activity._id)
                                          }
                                          className="text-[var(--destructive)] focus:text-[var(--destructive)]"
                                        >
                                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                                {activity.description && (
                                  <p className="text-sm text-[var(--foreground)] mt-2 whitespace-pre-wrap">
                                    {activity.description}
                                  </p>
                                )}
                                {activity.outcome && (
                                  <div className="mt-2 p-2 bg-[var(--muted)] text-xs text-[var(--muted-foreground)]">
                                    <span className="font-medium">
                                      Outcome:
                                    </span>{" "}
                                    {activity.outcome}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
              <TabsContent value="tasks" className="mt-6">
                <LeadTasks leadId={lead._id} />
              </TabsContent>

              {/* ── COURSE TAB ── */}
              <TabsContent value="course" className="mt-6 space-y-6">
                <Card className="bg-[var(--card)] border-[var(--border)] shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[var(--primary)]" />
                      Course Interest
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoItem
                        icon={<BookOpen className="h-4 w-4" />}
                        label="Interested Course"
                        value={lead.interestedCourse?.title || "Not selected"}
                      />
                      <InfoItem
                        icon={<Calendar className="h-4 w-4" />}
                        label="Preferred Batch"
                        value={lead.preferredBatch?.name || "Not selected"}
                      />
                      <InfoItem
                        icon={<Target className="h-4 w-4" />}
                        label="Study Mode"
                        value={lead.studyMode || "Not specified"}
                      />
                      <InfoItem
                        icon={<Clock className="h-4 w-4" />}
                        label="Preferred Timing"
                        value={lead.preferredTiming || "Not specified"}
                      />
                      <InfoItem
                        icon={<DollarSign className="h-4 w-4" />}
                        label="Budget"
                        value={
                          lead.budget
                            ? `₹${lead.budget.toLocaleString()}`
                            : "Not specified"
                        }
                      />
                      <InfoItem
                        icon={<Calendar className="h-4 w-4" />}
                        label="Expected Joining"
                        value={formatDate(lead.expectedJoiningDate)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="space-y-6">
            {/* Lead Score */}
            <Card className="bg-[var(--card)] border-[var(--border)] shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                    Lead Score
                  </span>
                  <Star className="h-4 w-4 text-[var(--warning)]" />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-[var(--foreground)]">
                    {lead.leadScore}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] mb-1">
                    / 100
                  </span>
                </div>
                <div className="mt-2 h-2 w-full bg-[var(--muted)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] transition-all"
                    style={{ width: `${lead.leadScore}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Owner */}
            <Card className="bg-[var(--card)] border-[var(--border)] shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-[var(--primary)]" />
                  Ownership
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 bg-[var(--primary-muted)] text-[var(--primary)]">
                    <AvatarFallback className="text-xs font-semibold">
                      {getInitials(lead.leadOwner?.employeeId)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {lead.leadOwner?.employeeId || "Unknown"}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {lead.leadOwner?.designation || "Sales Team"}
                    </p>
                  </div>
                </div>
                <Separator className="bg-[var(--border)]" />
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--muted-foreground)]">
                      Created
                    </span>
                    <span>{formatDateTime(lead.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--muted-foreground)]">
                      Last Updated
                    </span>
                    <span>{formatDateTime(lead.updatedAt)}</span>
                  </div>
                  {lead.lastContactedAt && (
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--muted-foreground)]">
                        Last Contacted
                      </span>
                      <span>{formatDateTime(lead.lastContactedAt)}</span>
                    </div>
                  )}
                  {lead.nextFollowupAt && (
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--muted-foreground)]">
                        Next Follow-up
                      </span>
                      <span className="text-[var(--primary)] font-medium">
                        {formatDateTime(lead.nextFollowupAt)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Conversion */}
            {lead.isConverted && (
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
                    <span className="text-sm font-semibold text-[var(--success)]">
                      Converted
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Converted on {formatDateTime(lead.convertedAt)}
                  </p>
                  {lead.convertedBy && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      by {lead.convertedBy?.employeeId || "Sales Team"}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-[var(--card)] border-[var(--border)] shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {lead.primaryPhone && (
                  <Button
                    variant="outline"
                    className="w-full justify-start h-9 text-xs border-[var(--border)]"
                    onClick={() => window.open(`tel:${lead.primaryPhone}`)}
                  >
                    <Phone className="h-3.5 w-3.5 mr-2 text-[var(--success)]" />
                    Call Primary
                  </Button>
                )}
                {lead.email && (
                  <Button
                    variant="outline"
                    className="w-full justify-start h-9 text-xs border-[var(--border)]"
                    onClick={() => window.open(`mailto:${lead.email}`)}
                  >
                    <Mail className="h-3.5 w-3.5 mr-2 text-[var(--info)]" />
                    Send Email
                  </Button>
                )}
                {lead.whatsappNumber && (
                  <Button
                    variant="outline"
                    className="w-full justify-start h-9 text-xs border-[var(--border)]"
                    onClick={() =>
                      window.open(
                        `https://wa.me/${lead.whatsappNumber.replace(/\D/g, "")}`,
                      )
                    }
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-2 text-green-600" />
                    WhatsApp
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* ───────────── EDIT DIALOG ───────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">Edit Lead</DialogTitle>
            <DialogDescription className="text-xs text-[var(--muted-foreground)]">
              Update lead information. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <FormField label="First Name">
              <Input
                value={editData.firstName}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, firstName: e.target.value }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <FormField label="Last Name">
              <Input
                value={editData.lastName}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, lastName: e.target.value }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <FormField label="Primary Phone">
              <Input
                value={editData.primaryPhone}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, primaryPhone: e.target.value }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <FormField label="Alternate Phone">
              <Input
                value={editData.alternatePhone}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, alternatePhone: e.target.value }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <FormField label="Email">
              <Input
                type="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, email: e.target.value }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <FormField label="WhatsApp">
              <Input
                value={editData.whatsappNumber}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, whatsappNumber: e.target.value }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <FormField label="Status">
              <Select
                value={editData.status}
                onValueChange={(v) => setEditData((p) => ({ ...p, status: v }))}
              >
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                  {LEAD_STATUS.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Priority">
              <Select
                value={editData.priority}
                onValueChange={(v) =>
                  setEditData((p) => ({ ...p, priority: v }))
                }
              >
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                  {LEAD_PRIORITY.map((p) => (
                    <SelectItem key={p} value={p} className="text-xs">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Gender">
              <Select
                value={editData.gender}
                onValueChange={(v) => setEditData((p) => ({ ...p, gender: v }))}
              >
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)] h-9 text-xs">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                  {GENDER.map((g) => (
                    <SelectItem key={g} value={g} className="text-xs">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Date of Birth">
              <Input
                type="date"
                value={editData.dateOfBirth}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, dateOfBirth: e.target.value }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <FormField label="Qualification">
              <Input
                value={editData.qualification}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, qualification: e.target.value }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <FormField label="Institution">
              <Input
                value={editData.institution}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, institution: e.target.value }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <FormField label="Occupation">
              <Input
                value={editData.occupation}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, occupation: e.target.value }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <FormField label="Experience (years)">
              <Input
                type="number"
                value={editData.experience}
                onChange={(e) =>
                  setEditData((p) => ({
                    ...p,
                    experience: Number(e.target.value),
                  }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <FormField label="Study Mode">
              <Select
                value={editData.studyMode}
                onValueChange={(v) =>
                  setEditData((p) => ({ ...p, studyMode: v }))
                }
              >
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)] h-9 text-xs">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                  {STUDY_MODE.map((m) => (
                    <SelectItem key={m} value={m} className="text-xs">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Preferred Timing">
              <Select
                value={editData.preferredTiming}
                onValueChange={(v) =>
                  setEditData((p) => ({ ...p, preferredTiming: v }))
                }
              >
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)] h-9 text-xs">
                  <SelectValue placeholder="Select timing" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                  {TIMING.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs">
                      {t.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Budget">
              <Input
                type="number"
                value={editData.budget}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, budget: Number(e.target.value) }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <FormField label="Expected Joining Date">
              <Input
                type="date"
                value={editData.expectedJoiningDate}
                onChange={(e) =>
                  setEditData((p) => ({
                    ...p,
                    expectedJoiningDate: e.target.value,
                  }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <FormField label="Source">
              <Select
                value={editData.source}
                onValueChange={(v) => setEditData((p) => ({ ...p, source: v }))}
              >
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                  {LEAD_SOURCE.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Sub Source">
              <Input
                value={editData.subSource}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, subSource: e.target.value }))
                }
                className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
              />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Address">
                <Textarea
                  value={editData.address}
                  onChange={(e) =>
                    setEditData((p) => ({ ...p, address: e.target.value }))
                  }
                  className="bg-[var(--background)] border-[var(--border)] min-h-[60px] text-xs"
                />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Initial Remarks">
                <Textarea
                  value={editData.initialRemarks}
                  onChange={(e) =>
                    setEditData((p) => ({
                      ...p,
                      initialRemarks: e.target.value,
                    }))
                  }
                  className="bg-[var(--background)] border-[var(--border)] min-h-[60px] text-xs"
                />
              </FormField>
            </div>
            {editData.status === "LOST" && (
              <>
                <FormField label="Lost Reason">
                  <Input
                    value={editData.lostReason}
                    onChange={(e) =>
                      setEditData((p) => ({ ...p, lostReason: e.target.value }))
                    }
                    className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
                  />
                </FormField>
                <FormField label="Lost To">
                  <Input
                    value={editData.lostTo}
                    onChange={(e) =>
                      setEditData((p) => ({ ...p, lostTo: e.target.value }))
                    }
                    className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
                  />
                </FormField>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              className="h-9 text-xs border-[var(--border)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateLead}
              className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] h-9 text-xs"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ───────────── CONVERT DIALOG ───────────── */}
      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]">
          <DialogHeader>
            <DialogTitle className="text-base">Convert Lead</DialogTitle>
            <DialogDescription className="text-xs text-[var(--muted-foreground)]">
              Are you sure you want to convert this lead to a student? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setConvertOpen(false)}
              className="h-9 text-xs border-[var(--border)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConvert}
              disabled={converting}
              className="bg-[var(--success)] text-white hover:bg-[var(--success)]/90 h-9 text-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              {converting ? "Converting..." : "Convert to Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ───────────── DELETE DIALOG ───────────── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]">
          <DialogHeader>
            <DialogTitle className="text-base text-[var(--destructive)] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete Lead
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--muted-foreground)]">
              This will permanently delete {lead.fullName} ({lead.leadNumber}).
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="h-9 text-xs border-[var(--border)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-[var(--destructive)] text-white hover:bg-[var(--destructive-hover)] h-9 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              {deleting ? "Deleting..." : "Delete Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ───────────── EDIT ACTIVITY DIALOG ───────────── */}
      <Dialog
        open={!!editingActivity}
        onOpenChange={(open) => !open && setEditingActivity(null)}
      >
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]">
          <DialogHeader>
            <DialogTitle className="text-base">Edit Activity</DialogTitle>
          </DialogHeader>
          {editingActivity && (
            <form onSubmit={handleUpdateActivity} className="space-y-3 py-4">
              <FormField label="Title">
                <Input
                  value={editingActivity.title}
                  onChange={(e) =>
                    setEditingActivity((p) => ({ ...p, title: e.target.value }))
                  }
                  className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
                />
              </FormField>
              <FormField label="Description">
                <Textarea
                  value={editingActivity.description}
                  onChange={(e) =>
                    setEditingActivity((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  className="bg-[var(--background)] border-[var(--border)] min-h-[80px] text-xs"
                />
              </FormField>
              <FormField label="Outcome">
                <Input
                  value={editingActivity.outcome}
                  onChange={(e) =>
                    setEditingActivity((p) => ({
                      ...p,
                      outcome: e.target.value,
                    }))
                  }
                  className="bg-[var(--background)] border-[var(--border)] h-9 text-xs"
                />
              </FormField>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setEditingActivity(null)}
                  className="h-9 text-xs border-[var(--border)]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] h-9 text-xs"
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Update
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ──────────────────────────────────────────────
   SUB-COMPONENTS
   ────────────────────────────────────────────── */
function InfoItem({ icon, label, value, href }) {
  const content = (
    <div className="flex items-start gap-2.5">
      <span className="text-[var(--muted-foreground)] mt-0.5 shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] font-medium">
          {label}
        </p>
        <p className="text-sm text-[var(--foreground)] truncate">
          {value || "—"}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block hover:bg-[var(--muted)] p-2 -m-2 transition-colors"
      >
        {content}
      </a>
    );
  }

  return <div className="p-2 -m-2">{content}</div>;
}

function FormField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-[var(--muted-foreground)]">{label}</Label>
      {children}
    </div>
  );
}
