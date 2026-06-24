"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { getAllCourses } from "@/services/public/courseService";
import CourseCard from "@/components/public/CourseCard";
import Link from "next/link";

// ─── Icons ───
const Icons = {
  Code: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Cpu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>,
  Layers: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Cloud: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c0-1.7-1.3-3-3-3h-11a3 3 0 0 1-3-3 3 3 0 0 1 3-3h.5"/><path d="M2 13h2.5"/><path d="M8 13h1.5"/><path d="M14 13h1.5"/><path d="M20 13h1.5"/><path d="M17.5 19H20a3 3 0 0 0 3-3 3 3 0 0 0-3-3h-1.5"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Briefcase: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  Star: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Play: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Zap: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
};

// ─── Animated Counter ───
function AnimatedCounter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const numTarget = parseInt(target.replace(/\D/g, ""));
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(numTarget * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

// ─── Scroll Reveal Hook ───
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ─── Scroll Reveal Wrapper ───
function Reveal({ children, delay = 0, className = "" }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
        willChange: "opacity, transform"
      }}
    >
      {children}
    </div>
  );
}

// ─── Track Card with Hover Tilt ───
function TrackCard({ icon: Icon, title, desc, color }) {
  const [isHovered, setIsHovered] = useState(false);

  const colorMap = {
    indigo: "from-indigo-500 to-violet-600 shadow-indigo-500/20",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/20",
    rose: "from-rose-500 to-pink-600 shadow-rose-500/20",
    amber: "from-amber-500 to-orange-600 shadow-amber-500/20"
  };

  return (
    <div
      className="group relative p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
      style={{
        transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colorMap[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white mb-6 shadow-lg`}>
        <Icon />
      </div>

      <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-4">{desc}</p>
      
      <div className="flex items-center gap-2 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
        Learn more <Icons.ChevronRight />
      </div>

      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-transparent to-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

// ─── Journey Step ───
function JourneyStep({ step, title, desc, index, isEven }) {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <div
      ref={ref}
      className={`relative grid lg:grid-cols-2 gap-12 items-center ${isEven ? "lg:[&>*:first-child]:order-2" : ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out"
      }}
    >
      <div className="group relative overflow-hidden rounded-[32px] border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl p-10 hover:-translate-y-2 transition-all duration-500">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl mb-8 shadow-lg shadow-indigo-500/20">
            {step}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-5 text-foreground">{title}</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{desc}</p>
        </div>
      </div>

      <div className="hidden lg:flex justify-center">
        <div className="relative w-64 h-64 rounded-full border border-white/10 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-amber-500/10 backdrop-blur-xl flex items-center justify-center animate-pulse-slow">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 opacity-60 blur-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Testimonial Marquee ───
function TestimonialMarquee() {
  const testimonials = [
    { name: "Rahul Sharma", role: "Full Stack Developer", text: "FCA transformed my career. The hands-on projects gave me real confidence.", company: "Google" },
    { name: "Priya Patel", role: "Data Scientist", text: "Best learning experience. The mentorship is unmatched in the industry.", company: "Microsoft" },
    { name: "Amit Kumar", role: "DevOps Engineer", text: "From zero to cloud expert in 6 months. Incredible curriculum.", company: "AWS" },
    { name: "Sneha Gupta", role: "Cybersecurity Analyst", text: "The practical labs and real-world scenarios prepared me perfectly.", company: "Deloitte" }
  ];

  return (
    <div className="relative overflow-hidden py-12">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      <div className="flex gap-6 animate-marquee hover:pause-animation">
        {[...testimonials, ...testimonials].map((t, i) => (
          <div key={i} className="flex-shrink-0 w-[400px] p-6 rounded-2xl border border-border-custom bg-card hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, j) => (
                <Icons.Star key={j} />
              ))}
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-4">"{t.text}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg">{t.company}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───
export default function Home() {
  console.log(
  "API URL:",
  process.env.NEXT_PUBLIC_API_URL
);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX - innerWidth / 2) / 50,
      y: (clientY - innerHeight / 2) / 50
    });
  };

  const tracks = [
    { icon: Icons.Code, title: "Full Stack Engineering", desc: "React, Node.js, APIs, Databases, TypeScript, and modern web architecture", color: "indigo" },
    { icon: Icons.Cpu, title: "AI & Data Science", desc: "Python, ML, Deep Learning, NLP, Computer Vision, and MLOps", color: "emerald" },
    { icon: Icons.Shield, title: "Cybersecurity", desc: "Linux, Networking, Ethical Hacking, Cloud Security, and Compliance", color: "rose" },
    { icon: Icons.Cloud, title: "Cloud & DevOps", desc: "Docker, Kubernetes, CI/CD, AWS, Terraform, and Site Reliability", color: "amber" }
  ];

  const features = [
    { icon: Icons.Users, title: "Smart Attendance", desc: "AI-powered tracking with real-time analytics" },
    { icon: Icons.Briefcase, title: "Batch Management", desc: "Dynamic scheduling and resource allocation" },
    { icon: Icons.Layers, title: "Performance Analytics", desc: "Deep insights into learning progress" },
    { icon: Icons.Zap, title: "Integrated Finance", desc: "Automated fee management and reporting" }
  ];

  const journeySteps = [
    { step: "01", title: "Build Strong Fundamentals", desc: "Master programming concepts, logic building, development workflows, and engineering foundations." },
    { step: "02", title: "Learn Modern Technologies", desc: "Work with React, Node.js, databases, APIs, cloud systems, and modern development tools." },
    { step: "03", title: "Develop Real Projects", desc: "Build practical applications with industry-level architecture and production workflows." },
    { step: "04", title: "Collaborate & Deploy", desc: "Experience teamwork, Git workflows, deployment pipelines, and real engineering practices." },
    { step: "05", title: "Prepare For Industry", desc: "Strengthen portfolios, technical communication, interview preparation, and problem-solving." }
  ];

  // FIX: Extract the active feature icon component to a variable
  const ActiveFeatureIcon = features[activeTab]?.icon || (() => null);

  return (
    <main className="relative overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Global Background Glows */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none -z-10"
        style={{ transform: `translate(-50%, ${mousePos.y * 0.5}px)` }}
      />
      <div 
        className="fixed top-[1200px] right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none -z-10"
        style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)` }}
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-28 pb-24 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-20 items-center w-full">
          
          {/* LEFT */}
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-semibold backdrop-blur-md animate-pulse-slow">
                <Icons.Sparkles />
                Modern Engineering Academy
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-8 text-foreground">
                Build Real Skills.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-500">
                  Launch Real Careers.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mb-10">
                Learn full-stack development, AI, cybersecurity,
                cloud technologies, and modern software engineering
                through practical mentorship and industry-level projects.
              </p>

              <div className="flex flex-wrap gap-5">
                <Link href="/courses" className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-semibold shadow-[0_0_40px_rgba(79,70,229,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(79,70,229,0.5)]">
                  Explore Programs
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <Icons.ArrowRight />
                  </span>
                </Link>
                <Link href="/platform" className="px-8 py-4 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 font-semibold text-foreground">
                  View Platform
                </Link>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-6 mt-16">
                {[
                  { value: "120", suffix: "+", label: "Batches" },
                  { value: "5000", suffix: "+", label: "Students" },
                  { value: "40", suffix: "+", label: "Projects" }
                ].map((item) => (
                  <div key={item.label} className="group cursor-default">
                    <h3 className="text-3xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                      <AnimatedCounter target={item.value} suffix={item.suffix} />
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* RIGHT */}
          <Reveal delay={0.2}>
            <div className="relative" style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-3xl rounded-[40px]" />
              <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl group">
                <Image
                  src="/image1.svg"
                  alt="FCA Dashboard"
                  width={1200}
                  height={900}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-foreground">Live Classes Active</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── LEARNING TRACKS ─── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <Reveal>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Industry-Focused Learning Tracks
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Structured programs designed around real-world technologies,
              engineering workflows, and career growth.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tracks.map((track, i) => (
            <Reveal key={track.title} delay={i * 0.1}>
              <TrackCard {...track} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── PLATFORM SHOWCASE ─── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div>
              <div className="inline-block mb-6 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                Built For Modern Learning
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-8 text-foreground">
                One Integrated Platform
                For Students & Management
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
                Attendance, timetable, analytics, assignments,
                fee management, learning workflows, and
                performance tracking — unified into one ecosystem.
              </p>

              {/* Interactive Feature Tabs */}
              <div className="space-y-3">
                {features.map((feature, i) => (
                  <div
                    key={feature.title}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${activeTab === i ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted border border-transparent'}`}
                    onClick={() => setActiveTab(i)}
                    onMouseEnter={() => setActiveTab(i)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeTab === i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <feature.icon />
                    </div>
                    <div>
                      <p className={`font-semibold transition-colors ${activeTab === i ? 'text-primary' : 'text-foreground'}`}>{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                    <div className={`ml-auto transition-all ${activeTab === i ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                      <Icons.Check />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-[40px]" />
              <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/image2.png"
                  alt="Platform Preview"
                  width={1200}
                  height={900}
                  className="w-full h-auto object-cover"
                />
                {/* Active feature overlay - FIXED */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                      <ActiveFeatureIcon />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{features[activeTab]?.title}</p>
                      <p className="text-white/70 text-sm">{features[activeTab]?.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── STUDENT JOURNEY ─── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <Reveal>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Your Learning Journey
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              A structured path from fundamentals to industry readiness
            </p>
          </div>
        </Reveal>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500 via-violet-500 to-amber-500 -translate-x-1/2 opacity-30" />
          
          <div className="space-y-20">
            {journeySteps.map((item, index) => (
              <JourneyStep key={item.step} {...item} index={index} isEven={index % 2 !== 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="max-w-7xl mx-auto px-6 py-28 overflow-hidden">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Student Success Stories
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Hear from graduates who transformed their careers
            </p>
          </div>
        </Reveal>
        <TestimonialMarquee />
      </section>

      {/* ─── COURSES ─── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Premium Programs</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Explore industry-ready learning experiences.
              </p>
            </div>
            <Link href="/courses" className="group inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-hover transition-colors">
              View All Courses
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <Icons.ArrowRight />
              </span>
            </Link>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.slice(0, 3).map((course, i) => (
            <Reveal key={course._id} delay={i * 0.15}>
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-indigo-600 to-violet-700 p-16 md:p-24 text-center group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_50%)]" />
            
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + i * 0.5}s`
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-8">
                Start Building
                <br />The Future Today.
              </h2>
              <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                Join FCA Academy and master technologies
                that modern companies actually use.
              </p>
              <Link href="/register" className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold hover:bg-slate-100 transition-all duration-300 hover:-translate-y-1 shadow-xl">
                Join FCA Academy
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <Icons.ArrowRight />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ─── CSS Animations ─── */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}