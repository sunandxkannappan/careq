import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { ProviderLayout } from "@/provider/components/ProviderLayout";
import { cn } from "@/lib/utils";
import { useRole, canAccessReviewTab, type ReviewTab } from "@/provider/lib/RoleContext";
import {
  MOCK_REVIEWS,
  MOCK_PATIENTS,
  type ReviewActivity,
} from "@/provider/lib/mockData";
import {
  FileSearch,
  Stethoscope,
  FlaskConical,
  HeartHandshake,
  ChevronDown,
  CheckCircle2,
  Clock,
  User,
  Video,
  PhoneCall,
  FileText,
  Send,
  Check,
  X,
  AlertTriangle,
  Activity,
  Calendar,
  ClipboardList,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

// ─── Styles ─────────────────────────────────────────────────

const STATUS_STYLES: Record<ReviewActivity["status"], { bg: string; text: string; dot: string }> = {
  Outstanding:       { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  "In progress":     { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500"  },
  Complete:          { bg: "bg-green-50",   text: "text-green-700",   dot: "bg-green-500" },
  "Awaiting surgeon": { bg: "bg-purple-50",  text: "text-purple-600",  dot: "bg-purple-500" },
};

const PRIORITY_STYLES: Record<ReviewActivity["priority"], { bg: string; text: string }> = {
  Urgent: { bg: "bg-red-50",    text: "text-red-600"   },
  High:   { bg: "bg-amber-50",  text: "text-amber-700" },
  Medium: { bg: "bg-blue-50",   text: "text-blue-600"  },
  Low:    { bg: "bg-slate-100", text: "text-slate-500" },
};

const TYPE_CONFIG: Record<ReviewActivity["type"], { icon: typeof FileSearch; bg: string; text: string }> = {
  "E-consult":           { icon: FileSearch,      bg: "bg-blue-50",    text: "text-blue-600"    },
  "Escalation consult":  { icon: Stethoscope,     bg: "bg-red-50",     text: "text-red-600"     },
  "Investigation":       { icon: FlaskConical,    bg: "bg-purple-50",  text: "text-purple-600"  },
  "Care coordination":   { icon: HeartHandshake,  bg: "bg-emerald-50", text: "text-emerald-600" },
};

type ViewMode = "pending" | "complete";

const ALL_TABS: { key: ReviewTab; label: string }[] = [
  { key: "E-consult",           label: "E-Consults" },
  { key: "Escalation consult",  label: "Escalations" },
  { key: "Investigation",       label: "Investigations" },
  { key: "Care coordination",   label: "Care Coord." },
];

// ─── Due date clustering ────────────────────────────────────

type DueDateGroup = "Today" | "This Week" | "Next Week" | "Later";

function getDueDateGroup(dateStr: string): DueDateGroup {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr + "T00:00:00");
  const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays <= 7) return "This Week";
  if (diffDays <= 14) return "Next Week";
  return "Later";
}

const DUE_DATE_ORDER: DueDateGroup[] = ["Today", "This Week", "Next Week", "Later"];

function groupByDueDate(reviews: ReviewActivity[]): [DueDateGroup, ReviewActivity[]][] {
  const groups: Record<DueDateGroup, ReviewActivity[]> = { "Today": [], "This Week": [], "Next Week": [], "Later": [] };
  for (const r of reviews) groups[getDueDateGroup(r.createdDate)].push(r);
  return DUE_DATE_ORDER.filter((g) => groups[g].length > 0).map((g) => [g, groups[g]]);
}

// ─── Descriptions per role ──────────────────────────────────

function getTabDescription(tab: ReviewTab, isSurgeon: boolean): string {
  if (tab === "E-consult") {
    return isSurgeon
      ? "Waitlist journey summaries sent for your surgical review. Each consult summarizes what happened during the patient's time on the waitlist."
      : "Launch e-consults to send a waitlist journey summary to the surgeon for review. The consult captures everything that happened while the patient was on the waitlist.";
  }
  if (tab === "Escalation consult") {
    return isSurgeon
      ? "Early-triggered consults for patients who need urgent surgical review before their natural waitlist endpoint."
      : "Escalate patients who need urgent surgical attention before their natural waitlist endpoint. Functionally similar to e-consults but triggered early due to clinical concern.";
  }
  if (tab === "Investigation") return "Requisitions and imaging orders for waitlisted patients.";
  return "Care coordination activities across the waitlist team.";
}

// ─── Main component ─────────────────────────────────────────

export default function ProviderReviews() {
  const { role } = useRole();
  const isSurgeon = role.id === "surgeon";
  const visibleTabs = useMemo(() => ALL_TABS.filter(t => canAccessReviewTab(role.id, t.key)), [role.id]);
  const [tab, setTab] = useState<ReviewTab>(visibleTabs[0]?.key ?? "E-consult");
  const [view, setView] = useState<ViewMode>("pending");

  useEffect(() => {
    if (!visibleTabs.some(t => t.key === tab)) {
      setTab(visibleTabs[0]?.key ?? "E-consult");
    }
  }, [visibleTabs, tab]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = MOCK_REVIEWS.filter((r) => {
    if (r.type !== tab) return false;
    if (view === "pending") return r.status !== "Complete";
    return r.status === "Complete";
  });

  const pendingCount = MOCK_REVIEWS.filter((r) => r.type === tab && r.status !== "Complete").length;
  const completeCount = MOCK_REVIEWS.filter((r) => r.type === tab && r.status === "Complete").length;

  const grouped = view === "pending" ? groupByDueDate(filtered) : [["All" as DueDateGroup, filtered] as [DueDateGroup, ReviewActivity[]]];

  return (
    <ProviderLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1 font-light">
          {isSurgeon ? "Consults and escalations awaiting your review." : "Manage e-consults, escalations, investigations, and care coordination."}
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg w-fit mb-4 flex-wrap">
        {visibleTabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150", tab === t.key ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>{t.label}</button>
        ))}
      </div>

      {/* Tab description */}
      <p className="text-xs text-muted-foreground mb-6 max-w-2xl">{getTabDescription(tab, isSurgeon)}</p>

      {/* Pending / Complete toggle */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
          <button onClick={() => setView("pending")} className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150", view === "pending" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {isSurgeon && (tab === "E-consult" || tab === "Escalation consult") ? "Awaiting Review" : "Pending"}
          </button>
          <button onClick={() => setView("complete")} className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150", view === "complete" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {isSurgeon && (tab === "E-consult" || tab === "Escalation consult") ? "Reviewed" : "Complete"}
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span><span className="font-semibold text-foreground">{pendingCount}</span> pending</span>
          <span className="text-border">·</span>
          <span><span className="font-semibold text-foreground">{completeCount}</span> complete</span>
        </div>
      </div>

      {/* Review list */}
      {filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-border shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center mx-auto mb-3"><FileSearch className="w-5 h-5 text-muted-foreground/50" /></div>
          <p className="text-sm font-medium text-foreground">No review activities</p>
          <p className="text-xs text-muted-foreground mt-1">{view === "pending" ? "All caught up!" : "No completed items in this category."}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([groupLabel, reviews]) => (
            <div key={groupLabel}>
              {view === "pending" && (
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                  {groupLabel === "Today" && <Clock className="w-4 h-4 text-amber-500" />}
                  {groupLabel}
                  <span className="text-xs font-normal text-muted-foreground/70">({reviews.length})</span>
                </h2>
              )}
              <div className="space-y-3">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} expanded={expandedId === review.id} onToggle={() => setExpandedId(expandedId === review.id ? null : review.id)} isSurgeon={isSurgeon} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </ProviderLayout>
  );
}

// ─── Review card ────────────────────────────────────────────

function ReviewCard({ review, expanded, onToggle, isSurgeon }: { review: ReviewActivity; expanded: boolean; onToggle: () => void; isSurgeon: boolean }) {
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const statusStyle = STATUS_STYLES[review.status];
  const priorityStyle = PRIORITY_STYLES[review.priority];
  const typeConfig = TYPE_CONFIG[review.type];
  const TypeIcon = typeConfig.icon;
  const patient = MOCK_PATIENTS.find((p) => p.id === review.patientId);
  const hasJourney = review.waitlistSummary && (review.type === "E-consult" || review.type === "Escalation consult");
  const hasEConsultDashboard = review.type === "E-consult" || review.type === "Escalation consult";

  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div className={cn("bg-card rounded-xl border shadow-sm overflow-hidden transition-all duration-200", expanded ? "border-primary/20 shadow-md" : "border-border hover:shadow-md")}>
      {/* Card Header */}
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/20 transition-colors">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", typeConfig.bg)}>
          <TypeIcon className={cn("w-4 h-4", typeConfig.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-foreground">{review.patientName}</p>
            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", typeConfig.bg, typeConfig.text)}>{review.type}</span>
            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", priorityStyle.bg, priorityStyle.text)}>{review.priority}</span>
            {review.waitlistSummary?.isEarlyEscalation && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                <AlertTriangle className="w-3 h-3" />Early Trigger
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{review.description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full", statusStyle.bg, statusStyle.text)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)} />{review.status}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:block">{review.createdDate}</span>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", expanded && "rotate-180")} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Top content area */}
          <div className="p-5 bg-muted/10">

            {/* Escalation warning */}
            {hasJourney && review.waitlistSummary?.isEarlyEscalation && review.waitlistSummary.escalationReason && (
              <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl mb-5">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-700">Early Escalation Triggered</p>
                  <p className="text-xs text-red-600 mt-0.5 leading-relaxed">{review.waitlistSummary.escalationReason}</p>
                </div>
              </div>
            )}

            {/* 2-column layout: journey/details LEFT, actions RIGHT */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-6">

              {/* LEFT: Journey summary or standard details */}
              <div>
                {hasJourney && review.waitlistSummary ? (
                  <>
                    {/* Patient strip */}
                    {patient && (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 pb-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[11px] font-bold">
                            {patient.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="text-sm font-semibold text-foreground">{patient.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{patient.condition}</span>
                        <span className={cn(
                          "text-[11px] font-bold px-2 py-0.5 rounded-full",
                          patient.triageScore >= 75 ? "bg-red-50 text-red-600" :
                          patient.triageScore >= 45 ? "bg-amber-50 text-amber-700" :
                          "bg-green-50 text-green-600"
                        )}>Triage {patient.triageScore}</span>
                        {review.surgeonName && <span className="text-xs text-muted-foreground">→ {review.surgeonName}</span>}
                      </div>
                    )}

                    {/* Journey header */}
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ClipboardList className="w-3.5 h-3.5 text-primary" />
                      Waitlist Journey — {review.waitlistSummary.monthsOnWaitlist} months
                    </p>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-white rounded-lg border border-border p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mb-1"><Calendar className="w-3 h-3" />Duration</div>
                        <p className="text-base font-bold font-display text-foreground">{review.waitlistSummary.monthsOnWaitlist}<span className="text-[11px] font-normal text-muted-foreground ml-0.5">mo</span></p>
                      </div>
                      <div className="bg-white rounded-lg border border-border p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mb-1"><Video className="w-3 h-3" />Visits</div>
                        <p className="text-base font-bold font-display text-foreground">{review.waitlistSummary.virtualVisitsCompleted}<span className="text-[11px] font-normal text-muted-foreground ml-0.5">done</span></p>
                      </div>
                      <div className="bg-white rounded-lg border border-border p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mb-1"><FlaskConical className="w-3 h-3" />Tests</div>
                        <p className="text-base font-bold font-display text-foreground">{review.waitlistSummary.investigationsCompleted.length}<span className="text-[11px] font-normal text-muted-foreground ml-0.5">done</span></p>
                      </div>
                    </div>

                    {/* Key changes */}
                    <div className="bg-white rounded-xl border border-border p-4 mb-3">
                      <p className="text-[11px] font-bold text-foreground uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />Key Changes
                      </p>
                      <ul className="space-y-1.5">
                        {review.waitlistSummary.keyChanges.map((change, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                            <ArrowRight className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />{change}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Investigations + Care Plan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white rounded-xl border border-border p-3.5">
                        <p className="text-[11px] font-bold text-foreground uppercase tracking-wide mb-2">Investigations</p>
                        <ul className="space-y-1">
                          {review.waitlistSummary.investigationsCompleted.map((inv, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />{inv}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white rounded-xl border border-border p-3.5">
                        <p className="text-[11px] font-bold text-foreground uppercase tracking-wide mb-2">Care Plan</p>
                        <ul className="space-y-1">
                          {review.waitlistSummary.carePlanItems.map((item, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Triggered by */}
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      Triggered by <span className="font-medium text-foreground">{review.waitlistSummary.triggeredBy}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-muted text-[10px] font-medium">{review.waitlistSummary.triggerRole === "waitlist-gp" ? "Waitlist GP" : "Virtual GP"}</span>
                    </div>
                  </>
                ) : (
                  /* Standard non-journey layout */
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-border p-4">
                      <p className="text-sm text-foreground leading-relaxed">{review.description}</p>
                    </div>
                    {patient && (
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm bg-white rounded-xl border border-border p-4">
                        <span className="text-muted-foreground">Condition</span><span className="font-medium text-right">{patient.condition}</span>
                        <span className="text-muted-foreground">DOB</span><span className="font-medium text-right">{patient.dob}</span>
                        <span className="text-muted-foreground">Status</span><span className="font-medium text-right">{patient.status}</span>
                        <span className="text-muted-foreground">Triage</span><span className="font-medium text-right">{patient.triageScore}/100</span>
                        <span className="text-muted-foreground">Assigned To</span><span className="font-medium text-right">{review.assignedTo}</span>
                        {review.surgeonName && <><span className="text-muted-foreground">Surgeon</span><span className="font-medium text-right">{review.surgeonName}</span></>}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT: Action buttons column */}
              <div className="flex flex-col gap-2">
                {/* eConsult Summary — prominent CTA for E-consult/Escalation */}
                {hasEConsultDashboard && (
                  <Link href={`/econsult/${review.patientId}`}>
                    <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-all">
                      <Activity className="w-4 h-4" />eConsult Summary
                    </button>
                  </Link>
                )}

                {/* Divider if both sections present */}
                {hasEConsultDashboard && review.status !== "Complete" && (
                  <div className="h-px bg-border my-1" />
                )}

                {/* E-consult actions */}
                {review.type === "E-consult" && review.status !== "Complete" && (
                  isSurgeon ? (
                    <>
                      <button onClick={() => setShowForm(!showForm)} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-border bg-white text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors"><FileText className="w-4 h-4 text-muted-foreground" />Review Consult</button>
                      <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-green-200 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors"><CheckCircle2 className="w-4 h-4" />Accept for Surgery</button>
                      <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-amber-200 bg-amber-50 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-100 transition-colors"><Send className="w-4 h-4" />Request More Info</button>
                    </>
                  ) : (
                    review.status === "Outstanding" || review.status === "In progress" ? (
                      <button onClick={() => setShowForm(!showForm)} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-border bg-white text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors"><Send className="w-4 h-4 text-muted-foreground" />Send to Surgeon</button>
                    ) : (
                      <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-border bg-white text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors"><FileText className="w-4 h-4 text-muted-foreground" />View Sent Consult</button>
                    )
                  )
                )}

                {/* Escalation actions */}
                {review.type === "Escalation consult" && review.status !== "Complete" && (
                  isSurgeon ? (
                    <>
                      <button onClick={() => setShowForm(!showForm)} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-border bg-white text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors"><Stethoscope className="w-4 h-4 text-muted-foreground" />Review Escalation</button>
                      <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-green-200 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors"><CheckCircle2 className="w-4 h-4" />Accept for Surgery</button>
                      <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"><Video className="w-4 h-4" />Schedule Urgent Meeting</button>
                      <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors"><PhoneCall className="w-4 h-4" />VOIP GP</button>
                    </>
                  ) : (
                    <>
                      {(review.status === "Outstanding" || review.status === "In progress") ? (
                        <button onClick={() => setShowForm(!showForm)} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-red-200 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"><AlertTriangle className="w-4 h-4" />Escalate to Surgeon</button>
                      ) : (
                        <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-border bg-white text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors"><FileText className="w-4 h-4 text-muted-foreground" />View Escalation</button>
                      )}
                      <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors"><PhoneCall className="w-4 h-4" />VOIP Surgeon</button>
                    </>
                  )
                )}

                {/* Investigation actions */}
                {review.type === "Investigation" && review.status !== "Complete" && (
                  <>
                    <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-colors"><CheckCircle2 className="w-4 h-4" />Approve Requisition</button>
                    <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-border bg-white text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors"><Send className="w-4 h-4 text-muted-foreground" />Fax to Patient</button>
                    <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-border bg-white text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors"><Send className="w-4 h-4 text-muted-foreground" />Email Patient</button>
                  </>
                )}

                {/* Care coordination actions */}
                {review.type === "Care coordination" && review.status !== "Complete" && (
                  <>
                    <button onClick={() => setShowForm(!showForm)} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-colors"><FileText className="w-4 h-4" />Document Progress</button>
                    <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors"><PhoneCall className="w-4 h-4" />VOIP Family</button>
                    <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-border bg-white text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors"><FileSearch className="w-4 h-4 text-muted-foreground" />Launch E-Advice</button>
                  </>
                )}

                {/* Always present */}
                <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-border bg-white text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors mt-auto"><User className="w-4 h-4 text-muted-foreground" />Full Profile</button>
              </div>
            </div>
          </div>

          {/* Inline form */}
          {showForm && (
            <div className="border-t border-border p-5 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold font-display tracking-tight">
                  {isSurgeon && review.type === "E-consult" && "Surgical Assessment"}
                  {isSurgeon && review.type === "Escalation consult" && "Urgent Surgical Assessment"}
                  {!isSurgeon && review.type === "E-consult" && "E-Consult Summary for Surgeon"}
                  {!isSurgeon && review.type === "Escalation consult" && "Escalation Summary for Surgeon"}
                  {review.type === "Care coordination" && "Care Coordination Notes"}
                </h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                {isSurgeon && (review.type === "E-consult" || review.type === "Escalation consult") ? (
                  <>
                    <div>
                      <label className="text-sm font-medium block mb-1">Surgical Decision <span className="text-red-500">*</span></label>
                      <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                        <option value="">Select decision...</option>
                        <option>Accept for surgery</option>
                        <option>Decline — continue conservative management</option>
                        <option>Request additional investigations</option>
                        <option>Request in-person consultation</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Assessment Notes <span className="text-red-500">*</span></label>
                      <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Your surgical assessment based on the waitlist journey summary..." />
                    </div>
                    {review.type === "Escalation consult" && (
                      <div>
                        <label className="text-sm font-medium block mb-1">Urgency Recommendation</label>
                        <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                          <option>Expedite — move up surgical list</option>
                          <option>Standard priority — maintain position</option>
                          <option>Emergency — book within 48hrs</option>
                        </select>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium block mb-1">{review.type === "E-consult" || review.type === "Escalation consult" ? "Clinical Summary for Surgeon" : "Structured Assessment"} <span className="text-red-500">*</span></label>
                      <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder={review.type === "E-consult" ? "Summary of patient's waitlist journey and recommendation for surgeon..." : review.type === "Escalation consult" ? "Reason for early escalation and clinical concern..." : "Care coordination progress notes..."} />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Additional Notes</label>
                      <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]" placeholder="Additional context for the surgeon..." />
                    </div>
                  </>
                )}
                {(review.type === "E-consult" || review.type === "Escalation consult") && (
                  <div>
                    <label className="text-sm font-medium block mb-1">Billing Details</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div><label className="text-xs text-muted-foreground block mb-1">Family Present</label><select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"><option>No</option><option>Yes</option></select></div>
                      <div><label className="text-xs text-muted-foreground block mb-1">Time Taken</label><select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"><option>15 min</option><option>20 min</option><option>30 min</option><option>45 min</option></select></div>
                      <div><label className="text-xs text-muted-foreground block mb-1">Complexity</label><select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"><option>Low</option><option>Medium</option><option>High</option></select></div>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                  <button onClick={handleSave} className={cn("inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all", saved ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-primary/90")}>
                    {saved ? <CheckCircle2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    {saved ? "Saved" : isSurgeon ? "Submit Assessment" : "Send to Surgeon"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

