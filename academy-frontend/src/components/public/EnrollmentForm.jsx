"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { submitEnrollmentRequest } from "@/services/public/enrollmentService";
import { getAllCourses as getCourses } from "@/services/public/courseService";

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
  Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Loader: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
};

// ─── Toast Component ───
function Toast({ message, submessage, onClose, progress }) {
  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm w-full animate-slide-in">
      <div className="bg-card border border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-2xl shadow-emerald-500/10 p-5 overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Icons.Check />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground text-sm">{message}</h4>
            <p className="text-xs text-muted-foreground mt-1">{submessage}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-100 dark:bg-emerald-900/30">
          <div 
            className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Section Card ───
function SectionCard({ icon: Icon, title, children, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useCallback((node) => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
  }, []);

  return (
    <div
      ref={ref}
      className="bg-card border border-border-custom rounded-3xl shadow-sm p-6 md:p-8 transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon />
        </div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Form Input ───
function FormInput({ icon: Icon, label, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon />
          </div>
        )}
        <input
          className={`w-full px-4 py-3 rounded-xl bg-muted border border-border-custom text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${Icon ? 'pl-11' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
}

// ─── Form Select ───
function FormSelect({ icon: Icon, label, children, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Icon />
          </div>
        )}
        <select
          className={`w-full px-4 py-3 rounded-xl bg-muted border border-border-custom text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none ${Icon ? 'pl-11' : ''}`}
          {...props}
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
function FormTextarea({ icon: Icon, label, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-3 text-muted-foreground">
            <Icon />
          </div>
        )}
        <textarea
          className={`w-full px-4 py-3 rounded-xl bg-muted border border-border-custom text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none ${Icon ? 'pl-11' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
}

// ─── Interest Chip ───
function InterestChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
          : "bg-muted text-muted-foreground border-border-custom hover:border-primary/30 hover:text-foreground"
      }`}
    >
      <span className="flex items-center gap-2">
        {selected && <Icons.Check />}
        {label}
      </span>
    </button>
  );
}

// ─── Success State ───
function SuccessState({ countdown, onRedirect }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Icons.Check />
              </div>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
            <Icons.Sparkles />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-foreground mb-3">
          Application Submitted!
        </h2>
        <p className="text-muted-foreground mb-2">
          Thank you for applying to FCA Academy.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Our admissions team will review your application and contact you soon.
        </p>
        
        <div className="bg-card border border-border-custom rounded-2xl p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-2">Redirecting to homepage in</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-bold text-primary">{countdown}</span>
            <span className="text-muted-foreground">seconds</span>
          </div>
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 5) * 100}%` }}
            />
          </div>
        </div>
        
        <button
          onClick={onRedirect}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
        >
          <Icons.Home />
          Go to Homepage Now
        </button>
      </div>
    </div>
  );
}

