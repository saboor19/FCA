import { 
  IdCard, 
  GraduationCap, 
  Briefcase, 
  Phone, 
  MapPin, 
  CalendarDays, 
  FileText 
} from "lucide-react";

export default function TeacherProfileInfo({ teacher }) {
  // Safe date formatting to prevent crashes if joiningDate is missing
  const formattedDate = teacher?.joiningDate 
    ? new Date(teacher.joiningDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : "-";

  return (
    <div className="bg-card border border-border-custom rounded-2xl shadow-sm p-6 md:p-8 w-full">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">
          Professional Information
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed academic and contact details
        </p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        
        {/* Employee ID */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IdCard className="w-4 h-4" />
            <span>Employee ID</span>
          </div>
          <p className="font-semibold text-foreground text-base pl-6">
            {teacher?.employeeId || "-"}
          </p>
        </div>

        {/* Qualification */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4" />
            <span>Qualification</span>
          </div>
          <p className="font-semibold text-foreground text-base pl-6">
            {teacher?.qualification || "-"}
          </p>
        </div>

        {/* Experience */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4" />
            <span>Experience</span>
          </div>
          <p className="font-semibold text-foreground text-base pl-6">
            {teacher?.experience ? `${teacher.experience} Years` : "0 Years"}
          </p>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>Phone</span>
          </div>
          <p className="font-semibold text-foreground text-base pl-6">
            {teacher?.phone || "-"}
          </p>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Address</span>
          </div>
          <p className="font-semibold text-foreground text-base pl-6">
            {teacher?.address || "-"}
          </p>
        </div>

        {/* Joining Date */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span>Joining Date</span>
          </div>
          <p className="font-semibold text-foreground text-base pl-6">
            {formattedDate}
          </p>
        </div>

      </div>

      {/* Bio Section */}
      <div className="mt-8 pt-8 border-t border-border-custom">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
          <FileText className="w-4 h-4 text-primary" />
          <h3>Biography</h3>
        </div>
        
        {/* Soft contained area for long-form text */}
        <div className="bg-muted/40 border border-border-custom/50 rounded-xl p-5">
          <p className="text-foreground text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {teacher?.bio || "No biography provided."}
          </p>
        </div>
      </div>

    </div>
  );
}