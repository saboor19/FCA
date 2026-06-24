"use client";

import { useEffect, useState, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Loader2,
  Save,
  GraduationCap,
  Shield,
  X,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Lock,
  Eye,
  CalendarDays,
  FileBadge,
  IdCard,
  Upload,
  ImageIcon,
  ArrowLeft,
  XCircle,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import {
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
} from "@/services/student/profileService";

/* ── helpers ── */
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* ── component ── */
export default function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    profileImage: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      const p = data.profile;
      setProfile(p);
      setFormData({
        phone: p.phone || "",
        address: p.address || "",
        profileImage: p.profileImage || "",
      });
      setPreviewUrl(p.profileImage || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (saveStatus) setSaveStatus(null);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploadingImage(true);

    try {
      const imageUrl = await uploadProfileImage(file);
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
      setPreviewUrl(imageUrl);
    } catch (error) {
      console.log(error);
      alert("Failed to upload image");
      setPreviewUrl(formData.profileImage || null);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: "" }));
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);

    try {
      await updateMyProfile(formData);
      await fetchProfile();
      setSaveStatus("success");
      setTimeout(() => {
        setSaveStatus(null);
        setIsEditModalOpen(false);
      }, 1200);
    } catch (error) {
      console.log(error);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = () => {
    setFormData({
      phone: profile?.phone || "",
      address: profile?.address || "",
      profileImage: profile?.profileImage || "",
    });
    setPreviewUrl(profile?.profileImage || null);
    setSaveStatus(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    if (!saving) {
      setIsEditModalOpen(false);
      setSaveStatus(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="STUDENT">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[color:var(--primary)]" />
            <p className="mt-4 text-sm font-medium text-[color:var(--muted-foreground)]">
              Loading profile...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="STUDENT">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
              Account
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
              View and manage your personal information
            </p>
          </div>
          <button
            onClick={openEditModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[color:var(--primary-hover)] active:scale-95"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </button>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column — Profile Card */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] shadow-sm transition-all hover:shadow-md">
              <div className="relative h-28 bg-[color:var(--primary)]/10">
                <div className="absolute inset-0 bg-[color:var(--primary)]/5" />
                <div className="absolute right-4 top-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--card)] px-3 py-1 text-xs font-medium shadow-sm">
                    <Shield className="h-3 w-3 text-[color:var(--primary)]" />
                    Active
                  </span>
                </div>
              </div>

              <div className="relative px-5 pb-6">
                <div className="relative -mt-14 mb-4 flex justify-center">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-[color:var(--card)] bg-[color:var(--muted)] shadow-lg">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={`Profile photo of ${profile?.fullName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-12 w-12 text-[color:var(--muted-foreground)]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold">{profile?.fullName}</h2>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--primary)]/10 px-3 py-1 text-xs font-medium text-[color:var(--primary)]">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {profile?.role || "Student"}
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <InfoRow
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={profile?.email}
                  />
                  <InfoRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={profile?.phone}
                  />
                  <InfoRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Address"
                    value={profile?.address}
                  />
                  <InfoRow
                    icon={<IdCard className="h-4 w-4" />}
                    label="Enrollment No"
                    value={profile?.enrollmentNo}
                  />
                  <InfoRow
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Joined"
                    value={formatDate(profile?.createdAt)}
                  />
                </div>
              </div>
            </div>

            {/* Guardian Card */}
            <div className="overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                  <Shield className="h-4 w-4" />
                </div>
                <h3 className="font-semibold">Guardian Information</h3>
              </div>

              <div className="space-y-2.5">
                <InfoRow
                  icon={<User className="h-4 w-4" />}
                  label="Guardian Name"
                  value={profile?.guardianName}
                />
                <InfoRow
                  icon={<Phone className="h-4 w-4" />}
                  label="Guardian Phone"
                  value={profile?.guardianPhone}
                />
              </div>
            </div>
          </div>

          {/* Right Column — Academic & Overview */}
          <div className="space-y-6 lg:col-span-2">
            {/* Academic Overview */}
            <div className="overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-[color:var(--border-custom)] px-5 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                  <Eye className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold">Academic Overview</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                <StatCard
                  icon={<FileBadge className="h-5 w-5" />}
                  label="Enrollment Number"
                  value={profile?.enrollmentNo || "—"}
                  color="primary"
                />
                <StatCard
                  icon={<GraduationCap className="h-5 w-5" />}
                  label="Current Role"
                  value={profile?.role || "Student"}
                  color="accent"
                />
                <StatCard
                  icon={<CalendarDays className="h-5 w-5" />}
                  label="Account Created"
                  value={formatDate(profile?.createdAt)}
                  color="secondary"
                />
                <StatCard
                  icon={<Shield className="h-5 w-5" />}
                  label="Account Status"
                  value="Active"
                  color="emerald"
                />
              </div>
            </div>

            {/* Quick Info */}
            <div className="overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-[color:var(--border-custom)] px-5 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                  <Lock className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold">Account Details</h2>
              </div>

              <div className="divide-y divide-[color:var(--border-custom)]">
                <DetailRow label="Full Name" value={profile?.fullName} />
                <DetailRow label="Email Address" value={profile?.email} />
                <DetailRow label="Phone Number" value={profile?.phone} />
                <DetailRow label="Residential Address" value={profile?.address} />
                <DetailRow label="Guardian Name" value={profile?.guardianName} />
                <DetailRow label="Guardian Contact" value={profile?.guardianPhone} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeEditModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[color:var(--border-custom)] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                  <Pencil className="h-4 w-4" />
                </div>
                <div>
                  <h2 id="edit-profile-title" className="text-lg font-semibold">
                    Edit Profile
                  </h2>
                  <p className="text-xs text-[color:var(--muted-foreground)]">
                    Update your personal information
                  </p>
                </div>
              </div>
              <button
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-lg p-2 transition-colors hover:bg-[color:var(--muted)] disabled:opacity-50"
                aria-label="Close edit modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div
                    onClick={handleImageClick}
                    className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-4 border-[color:var(--border-custom)] bg-[color:var(--muted)] shadow-md transition-transform hover:scale-105"
                    role="button"
                    tabIndex={0}
                    aria-label="Upload profile image"
                    onKeyDown={(e) => e.key === "Enter" && handleImageClick()}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-10 w-10 text-[color:var(--muted-foreground)]" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    {uploadingImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  {previewUrl && !uploadingImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -bottom-1 -right-1 rounded-full bg-red-500 p-1.5 text-white shadow-md transition-colors hover:bg-red-600"
                      aria-label="Remove profile image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  aria-label="Profile image file input"
                />
                <p className="text-xs text-[color:var(--muted-foreground)]">
                  Click avatar to upload a new photo (max 5MB)
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <Phone className="h-3.5 w-3.5 text-[color:var(--muted-foreground)]" />
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    type="tel"
                    className="w-full rounded-xl border border-[color:var(--border-custom)] bg-[color:var(--background)] px-4 py-3 text-sm outline-none transition-all focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <MapPin className="h-3.5 w-3.5 text-[color:var(--muted-foreground)]" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter your full address"
                    className="w-full rounded-xl border border-[color:var(--border-custom)] bg-[color:var(--background)] px-4 py-3 text-sm outline-none transition-all focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20 resize-none"
                  />
                </div>
              </div>

              {/* Status */}
              {saveStatus === "success" && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Profile updated successfully!
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <XCircle className="h-4 w-4" />
                  Failed to update profile. Please try again.
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--border-custom)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[color:var(--muted)] disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--primary)] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[color:var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/* ── sub-components ── */
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[color:var(--muted)] px-4 py-3">
      <div className="text-[color:var(--muted-foreground)]">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[color:var(--muted-foreground)]">{label}</p>
        <p className="truncate text-sm font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-[color:var(--muted)]/50">
      <div className="flex items-center gap-2.5">
        <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
        <span className="text-sm text-[color:var(--muted-foreground)]">{label}</span>
      </div>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorMap = {
    primary: "bg-[color:var(--primary)]/10 text-[color:var(--primary)]",
    accent: "bg-[color:var(--accent)]/10 text-[color:var(--accent)]",
    secondary: "bg-[color:var(--secondary)]/10 text-[color:var(--secondary)]",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border border-[color:var(--border-custom)] p-4 transition-all hover:shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorMap[color] || colorMap.primary}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[color:var(--muted-foreground)]">{label}</p>
        <p className="truncate text-base font-semibold">{value}</p>
      </div>
    </div>
  );
}