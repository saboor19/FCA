"use client";

import { useEffect, useState } from "react";
import {
  User,
  Briefcase,
  AlertCircle,
  Calendar,
  Target,
  FileText,
  Save,
  X,
  Hash,
  Mail,
  Lock,
  Phone,
  MapPin,
  GraduationCap,
  ChevronDown,
} from "lucide-react";

import {
  SALES_TEAM_GENDER,
  SALES_TEAM_EMPLOYMENT_STATUS,
  SALES_TEAM_DESIGNATIONS,
  SALES_TEAM_DEPARTMENTS,
} from "@/constants/salesConstants";

export default function SalesTeamForm({
  initialData = {},
  onSubmit,
  loading = false,
  managers = [],
  isEdit = false,
  onCancel,
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    employeeId: "",
    designation: "Sales Executive",
    department: "Sales",
    manager: "",
    phone: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    joiningDate: "",
    dailyLeadTarget: 0,
    monthlyLeadTarget: 0,
    employmentStatus: "ACTIVE",
    bio: "",
    experience: 0,
  });

  const [activeSection, setActiveSection] = useState("user");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (Object.keys(initialData).length) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
        password: "",
        manager: initialData.manager?._id || initialData.manager || "",
        dateOfBirth: initialData.dateOfBirth
          ? initialData.dateOfBirth.slice(0, 10)
          : "",
        joiningDate: initialData.joiningDate
          ? initialData.joiningDate.slice(0, 10)
          : "",
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format";
    if (!isEdit && !form.password) newErrors.password = "Password is required";
    if (!form.employeeId.trim()) newErrors.employeeId = "Employee ID is required";
    if (!form.joiningDate) newErrors.joiningDate = "Joining date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = document.querySelector("[data-error]");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onSubmit(form);
  };

  const sections = [
    { id: "user", label: "User Info", icon: User, fields: ["fullName", "email", "password", "phone"] },
    { id: "employee", label: "Employment", icon: Briefcase, fields: ["employeeId", "designation", "department", "manager", "joiningDate", "employmentStatus"] },
    { id: "personal", label: "Personal", icon: Calendar, fields: ["gender", "dateOfBirth", "address"] },
    { id: "targets", label: "Targets", icon: Target, fields: ["dailyLeadTarget", "monthlyLeadTarget", "experience"] },
    { id: "additional", label: "Additional", icon: FileText, fields: ["bio"] },
  ];

  const isSectionActive = (sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    return section.fields.some((f) => errors[f]);
  };

  const InputWrapper = ({ label, name, error, children, required }) => (
    <div className="space-y-1.5" data-error={error ? "true" : undefined}>
      <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
        {required && <span className="text-[var(--destructive)]">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs font-medium text-[var(--destructive)] flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      {/* Sticky Progress Navigation */}
      <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]">
        <div className="flex overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            const hasError = isSectionActive(section.id);
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-r border-[var(--border)] whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : hasError
                    ? "bg-[var(--destructive)]/10 text-[var(--destructive)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                <Icon size={16} />
                {section.label}
                {hasError && (
                  <span className="w-2 h-2 bg-[var(--destructive)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="border border-[var(--border)] bg-[var(--card)]">
        {/* User Information */}
        {activeSection === "user" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
              <div className="p-2 bg-[var(--primary-muted)] text-[var(--primary)]">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold">User Information</h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Basic identity and contact details
                </p>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <InputWrapper label="Full Name" name="fullName" error={errors.fullName} required>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors ${
                      errors.fullName ? "border-[var(--destructive)]" : "border-[var(--border)]"
                    }`}
                  />
                </div>
              </InputWrapper>

              <InputWrapper label="Email Address" name="email" error={errors.email} required>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors ${
                      errors.email ? "border-[var(--destructive)]" : "border-[var(--border)]"
                    }`}
                  />
                </div>
              </InputWrapper>

              {!isEdit && (
                <InputWrapper label="Password" name="password" error={errors.password} required>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
                      className={`w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors ${
                        errors.password ? "border-[var(--destructive)]" : "border-[var(--border)]"
                      }`}
                    />
                  </div>
                </InputWrapper>
              )}

              <InputWrapper label="Phone Number" name="phone">
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </InputWrapper>
            </div>
          </div>
        )}

        {/* Employee Information */}
        {activeSection === "employee" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
              <div className="p-2 bg-[var(--primary-muted)] text-[var(--primary)]">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold">Employment Details</h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Role, department, and reporting structure
                </p>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <InputWrapper label="Employee ID" name="employeeId" error={errors.employeeId} required>
                <div className="relative">
                  <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    name="employeeId"
                    value={form.employeeId}
                    onChange={handleChange}
                    placeholder="EMP-2024-001"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors ${
                      errors.employeeId ? "border-[var(--destructive)]" : "border-[var(--border)]"
                    }`}
                  />
                </div>
              </InputWrapper>

              <InputWrapper label="Designation" name="designation">
                <div className="relative">
                  <select
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-2.5 bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors appearance-none cursor-pointer"
                  >
                    {SALES_TEAM_DESIGNATIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                </div>
              </InputWrapper>

              <InputWrapper label="Department" name="department">
                <div className="relative">
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-2.5 bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors appearance-none cursor-pointer"
                  >
                    {SALES_TEAM_DEPARTMENTS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                </div>
              </InputWrapper>

              <InputWrapper label="Reporting Manager" name="manager">
                <div className="relative">
                  <select
                    name="manager"
                    value={form.manager}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-2.5 bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">No Manager (Top Level)</option>
                    {managers.map((manager) => (
                      <option key={manager._id} value={manager._id}>
                        {manager.userId?.fullName} — {manager.employeeId}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                </div>
              </InputWrapper>

              <InputWrapper label="Joining Date" name="joiningDate" error={errors.joiningDate} required>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="date"
                    name="joiningDate"
                    value={form.joiningDate}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors ${
                      errors.joiningDate ? "border-[var(--destructive)]" : "border-[var(--border)]"
                    }`}
                  />
                </div>
              </InputWrapper>

              <InputWrapper label="Employment Status" name="employmentStatus">
                <div className="relative">
                  <select
                    name="employmentStatus"
                    value={form.employmentStatus}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-2.5 bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors appearance-none cursor-pointer"
                  >
                    {SALES_TEAM_EMPLOYMENT_STATUS.map((item) => (
                      <option key={item} value={item}>{item.replace("_", " ")}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                </div>
              </InputWrapper>
            </div>
          </div>
        )}

        {/* Personal Information */}
        {activeSection === "personal" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
              <div className="p-2 bg-[var(--primary-muted)] text-[var(--primary)]">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold">Personal Information</h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Demographics and residential details
                </p>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <InputWrapper label="Gender" name="gender">
                <div className="relative">
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-2.5 bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    {SALES_TEAM_GENDER.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                </div>
              </InputWrapper>

              <InputWrapper label="Date of Birth" name="dateOfBirth">
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </InputWrapper>

              <InputWrapper label="Address" name="address" className="md:col-span-2">
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-[var(--muted-foreground)]" />
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Full residential address"
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                  />
                </div>
              </InputWrapper>
            </div>
          </div>
        )}

        {/* Targets */}
        {activeSection === "targets" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
              <div className="p-2 bg-[var(--primary-muted)] text-[var(--primary)]">
                <Target size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold">Performance Targets</h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Daily and monthly lead generation quotas
                </p>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <InputWrapper label="Daily Lead Target" name="dailyLeadTarget">
                <div className="relative">
                  <Target size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="number"
                    min="0"
                    name="dailyLeadTarget"
                    value={form.dailyLeadTarget}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </InputWrapper>

              <InputWrapper label="Monthly Lead Target" name="monthlyLeadTarget">
                <div className="relative">
                  <Target size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="number"
                    min="0"
                    name="monthlyLeadTarget"
                    value={form.monthlyLeadTarget}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </InputWrapper>

              <InputWrapper label="Experience (Years)" name="experience">
                <div className="relative">
                  <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="number"
                    min="0"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </InputWrapper>
            </div>

            {/* Target Summary */}
            <div className="mt-6 p-4 border border-[var(--border)] bg-[var(--muted)]/50">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
                Target Projection
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 border border-[var(--border)] bg-[var(--background)]">
                  <p className="text-2xl font-bold text-[var(--primary)]">{form.dailyLeadTarget || 0}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">Daily</p>
                </div>
                <div className="p-3 border border-[var(--border)] bg-[var(--background)]">
                  <p className="text-2xl font-bold text-[var(--primary)]">{form.monthlyLeadTarget || 0}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">Monthly</p>
                </div>
                <div className="p-3 border border-[var(--border)] bg-[var(--background)]">
                  <p className="text-2xl font-bold text-[var(--success)]">
                    {(form.dailyLeadTarget || 0) * 22}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">Projected (22 days)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional */}
        {activeSection === "additional" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
              <div className="p-2 bg-[var(--primary-muted)] text-[var(--primary)]">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold">Additional Information</h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Bio and professional summary
                </p>
              </div>
            </div>
            <InputWrapper label="Professional Bio" name="bio">
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Brief professional biography..."
                rows={8}
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
              />
            </InputWrapper>
            <div className="text-xs text-[var(--muted-foreground)] text-right">
              {form.bio.length} characters
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer Actions */}
      <div className="sticky bottom-0 border-t border-[var(--border)] bg-[var(--background)] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <span className="w-2 h-2 bg-[var(--primary)]" />
          <span>All changes are saved on submit</span>
        </div>
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--muted)] transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-2.5 text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {isEdit ? "Update Member" : "Create Member"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}