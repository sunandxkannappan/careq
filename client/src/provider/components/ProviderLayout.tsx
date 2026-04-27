import { Link, useLocation } from "wouter";
import {
  CalendarDays,
  CalendarCheck,
  Home,
  ClipboardList,
  Menu,
  X,
  ChevronDown,
  ClipboardCheck,
  FileSearch,
  Users,
  DollarSign,
  Settings,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MOCK_TASKS } from "@/provider/pages/ProviderTasks";
import { ROLES, canAccessPage, useRole } from "@/provider/lib/RoleContext";

const pendingCount = MOCK_TASKS.filter(t => !t.completed).length;

const navItems = [
  { icon: Home,          label: "Dashboard",    href: "/"             },
  { icon: CalendarCheck, label: "Appointments", href: "/appointments" },
  { icon: CalendarDays,  label: "Schedule",     href: "/schedule"     },
  { icon: ClipboardCheck,label: "Charting",     href: "/charting"     },
  { icon: FileSearch,    label: "Reviews",      href: "/reviews"      },
  { icon: Users,         label: "Patients",     href: "/patients"     },
  { icon: DollarSign,    label: "Earnings",     href: "/earnings"     },
  { icon: FileText,      label: "Forms",          href: "/forms"           },
  { icon: Settings,      label: "Account",      href: "/account"      },
];

export function ProviderLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const { role: activeRole, setRole: setActiveRole } = useRole();

  const visibleNavItems = navItems.filter(item => canAccessPage(activeRole.id, item.href));

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row md:h-screen md:overflow-hidden font-sans text-foreground">

      {/* Mobile header */}
      <div className="md:hidden bg-sidebar p-4 flex justify-between items-center border-b border-sidebar-border shadow-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-base">
            Q
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-xl text-foreground tracking-tight">CareQ</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Provider</span>
          </div>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-dvh w-72 z-50",
        "flex flex-col shrink-0",
        "bg-sidebar border-r border-sidebar-border",
        "shadow-xl md:shadow-none",
        "transition-transform duration-300 ease-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>

        {/* Brand */}
        <div className="px-5 pt-6 pb-4 shrink-0">
          <Link href="/" className="flex items-center gap-3 mb-1" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
              Q
            </div>
            <div>
              <h1 className="font-bold text-[1.1rem] text-foreground leading-none tracking-tight">
                CareQ
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium leading-none mt-[3px] tracking-widest uppercase">
                Provider Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-border shrink-0" />

        {/* Tasks — pinned top */}
        <div className="px-3 pt-3 pb-1 shrink-0">
          <Link href="/tasks">
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                "text-[13.5px] font-medium cursor-pointer group",
                "transition-colors duration-150 border border-transparent",
                location === "/tasks"
                  ? "bg-accent text-primary border-primary/10"
                  : "text-neutral-600 hover:bg-white hover:text-foreground hover:border-border"
              )}
              onClick={() => setIsSidebarOpen(false)}
            >
              <ClipboardList className={cn(
                "w-[17px] h-[17px] shrink-0 transition-colors duration-150",
                location === "/tasks" ? "text-primary" : "text-neutral-400 group-hover:text-neutral-600"
              )} />
              <span className={cn(location === "/tasks" && "font-semibold")}>Tasks</span>
              {pendingCount > 0 && (
                <span className="ml-auto text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
              {location === "/tasks" && pendingCount === 0 && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
              )}
            </div>
          </Link>
        </div>

        {/* Section label */}
        <div className="px-6 pt-3 pb-1.5 shrink-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Platform</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-3 space-y-0.5 overflow-y-auto">
          {visibleNavItems.map((item) => {
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
                    isActive ? "text-primary" : "text-neutral-400 group-hover:text-neutral-600"
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

        {/* User footer with role switcher */}
        <div className="p-4 shrink-0 relative">
          {/* Role dropdown menu */}
          {roleMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
              <div className="absolute bottom-full left-4 right-4 mb-1 bg-white rounded-lg border border-border shadow-lg z-50 overflow-hidden">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => { setActiveRole(role); setRoleMenuOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                      activeRole.id === role.id
                        ? "bg-primary/5 text-primary"
                        : "hover:bg-muted/50 text-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                      activeRole.id === role.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {role.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">{role.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{role.label}</p>
                    </div>
                    {activeRole.id === role.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-border hover:border-primary/30 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {activeRole.initials}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-semibold text-foreground truncate leading-snug">
                {activeRole.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate leading-snug">{activeRole.label}</p>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-muted-foreground shrink-0 transition-transform",
              roleMenuOpen && "rotate-180"
            )} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:min-w-0 overflow-y-auto bg-white">
        <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12 animate-enter">
          {children}
        </div>
      </main>
    </div>
  );
}
