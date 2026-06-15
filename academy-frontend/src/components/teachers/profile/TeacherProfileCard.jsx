import Link from "next/link";
import { Mail, Briefcase, Edit2 } from "lucide-react"; // npm install lucide-react (or remove if you prefer no icons)

export default function TeacherProfileCard({ teacher }) {
  const imageUrl = teacher?.profileImage?.fileId
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${teacher.profileImage.fileId}`
    : "/default-avatar.png";

  return (
    <div className="bg-card border border-border-custom rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden w-full max-w-sm flex flex-col">
      
      {/* Cover Banner Area */}
      <div className="h-24 bg-muted w-full relative"></div>

      <div className="flex flex-col items-center px-6 pb-6 -mt-12">
        
        {/* Avatar with an overlapping border matching the card background */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={`${teacher?.userId?.fullName || 'Teacher'} Profile`}
            className="w-24 h-24 rounded-full object-cover border-4 border-card bg-muted shadow-sm"
          />
        </div>

        {/* Name */}
        <h2 className="text-xl font-bold text-foreground mt-3 text-center">
          {teacher?.userId?.fullName || "Unknown Teacher"}
        </h2>

        {/* Specialization Badge */}
        <div className="flex items-center gap-1.5 mt-2">
          <Briefcase className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wide">
            {teacher?.specialization || "General Education"}
          </span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Mail className="w-4 h-4" />
          <p>{teacher?.userId?.email || "No email provided"}</p>
        </div>

        {/* Action Button */}
        <Link
          href="/teacher/profile/edit"
          className="mt-6 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </Link>
        
      </div>
    </div>
  );
}