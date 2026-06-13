export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-slate-200 dark:border-white/10 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* BRAND */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-extrabold tracking-tight mb-5">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-500">
                FCA Academy
              </span>
            </h2>

            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400 max-w-md">
              Modern academy management and learning platform designed
              to empower students with real-world technical skills,
              mentorship, and career-focused education.
            </p>

            {/* SOCIALS */}
            <div className="flex gap-4 mt-8">

              {[
                "GitHub",
                "LinkedIn",
                "Instagram",
                "YouTube"
              ].map((item) => (
                <button
                  key={item}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-semibold mb-5 text-lg">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">

              <li><a href="/">Home</a></li>

              <li><a href="/courses">Courses</a></li>

              <li><a href="/batches">Batches</a></li>

              <li><a href="/teachers">Teachers</a></li>

              <li><a href="/students">Students</a></li>

              <li><a href="/contact">Contact</a></li>

            </ul>
          </div>

          {/* ACADEMICS */}
          <div>
            <h3 className="font-semibold mb-5 text-lg">
              Academics
            </h3>

            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">

              <li><a href="/timetable">Timetable</a></li>

              <li><a href="/attendance">Attendance</a></li>

              <li><a href="/assignments">Assignments</a></li>

              <li><a href="/results">Results</a></li>

              <li><a href="/certificates">Certificates</a></li>

              <li><a href="/library">Library</a></li>

            </ul>
          </div>

          {/* MANAGEMENT */}
          <div>
            <h3 className="font-semibold mb-5 text-lg">
              Management
            </h3>

            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">

              <li><a href="/finance">Finance</a></li>

              <li><a href="/fees">Fee Management</a></li>

              <li><a href="/transactions">Transactions</a></li>

              <li><a href="/analytics">Analytics</a></li>

              <li><a href="/settings">Settings</a></li>

              <li><a href="/support">Support</a></li>

            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-16 border-t border-slate-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2026 FCA Academy. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">

            <a href="/privacy-policy">
              Privacy Policy
            </a>

            <a href="/terms-and-conditions">
              Terms & Conditions
            </a>

            <a href="/refund-policy">
              Refund Policy
            </a>

            <a href="/cookies-policy">
              Cookies
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}