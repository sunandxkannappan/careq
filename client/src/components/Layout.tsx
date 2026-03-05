import { Link, useLocation } from "wouter";
import {
  Home,
  Hourglass,
  CalendarDays,
  ClipboardList,
  BookOpen,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState("Alberta Hip and Knee Clinic");
  const { data: user } = useUser();

  const clinics = [
    "Alberta Hip and Knee Clinic",
    "Southern Alberta Surgical Center"
  ];

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/referral" },
    { icon: Hourglass, label: "Status", href: "/waitlist" },
    { icon: CalendarDays, label: "Appointments", href: "/appointments" },
    { icon: ClipboardList, label: "Results", href: "/my-results" },
    { icon: BookOpen, label: "Resources", href: "/resources" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row md:h-screen md:overflow-hidden font-sans text-foreground">

      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center border-b border-border shadow-sm sticky top-0 z-50">
        <Link href="/referral" className="flex items-center gap-2.5" data-testid="link-logo-mobile">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold font-display text-base shadow-md shadow-primary/30">
            Q
          </div>
          <span className="font-display font-bold text-xl text-foreground tracking-tight">CareQ</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar — dark slate-blue #1E293B */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-dvh w-72 z-50",
        "flex flex-col shrink-0",
        "bg-[#1E293B] border-r border-[#263447]",
        "shadow-2xl md:shadow-[1px_0_0_#263447]",
        "transition-transform duration-300 ease-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>

        {/* Brand */}
        <div className="px-5 pt-6 pb-4 shrink-0">
          <Link href="/referral" className="flex items-center gap-3 mb-5" data-testid="link-logo-sidebar">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold font-display text-lg shadow-lg shadow-primary/50 shrink-0">
              Q
            </div>
            <div>
              <h1 className="font-display font-bold text-[1.1rem] text-white leading-none tracking-tight">
                CareQ
              </h1>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-[3px] tracking-widest uppercase">
                Patient Portal
              </p>
            </div>
          </Link>

          {/* Clinic selector */}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(
              "flex items-center justify-between w-full",
              "px-3 py-2 rounded-lg",
              "text-[11px] font-medium text-slate-300",
              "bg-white/[0.06] border border-white/[0.08]",
              "hover:bg-white/10 hover:text-slate-100",
              "transition-colors focus:outline-none"
            )}>
              <span className="truncate">{selectedClinic}</span>
              <ChevronDown className="w-3.5 h-3.5 ml-2 shrink-0 text-slate-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {clinics.map((clinic) => (
                <DropdownMenuItem
                  key={clinic}
                  onClick={() => setSelectedClinic(clinic)}
                  className={cn(clinic === selectedClinic && "bg-primary/5 text-primary font-semibold")}
                >
                  {clinic}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/[0.07] shrink-0" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                    "text-[13.5px] font-medium cursor-pointer group",
                    "transition-colors duration-150",
                    isActive
                      ? "bg-primary/[0.15] text-white"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className={cn(
                    "w-[17px] h-[17px] shrink-0 transition-colors duration-150",
                    isActive
                      ? "text-primary"
                      : "text-slate-500 group-hover:text-slate-300"
                  )} />
                  <span className={cn(isActive && "font-semibold")}>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/[0.07] shrink-0" />

        {/* User footer */}
        <div className="p-4 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.07]">
            <div className="w-8 h-8 rounded-full bg-primary/70 flex items-center justify-center text-white text-xs font-bold font-display shrink-0 ring-1 ring-primary/40">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-100 truncate leading-snug">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-slate-500 truncate leading-snug">{user?.email}</p>
            </div>
            <button
              className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded shrink-0"
              onClick={() => { localStorage.removeItem("careq_role"); window.location.href = "/"; }}
              data-testid="button-patient-logout"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12 animate-enter">
          {children}
        </div>
      </main>
    </div>
  );
}
