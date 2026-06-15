"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getMyProfile, updateMyProfile, uploadProfileImage } from "@/services/teacher/profileService";
import { Camera, Loader2, Save, User } from "lucide-react"; // npm install lucide-react

export default function EditTeacherProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    specialization: "",
    qualification: "",
    phone: "",
    address: "",
    gender: "",
    bio: "",
    experience: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      const teacher = data.teacher;

      setFormData({
        specialization: teacher?.specialization || "",
        qualification: teacher?.qualification || "",
        phone: teacher?.phone || "",
        address: teacher?.address || "",
        gender: teacher?.gender || "",
        bio: teacher?.bio || "",
        experience: teacher?.experience || "",
      });

      if (teacher?.profileImage?.fileId) {
        setPreview(`${process.env.NEXT_PUBLIC_API_URL}/uploads/${teacher.profileImage.fileId}`);
      }
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
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!profileImage) return;
    try {
      setUploading(true);
      const imageData = new FormData();
      imageData.append("image", profileImage);
      await uploadProfileImage(imageData);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      // UPDATE PROFILE
      await updateMyProfile(formData);

      // UPLOAD IMAGE
      if (profileImage) {
        await handleImageUpload();
      }

      router.push("/teacher/profile");
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Modern Loading Screen
  if (loading) {
    return (
      <DashboardLayout role="TEACHER">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading profile data...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Input styling class to keep JSX clean
  const inputClassName = "w-full bg-background border border-border-custom rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200";

  return (
    <DashboardLayout role="TEACHER">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Edit Profile</h1>
          <p className="text-muted-foreground mt-1">Update your professional information and public details.</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-card border border-border-custom rounded-2xl shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">

            {/* PROFILE IMAGE SECTION */}
            <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-border-custom">
              
              {/* Interactive Image Upload Area */}
              <div 
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={preview || "/default-avatar.png"}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-muted shadow-sm bg-muted transition-transform group-hover:scale-[1.02]"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="w-8 h-8 text-white mb-1" />
                  <span className="text-white text-xs font-medium">Change</span>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-foreground">Profile Picture</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Click the image to upload a new avatar. Recommended size is 256x256px.
                </p>
              </div>
            </div>

            {/* FORM FIELDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  placeholder="e.g. Mathematics, Physics"
                  value={formData.specialization}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  placeholder="e.g. Masters in Education"
                  value={formData.qualification}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`${inputClassName} appearance-none cursor-pointer`}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-semibold text-foreground">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Full street address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-semibold text-foreground">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  min="0"
                  placeholder="0"
                  value={formData.experience}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-semibold text-foreground">Biography</label>
                <textarea
                  rows="4"
                  name="bio"
                  placeholder="Tell us a little about yourself, your teaching philosophy, and background..."
                  value={formData.bio}
                  onChange={handleChange}
                  className={`${inputClassName} resize-y`}
                />
              </div>

            </div>

            {/* FORM ACTIONS */}
            <div className="pt-6 border-t border-border-custom flex items-center justify-end gap-4">
              
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || uploading}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting || uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>

            </div>

          </form>
        </div>

      </div>
    </DashboardLayout>
  );
}