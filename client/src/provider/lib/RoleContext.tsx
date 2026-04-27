import { createContext, useContext, useState, useCallback } from "react";
import { useLocation } from "wouter";

// ─── Role definitions ──────────────────────────────────────

export type RoleId = "virtual-gp" | "waitlist-gp" | "virtual-nurse" | "waitlist-nurse" | "surgeon";

export interface Role {
  id: RoleId;
  label: string;
  initials: string;
  name: string;
  email: string;
}

export const ROLES: Role[] = [
  { id: "virtual-gp",    label: "Virtual GP",      initials: "DR", name: "Dr. Reynolds",    email: "dr.reynolds@careq.ca" },
  { id: "waitlist-gp",   label: "Waitlist GP",     initials: "DR", name: "Dr. Reynolds",    email: "dr.reynolds@careq.ca" },
  { id: "virtual-nurse", label: "Virtual Nurse",   initials: "NJ", name: "Nurse Johnson",   email: "n.johnson@careq.ca" },
  { id: "waitlist-nurse", label: "Waitlist Nurse", initials: "NJ", name: "Nurse Johnson",   email: "n.johnson@careq.ca" },
  { id: "surgeon",       label: "Surgeon",         initials: "SP", name: "Dr. Patel",       email: "dr.patel@careq.ca" },
];

// ─── Page access by role ───────────────────────────────────

const PAGE_ACCESS: Record<string, RoleId[]> = {
  "/":              ["virtual-gp", "waitlist-gp", "virtual-nurse", "waitlist-nurse", "surgeon"],
  "/appointments":  ["virtual-gp", "virtual-nurse"],
  "/schedule":      ["virtual-gp", "virtual-nurse"],
  "/charting":      ["virtual-gp", "virtual-nurse"],
  "/reviews":       ["virtual-gp", "waitlist-gp", "waitlist-nurse", "surgeon"],
  "/patients":      ["virtual-gp", "waitlist-gp", "virtual-nurse", "waitlist-nurse", "surgeon"],
  "/tasks":         ["virtual-gp", "waitlist-gp", "virtual-nurse", "waitlist-nurse", "surgeon"],
  "/earnings":      ["virtual-gp", "waitlist-gp", "virtual-nurse", "waitlist-nurse", "surgeon"],
  "/account":       ["virtual-gp", "waitlist-gp", "virtual-nurse", "waitlist-nurse", "surgeon"],
  "/forms":          ["virtual-gp", "waitlist-gp", "virtual-nurse", "waitlist-nurse", "surgeon"],
};

export function canAccessPage(roleId: RoleId, href: string): boolean {
  const roles = PAGE_ACCESS[href];
  if (!roles) return true; // unknown routes are accessible
  return roles.includes(roleId);
}

// ─── Charting tab access ───────────────────────────────────
// Pre-chart: VN only
// Chart review: VP only
// Appointment charting: VP (full), VN (limited)
// E-advice: VP only

export type ChartTab = "Pre-chart" | "Chart review" | "Appointment charting" | "E-advice";

const CHARTING_ACCESS: Record<ChartTab, RoleId[]> = {
  "Pre-chart":            ["virtual-nurse"],
  "Chart review":         ["virtual-gp"],
  "Appointment charting": ["virtual-gp", "virtual-nurse"],
  "E-advice":             ["virtual-gp"],
};

export function canAccessChartTab(roleId: RoleId, tab: ChartTab): boolean {
  return CHARTING_ACCESS[tab].includes(roleId);
}

// ─── Reviews tab access ────────────────────────────────────
// E-consult: WP (launches via reviews), VP (launches via charting), S (reviews/receives)
// Escalation consult: WP (triggers early), VP (triggers via charting), S (reviews/receives)
// Investigation: WN (triages), WP (approves), VP (launches)
// Care coordination: WN (manages), WP (launches e-advice)

export type ReviewTab = "E-consult" | "Escalation consult" | "Investigation" | "Care coordination";

const REVIEW_ACCESS: Record<ReviewTab, RoleId[]> = {
  "E-consult":          ["waitlist-gp", "virtual-gp", "surgeon"],
  "Escalation consult": ["waitlist-gp", "virtual-gp", "surgeon"],
  "Investigation":      ["waitlist-nurse", "waitlist-gp", "virtual-gp"],
  "Care coordination":  ["waitlist-nurse", "waitlist-gp"],
};

export function canAccessReviewTab(roleId: RoleId, tab: ReviewTab): boolean {
  return REVIEW_ACCESS[tab].includes(roleId);
}

// ─── Task type access by role ────────────────────────────────
// Defines which task categories each role can see on Dashboard & Tasks pages.
// Virtual GP:    Charting, E-advice, E-consult, Escalation, Scheduling
// Virtual Nurse: Charting, Scheduling
// Waitlist GP:   E-consult, Escalation, Investigations, Care Coordination
// Waitlist Nurse: Investigations, Care Coordination, Scheduling
// Surgeon:       E-consult, Escalation

const TASK_TYPE_ACCESS: Record<string, RoleId[]> = {
  "Charting":            ["virtual-gp", "virtual-nurse"],
  "E-advice":            ["virtual-gp"],
  "E-consult":           ["waitlist-gp", "virtual-gp", "surgeon"],
  "Escalation":          ["waitlist-gp", "virtual-gp", "surgeon"],
  "Investigations":      ["waitlist-nurse", "waitlist-gp", "virtual-gp"],
  "Care Coordination":   ["waitlist-nurse", "waitlist-gp"],
  "Scheduling":          ["virtual-gp", "virtual-nurse", "waitlist-nurse"],
};

export function canAccessTaskType(roleId: RoleId, taskType: string): boolean {
  const roles = TASK_TYPE_ACCESS[taskType];
  if (!roles) return true;
  return roles.includes(roleId);
}

// ─── Dashboard access ──────────────────────────────────────
// VP, VN: Appointments + Tasks
// WP, WN, S: Tasks only

export function showDashboardAppointments(roleId: RoleId): boolean {
  return roleId === "virtual-gp" || roleId === "virtual-nurse";
}

// ─── Context ───────────────────────────────────────────────

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(ROLES[0]);
  const [currentLocation, setLocation] = useLocation();

  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole);
    // If current page isn't accessible for the new role, redirect to dashboard
    // useLocation() returns base-relative paths (e.g. "/appointments" not "/provider/appointments")
    const normalized = currentLocation === "/" ? "/" : currentLocation.replace(/\/$/, "");
    if (!canAccessPage(newRole.id, normalized)) {
      setLocation("/");
    }
  }, [currentLocation, setLocation]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
