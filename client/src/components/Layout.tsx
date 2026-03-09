import { Link, useLocation } from "wouter";
import {
  Home,
  Hourglass,
  Calendar,
  ClipboardList,
  ListChecks,
  BookOpen,
  User,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUser, useTasks } from "@/hooks/use-data";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: user } = useUser();
  const { data: tasks } = useTasks();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/referral" },
    { icon: Hourglass, label: "Status", href: "/status" },
    { icon: Calendar, label: "Appointments", href: "/appointments" },
    { icon: ClipboardList, label: "Results", href: "/results" },
    { icon: BookOpen, label: "Resources", href: "/resources" },
    { icon: User, label: "Account", href: "/account" },
  ];
  const taskItem = { icon: ListChecks, label: "Tasks", href: "/tasks" };
  const taskCount = (tasks || []).filter((task) => task.status === "Pending").length;

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row md:h-screen md:overflow-hidden font-sans text-foreground">

      {/* Mobile Header */}
      <div className="md:hidden bg-sidebar p-4 flex justify-between items-center border-b border-sidebar-border sticky top-0 z-50">
        <Link href="/referral" className="flex items-center gap-2.5" data-testid="link-logo-mobile">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
            Q
          </div>
          <span className="font-display font-bold text-xl text-foreground tracking-tight">CareQ</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white transition-colors"
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

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-dvh w-72 z-50",
        "flex flex-col shrink-0",
        "bg-sidebar border-r border-sidebar-border",
        "shadow-2xl md:shadow-none",
        "transition-transform duration-300 ease-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>

        {/* Brand */}
        <div className="px-5 pt-6 pb-4 shrink-0">
          <Link href="/referral" className="flex items-center gap-3 mb-5" data-testid="link-logo-sidebar">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-extrabold text-xl shrink-0">
              Q
            </div>
            <div>
              <h1 className="font-display font-bold text-[1.1rem] text-foreground leading-none tracking-tight">
                CareQ
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium leading-none mt-[3px] tracking-widest uppercase">
                Patient Portal
              </p>
            </div>
          </Link>
          <div className="mt-3 rounded-lg border border-border bg-white px-3 py-2">
            <p className="text-sm font-medium text-foreground">Alberta Hip and Knee Clinic</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-border shrink-0" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <Link href={taskItem.href}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                "text-[13.5px] font-medium cursor-pointer group",
                "transition-colors duration-150 border border-transparent mb-2",
                location === taskItem.href
                  ? "bg-accent text-primary border-primary/10"
                  : "text-neutral-600 hover:bg-white hover:text-foreground hover:border-border"
              )}
              onClick={() => setIsSidebarOpen(false)}
            >
              <taskItem.icon
                className={cn(
                  "w-[17px] h-[17px] shrink-0 transition-colors duration-150",
                  location === taskItem.href
                    ? "text-primary"
                    : "text-neutral-500 group-hover:text-neutral-700"
                )}
              />
              <span className={cn(location === taskItem.href && "font-semibold")}>{taskItem.label}</span>
              <div className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-semibold flex items-center justify-center shrink-0">
                {taskCount}
              </div>
            </div>
          </Link>

          <div className="mx-2 h-px bg-border mb-2" />

          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                    "text-[13.5px] font-medium cursor-pointer group",
                    "transition-colors duration-150 border border-transparent",
                    isActive
                      ? "bg-accent text-primary border-primary/10"
                      : "text-neutral-600 hover:bg-white hover:text-foreground hover:border-border"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className={cn(
                    "w-[17px] h-[17px] shrink-0 transition-colors duration-150",
                    isActive
                      ? "text-primary"
                      : "text-neutral-500 group-hover:text-neutral-700"
                  )} />
                  <span className={cn(isActive && "font-semibold")}>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-5 h-px bg-border shrink-0" />

        {/* User footer */}
        <div className="p-4 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-border">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold font-display shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-foreground truncate leading-snug">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-muted-foreground truncate leading-snug">{user?.email}</p>
            </div>
            <button
              className="text-muted-foreground hover:text-primary transition-colors p-1 rounded shrink-0"
              onClick={() => {
                localStorage.removeItem("careq_auth");
                localStorage.removeItem("careq_onboarding");
                window.location.href = "/";
              }}
              data-testid="button-patient-logout"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:min-w-0 overflow-y-auto bg-white">
        <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12 animate-enter">
          {children}
        </div>
      </main>
    </div>
  );
}
