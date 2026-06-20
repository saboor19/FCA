"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  Target,
  Eye,
  Briefcase,
  Laptop,
  Award,
  Users,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Star,
  Heart,
  Globe,
  TrendingUp,
  Code,
  Database,
  Shield,
  Cpu
} from "lucide-react";

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

// ─── Reveal Component ───
function Reveal({ children, delay = 0, className = "" }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`
      }}
    >
      {children}
    </div>
  );
}

// ─── Animated Counter ───
function AnimatedCounter({ target, suffix = "", duration = 2500 }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal(0.3);

  useEffect(() => {
    if (!isVisible) return;
    const numTarget = parseInt(target.replace(/\D/g, ""));
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(numTarget * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Map Component (Client-side only) ───
function LocationMap() {
  const [MapContainer, setMapContainer] = useState(null);
  const [TileLayer, setTileLayer] = useState(null);
  const [Marker, setMarker] = useState(null);
  const [Popup, setPopup] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import("react-leaflet").then((module) => {
      setMapContainer(() => module.MapContainer);
      setTileLayer(() => module.TileLayer);
      setMarker(() => module.Marker);
      setPopup(() => module.Popup);
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded || !MapContainer) {
    return (
      <div className="w-full h-[400px] md:h-[500px] rounded-3xl bg-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  const position = [34.149142, 74.837133];

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: "24px", zIndex: 1 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-sm">Fusion Code Academy</h3>
            <p className="text-xs text-muted-foreground mt-1">Zakura Crossing, Dargah, Hazratbal 190006</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

// ─── Feature Card ───
function FeatureCard({ icon: Icon, title, description, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Reveal delay={index * 0.1}>
      <div
        className="group relative p-8 rounded-3xl border border-border-custom bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-default overflow-hidden"
        style={{
          transform: isHovered ? "translateY(-8px)" : "translateY(0)",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <Icon size={28} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
        </div>
      </div>
    </Reveal>
  );
}

// ─── Journey Step ───
function JourneyStep({ step, title, description, index }) {
  return (
    <Reveal delay={index * 0.15}>
      <div className="group relative">
        {/* Connector line */}
        {index < 4 && (
          <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
        )}
        
        <div className="relative flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-black text-xl mb-5 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            {step}
          </div>
          <h3 className="font-bold text-foreground text-lg mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-[200px]">{description}</p>
        </div>
      </div>
    </Reveal>
  );
}

// ─── Team Member Card ───
function TeamCard({ name, role, image, index }) {
  return (
    <Reveal delay={index * 0.1}>
      <div className="group relative overflow-hidden rounded-3xl border border-border-custom bg-card hover:shadow-xl transition-all duration-500">
        <div className="aspect-square bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
        <div className="p-6 text-center">
          <h3 className="font-bold text-foreground text-lg">{name}</h3>
          <p className="text-sm text-primary font-medium mt-1">{role}</p>
          <div className="flex items-center justify-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="text-amber-500 fill-amber-500" />
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ─── Testimonial Card ───
function TestimonialCard({ name, role, text, index }) {
  return (
    <Reveal delay={index * 0.1}>
      <div className="p-6 rounded-2xl border border-border-custom bg-card hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className="text-amber-500 fill-amber-500" />
          ))}
        </div>
        <p className="text-sm text-foreground leading-relaxed mb-4">"{text}"</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {name[0]}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function AboutPage() {
  const stats = [
    { label: "Students Trained", value: "500", suffix: "+" },
    { label: "Courses Offered", value: "20", suffix: "+" },
    { label: "Projects Built", value: "50", suffix: "+" },
    { label: "Success Rate", value: "95", suffix: "%" },
    { label: "Industry Partners", value: "25", suffix: "+" },
    { label: "Years of Excellence", value: "8", suffix: "+" }
  ];

  const features = [
    {
      title: "Industry-Oriented Curriculum",
      icon: BookOpen,
      description: "Our courses are designed in collaboration with industry experts to ensure you learn the most relevant and in-demand technologies. Every module is updated quarterly to reflect the latest market trends."
    },
    {
      title: "Experienced Trainers",
      icon: Users,
      description: "Learn from professionals who have worked at top tech companies. Our instructors bring real-world experience, case studies, and practical insights that textbooks simply cannot provide."
    },
    {
      title: "Hands-On Projects",
      icon: Laptop,
      description: "Theory is important, but practice makes perfect. Build 15+ real-world projects during your course, from e-commerce platforms to AI-powered applications that you can showcase to employers."
    },
    {
      title: "Placement Assistance",
      icon: Briefcase,
      description: "Our dedicated placement cell works tirelessly to connect you with top employers. We provide resume building, interview preparation, mock sessions, and direct referrals to hiring partners."
    },
    {
      title: "Certification Programs",
      icon: Award,
      description: "Earn industry-recognized certificates that validate your skills. Our certifications are trusted by over 200+ companies across India and internationally."
    },
    {
      title: "Flexible Learning",
      icon: GraduationCap,
      description: "Choose from weekday, weekend, or online batches. Our hybrid learning model ensures you never miss a class, with recorded sessions available 24/7 for revision and self-paced learning."
    }
  ];

  const technologies = [
    { icon: Code, name: "Full Stack", color: "from-blue-500 to-cyan-500" },
    { icon: Database, name: "Data Science", color: "from-emerald-500 to-teal-500" },
    { icon: Shield, name: "Cybersecurity", color: "from-rose-500 to-pink-500" },
    { icon: Cpu, name: "AI & ML", color: "from-violet-500 to-purple-500" }
  ];

  const team = [
    { name: "Dr. Ahmad Khan", role: "Founder & CEO" },
    { name: "Sarah Bhat", role: "Academic Director" },
    { name: "Imran Malik", role: "Head of Technology" },
    { name: "Fatima Zahra", role: "Placement Coordinator" }
  ];

  const testimonials = [
    { name: "Rahul Sharma", role: "Software Engineer at Google", text: "Fusion Code Academy transformed my career completely. The practical approach to learning and the mentorship I received was invaluable." },
    { name: "Priya Patel", role: "Data Scientist at Microsoft", text: "The curriculum is incredibly well-structured. I went from zero coding knowledge to building complex ML models in just 6 months." },
    { name: "Amit Kumar", role: "DevOps Engineer at AWS", text: "Best investment I ever made. The cloud computing course gave me hands-on experience with AWS, Docker, and Kubernetes." }
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-accent/20 bg-accent/10 text-accent text-sm font-semibold backdrop-blur-md">
                <Heart size={16} />
                About Fusion Code Academy
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
                Building The Next
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-accent">
                  Generation Of Tech Talent
                </span>
              </h1>
              
              <p className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Fusion Code Academy empowers students, professionals, and aspiring developers 
                with practical skills in programming, web development, artificial intelligence, 
                data science, and modern software technologies. Located in the heart of Kashmir, 
                we are committed to making world-class tech education accessible to everyone.
              </p>
              
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/enroll"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-semibold text-primary-foreground hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Enroll Now
                  <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/courses"
                  className="rounded-2xl border border-border-custom px-8 py-4 font-semibold text-foreground hover:bg-muted transition-all"
                >
                  Explore Courses
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── WHO WE ARE ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                  Who We Are
                </h2>
                <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    Founded in 2016, Fusion Code Academy emerged from a simple yet powerful vision: 
                    to bridge the growing gap between academic education and industry requirements. 
                    What started as a small training center in Srinagar has now grown into one of 
                    the most trusted technology education institutions in Jammu & Kashmir.
                  </p>
                  <p>
                    Our mission goes beyond teaching code. We cultivate problem-solvers, innovators, 
                    and future tech leaders who can adapt to the rapidly evolving digital landscape. 
                    With a focus on practical, project-based learning, we ensure our students don't 
                    just learn concepts—they master them through real-world application.
                  </p>
                  <p>
                    Located at Zakura Crossing near the historic Dargah Hazratbal, our state-of-the-art 
                    campus provides an inspiring environment for learning. We believe that great 
                    education should be accessible, affordable, and aligned with industry needs.
                  </p>
                </div>
                
                <div className="mt-8 flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">500+</span> students trained
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl rounded-[40px]" />
                <div className="relative rounded-[32px] overflow-hidden border border-border-custom shadow-2xl">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary to-violet-700 p-10 flex flex-col justify-center text-white">
                    <h3 className="text-4xl md:text-5xl font-black leading-tight">
                      Learn.<br />Build.<br />Grow.
                    </h3>
                    <p className="mt-6 text-lg text-white/80 leading-relaxed">
                      We focus on practical training, mentorship, project-based learning, 
                      and comprehensive career development to shape the tech leaders of tomorrow.
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Globe size={20} className="text-accent" />
                        <span className="text-sm font-medium">Global Standards</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={20} className="text-accent" />
                        <span className="text-sm font-medium">Industry Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── TECHNOLOGY STACK ─── */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground tracking-tight">Technologies We Teach</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Master the most in-demand technologies that power the modern digital world
              </p>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {technologies.map((tech, i) => (
              <Reveal key={tech.name} delay={i * 0.1}>
                <div className="group p-8 rounded-3xl border border-border-custom bg-card hover:shadow-xl transition-all duration-500 text-center cursor-default">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <tech.icon size={32} />
                  </div>
                  <h3 className="font-bold text-foreground">{tech.name}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MISSION & VISION ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <Reveal>
              <div className="rounded-3xl border border-border-custom bg-card p-10 hover:shadow-xl transition-all duration-500 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Target size={32} />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To provide accessible, practical, and industry-ready technology education 
                  that empowers individuals from all backgrounds to build successful careers 
                  in the digital economy. We are committed to nurturing talent, fostering 
                  innovation, and creating pathways to prosperity through quality education.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-border-custom bg-card p-10 hover:shadow-xl transition-all duration-500 group">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-8 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <Eye size={32} />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To become a leading technology academy known for producing highly skilled 
                  professionals capable of competing in the global market. We envision a 
                  future where every aspiring developer has access to world-class education, 
                  regardless of their geographical or economic constraints.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground tracking-tight">Our Impact in Numbers</h2>
              <p className="mt-4 text-lg text-muted-foreground">Real results that speak for themselves</p>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.08}>
                <div className="rounded-3xl border border-border-custom bg-card p-8 text-center hover:shadow-lg transition-all duration-300 group">
                  <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500 group-hover:scale-110 transition-transform duration-300 inline-block">
                    <AnimatedCounter target={item.value} suffix={item.suffix} />
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground font-medium">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Why Choose Us</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to build a successful tech career, all under one roof
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, index) => (
              <FeatureCard key={item.title} {...item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEAM SECTION ─── */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground tracking-tight">Meet Our Team</h2>
              <p className="mt-4 text-lg text-muted-foreground">Passionate educators dedicated to your success</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <TeamCard key={member.name} {...member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground tracking-tight">Student Success Stories</h2>
              <p className="mt-4 text-lg text-muted-foreground">Hear from those who transformed their careers with us</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} {...t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── LEARNING JOURNEY ─── */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground tracking-tight">Your Learning Journey</h2>
              <p className="mt-4 text-lg text-muted-foreground">A structured path from enrollment to employment</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-5 gap-8">
            {[
              { step: "1", title: "Enroll", description: "Choose your course and complete the simple admission process" },
              { step: "2", title: "Learn", description: "Attend interactive classes with expert instructors and hands-on labs" },
              { step: "3", title: "Build Projects", description: "Apply your knowledge to real-world projects and build your portfolio" },
              { step: "4", title: "Get Certified", description: "Earn industry-recognized certificates upon successful completion" },
              { step: "5", title: "Launch Career", description: "Leverage our placement support to land your dream job" }
            ].map((item, index) => (
              <JourneyStep key={item.step} {...item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOCATION MAP SECTION ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground tracking-tight">Visit Our Campus</h2>
              <p className="mt-4 text-lg text-muted-foreground">Located in the heart of Srinagar, Kashmir</p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8">
            <Reveal>
              <div className="lg:col-span-2">
                <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-border-custom shadow-xl">
                  <LocationMap />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border border-border-custom bg-card hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <MapPin size={24} />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Address</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Zakura Crossing, Near Dargah<br />
                    Hazratbal, Srinagar<br />
                    Jammu & Kashmir 190006
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-border-custom bg-card hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                    <Phone size={24} />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Contact</h3>
                  <p className="text-muted-foreground text-sm">+91 7006 514 858</p>
                  <p className="text-muted-foreground text-sm mt-1">+91 9906 655 530</p>
                </div>

                <div className="p-6 rounded-2xl border border-border-custom bg-card hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                    <Mail size={24} />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Email</h3>
                  <p className="text-muted-foreground text-sm">info@fusioncode.academy</p>
                  <p className="text-muted-foreground text-sm mt-1">admissions@fusioncode.academy</p>
                </div>

                <div className="p-6 rounded-2xl border border-border-custom bg-card hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4">
                    <Clock size={24} />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Working Hours</h3>
                  <p className="text-muted-foreground text-sm">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  <p className="text-muted-foreground text-sm mt-1">Sunday: Closed</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-primary to-violet-700 p-12 md:p-16 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_50%)]" />
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                  Ready To Start Your Journey?
                </h2>
                <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Join Fusion Code Academy today and build the skills needed for tomorrow's opportunities. 
                  Your future in tech starts here.
                </p>
                <Link
                  href="/enroll"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white text-primary px-8 py-4 font-bold hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-0.5"
                >
                  Apply For Admission
                  <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}