export default function EnrollmentForm() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProgress, setToastProgress] = useState(100);
  const [countdown, setCountdown] = useState(5);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    currentEducation: "",
    institutionName: "",
    passingYear: "",
    preferredCourse: "",
    interests: [],
    careerGoal: "",
    heardFrom: "",
    notes: ""
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (submitted) {
      setShowToast(true);
      const toastTimer = setInterval(() => {
        setToastProgress((prev) => {
          if (prev <= 0) {
            clearInterval(toastTimer);
            return 0;
          }
          return prev - 2;
        });
      }, 100);

      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            clearInterval(toastTimer);
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(toastTimer);
        clearInterval(countdownTimer);
      };
    }
  }, [submitted, router]);

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInterestChange = (interest) => {
    const exists = formData.interests.includes(interest);
    if (exists) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((item) => item !== interest)
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await submitEnrollmentRequest(formData);
      setSubmitted(true);
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    router.push("/");
  };

  const interests = [
    "Web Development",
    "Mobile Development",
    "Java",
    "Python",
    "AI/ML",
    "Data Science",
    "Cyber Security",
    "Cloud Computing"
  ];

  if (submitted) {
    return (
      <>
        {showToast && (
          <Toast
            message="Application Submitted Successfully!"
            submessage="Thanks for applying. You will be redirected to homepage."
            progress={toastProgress}
            onClose={() => setShowToast(false)}
          />
        )}
        <SuccessState countdown={countdown} onRedirect={handleRedirect} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-semibold mb-6">
            <Icons.Sparkles />
            Admissions Open 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Enroll at FCA Academy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fill out the form below to start your journey towards becoming an industry-ready engineer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <SectionCard icon={Icons.User} title="Personal Information" delay={0}>
            <div className="grid md:grid-cols-2 gap-5">
              <FormInput
                icon={Icons.User}
                label="Full Name"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
              <FormInput
                icon={Icons.Mail}
                label="Email Address"
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <FormInput
                icon={Icons.Phone}
                label="Phone Number"
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                required
                value={formData.phone}
                onChange={handleChange}
              />
              <FormSelect
                icon={Icons.User}
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </FormSelect>
              <FormInput
                icon={Icons.Calendar}
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="mt-5">
              <FormTextarea
                icon={Icons.MapPin}
                label="Address"
                name="address"
                placeholder="Enter your full address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </SectionCard>

          {/* Guardian Information */}
          <SectionCard icon={Icons.Heart} title="Guardian Information" delay={100}>
            <div className="grid md:grid-cols-2 gap-5">
              <FormInput
                icon={Icons.User}
                label="Guardian Name"
                type="text"
                name="guardianName"
                placeholder="Parent or guardian name"
                value={formData.guardianName}
                onChange={handleChange}
              />
              <FormInput
                icon={Icons.Phone}
                label="Guardian Phone"
                type="tel"
                name="guardianPhone"
                placeholder="Guardian contact number"
                value={formData.guardianPhone}
                onChange={handleChange}
              />
            </div>
          </SectionCard>

          {/* Academic Information */}
          <SectionCard icon={Icons.GraduationCap} title="Academic Information" delay={200}>
            <div className="grid md:grid-cols-2 gap-5">
              <FormInput
                icon={Icons.BookOpen}
                label="Current Qualification"
                type="text"
                name="currentEducation"
                placeholder="e.g., 12th Grade, B.Tech"
                value={formData.currentEducation}
                onChange={handleChange}
              />
              <FormInput
                icon={Icons.BookOpen}
                label="Institution Name"
                type="text"
                name="institutionName"
                placeholder="School or college name"
                value={formData.institutionName}
                onChange={handleChange}
              />
              <FormInput
                icon={Icons.Calendar}
                label="Passing Year"
                type="number"
                name="passingYear"
                placeholder="2024"
                value={formData.passingYear}
                onChange={handleChange}
              />
              <FormSelect
                icon={Icons.BookOpen}
                label="Preferred Course"
                name="preferredCourse"
                value={formData.preferredCourse}
                onChange={handleChange}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </FormSelect>
            </div>
          </SectionCard>

          {/* Interests */}
          <SectionCard icon={Icons.Target} title="Areas of Interest" delay={300}>
            <p className="text-sm text-muted-foreground mb-4">
              Select all topics that interest you. This helps us personalize your learning path.
            </p>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest) => (
                <InterestChip
                  key={interest}
                  label={interest}
                  selected={formData.interests.includes(interest)}
                  onClick={() => handleInterestChange(interest)}
                />
              ))}
            </div>
            {formData.interests.length > 0 && (
              <p className="mt-4 text-xs text-primary font-medium">
                {formData.interests.length} interest{formData.interests.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </SectionCard>

          {/* Additional Information */}
          <SectionCard icon={Icons.MessageCircle} title="Additional Information" delay={400}>
            <div className="space-y-5">
              <FormTextarea
                icon={Icons.Target}
                label="Career Goals"
                name="careerGoal"
                placeholder="Tell us about your career aspirations and what you hope to achieve..."
                value={formData.careerGoal}
                onChange={handleChange}
                rows={4}
              />
              <FormSelect
                icon={Icons.MessageCircle}
                label="How did you hear about us?"
                name="heardFrom"
                value={formData.heardFrom}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="FACEBOOK">Facebook</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="FRIEND">Friend</option>
                <option value="GOOGLE">Google</option>
                <option value="YOUTUBE">YouTube</option>
                <option value="OTHER">Other</option>
              </FormSelect>
              <FormTextarea
                icon={Icons.MessageCircle}
                label="Additional Notes"
                name="notes"
                placeholder="Anything else you would like us to know?"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </SectionCard>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-2xl bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg font-bold text-primary-foreground transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Icons.Loader />
                  Submitting Application...
                </>
              ) : (
                <>
                  Submit Application
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <Icons.ArrowRight />
                  </span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              By submitting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </form>
      </div>

      {/* Toast Animation Styles */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}