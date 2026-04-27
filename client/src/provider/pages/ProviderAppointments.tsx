import { useState, type ChangeEvent } from "react";
import { ProviderLayout } from "@/provider/components/ProviderLayout";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import {
  format, isToday, isTomorrow, addDays,
  startOfWeek, endOfWeek, isWithinInterval, startOfDay,
} from "date-fns";
import {
  Calendar, Clock, User, Video, ChevronDown,
  ClipboardList, FileText, CheckCircle2, PhoneCall,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PreChartForm } from "./PreChartForm";

// ─── Types ───────────────────────────────────────────────────────────────────

type AppointmentStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled";
type AppointmentType = "Virtual";

interface Appointment {
  id: string;
  patientName: string;
  patientDob: string;
  time: string;
  duration: number;
  type: AppointmentType;
  reason: string;
  status: AppointmentStatus;
  date: Date;
  zoomUrl?: string;
}

export const STATUS_STYLES: Record<AppointmentStatus, { bg: string; text: string; dot: string }> = {
  Confirmed: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  Pending:   { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Completed: { bg: "bg-blue-50",  text: "text-blue-700",  dot: "bg-blue-500"  },
  Cancelled: { bg: "bg-red-50",   text: "text-red-600",   dot: "bg-red-500"   },
};

const today = startOfDay(new Date());

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_APPOINTMENTS: Appointment[] = [
  // Today
  { id: "1",  patientName: "Margaret Liu",    patientDob: "1968-04-12", time: "09:00", duration: 30, type: "Virtual", reason: "Post-op follow-up — right knee replacement",    status: "Confirmed", date: today },
  { id: "2",  patientName: "James Kowalski",  patientDob: "1955-11-03", time: "10:00", duration: 45, type: "Virtual", reason: "Pre-surgical consultation — hip replacement",   status: "Confirmed", date: today,             zoomUrl: "https://zoom.us/j/92345678901" },
  { id: "3",  patientName: "Sandra Obi",      patientDob: "1972-07-29", time: "11:30", duration: 30, type: "Virtual", reason: "Pain management review",                         status: "Pending",   date: today,             zoomUrl: "https://zoom.us/j/93456789012" },
  { id: "4",  patientName: "David Chen",      patientDob: "1960-02-18", time: "14:00", duration: 30, type: "Virtual", reason: "Results discussion — MRI",                       status: "Confirmed", date: today },
  // Tomorrow
  { id: "5",  patientName: "Helen Tremblay",  patientDob: "1949-09-05", time: "09:30", duration: 45, type: "Virtual", reason: "Initial assessment — knee osteoarthritis",        status: "Confirmed", date: addDays(today, 1), zoomUrl: "https://zoom.us/j/95678901234" },
  { id: "6",  patientName: "Robert Singh",    patientDob: "1963-12-22", time: "11:00", duration: 30, type: "Virtual", reason: "Waitlist check-in",                              status: "Confirmed", date: addDays(today, 1) },
  // This week
  { id: "7",  patientName: "Fatima Al-Rashid",patientDob: "1975-05-14", time: "13:30", duration: 60, type: "Virtual", reason: "Pre-op preparation — shoulder surgery",           status: "Pending",   date: addDays(today, 2), zoomUrl: "https://zoom.us/j/97890123456" },
  { id: "8",  patientName: "Luca Ferreira",   patientDob: "1982-08-30", time: "10:30", duration: 30, type: "Virtual", reason: "Post-op check — six weeks",                      status: "Confirmed", date: addDays(today, 3) },
  // Next week
  { id: "9",  patientName: "Brenda MacPherson",patientDob:"1958-01-07", time: "09:00", duration: 45, type: "Virtual", reason: "Annual surgical review",                          status: "Confirmed", date: addDays(today, 7), zoomUrl: "https://zoom.us/j/99012345678" },
  { id: "10", patientName: "Omar Hassan",     patientDob: "1970-03-25", time: "15:00", duration: 30, type: "Virtual", reason: "Medication review",                              status: "Cancelled", date: addDays(today, 8) },
  { id: "11", patientName: "Patricia Nguyen", patientDob: "1965-06-11", time: "11:00", duration: 30, type: "Virtual", reason: "Physiotherapy referral discussion",               status: "Confirmed", date: addDays(today, 9), zoomUrl: "https://zoom.us/j/91234509876" },
  // Past
  { id: "12", patientName: "Thomas Blais",    patientDob: "1953-10-19", time: "14:30", duration: 45, type: "Virtual", reason: "Post-op follow-up — spinal surgery",              status: "Completed", date: addDays(today, -1),  zoomUrl: "https://zoom.us/j/91234500001" },
  { id: "13", patientName: "Yuki Tanaka",     patientDob: "1966-03-08", time: "10:00", duration: 30, type: "Virtual", reason: "Pre-surgical consultation — hip replacement",     status: "Completed", date: addDays(today, -2) },
  { id: "14", patientName: "Carlos Mendez",   patientDob: "1971-11-14", time: "09:00", duration: 45, type: "Virtual", reason: "Six-week post-op assessment",                     status: "Completed", date: addDays(today, -2),  zoomUrl: "https://zoom.us/j/91234500003" },
  { id: "15", patientName: "Alice Beaumont",  patientDob: "1960-07-22", time: "13:00", duration: 30, type: "Virtual", reason: "Waitlist status update",                          status: "Cancelled", date: addDays(today, -4) },
  { id: "16", patientName: "Frank Osei",      patientDob: "1957-09-30", time: "11:30", duration: 60, type: "Virtual", reason: "Initial orthopaedic assessment",                  status: "Completed", date: addDays(today, -5),  zoomUrl: "https://zoom.us/j/91234500005" },
  { id: "17", patientName: "Nadia Volkov",    patientDob: "1979-01-17", time: "15:00", duration: 30, type: "Virtual", reason: "Results review — X-ray",                          status: "Completed", date: addDays(today, -7) },
  { id: "18", patientName: "Derek Huang",     patientDob: "1952-05-03", time: "09:30", duration: 45, type: "Virtual", reason: "Three-month post-op follow-up",                   status: "Completed", date: addDays(today, -10), zoomUrl: "https://zoom.us/j/91234500007" },
];

// ─── Filtering / grouping helpers ─────────────────────────────────────────────

type FilterKey = "today" | "tomorrow" | "this-week" | "next-week" | "all" | "past";

const UPCOMING_FILTERS: { key: FilterKey; label: string }[] = [
  { key: "today",     label: "Today" },
  { key: "tomorrow",  label: "Tomorrow" },
  { key: "this-week", label: "This week" },
  { key: "next-week", label: "Next week" },
  { key: "all",       label: "All upcoming" },
];

function filterAppointments(appointments: Appointment[], filter: FilterKey): Appointment[] {
  const now = new Date();
  const weekStart     = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd       = endOfWeek(now,   { weekStartsOn: 1 });
  const nextWeekStart = addDays(weekStart, 7);
  const nextWeekEnd   = addDays(weekEnd,   7);

  const result = appointments.filter((a) => {
    switch (filter) {
      case "today":     return isToday(a.date);
      case "tomorrow":  return isTomorrow(a.date);
      case "this-week": return isWithinInterval(a.date, { start: weekStart, end: weekEnd });
      case "next-week": return isWithinInterval(a.date, { start: nextWeekStart, end: nextWeekEnd });
      case "all":       return a.date >= startOfDay(now);
      case "past":      return a.date < startOfDay(now);
      default:          return true;
    }
  });

  return result.sort((a, b) => {
    const dateDiff = a.date.getTime() - b.date.getTime();
    const timeDiff = a.time.localeCompare(b.time);
    if (filter === "past") return dateDiff !== 0 ? -dateDiff : -timeDiff;
    return dateDiff !== 0 ? dateDiff : timeDiff;
  });
}

function groupByDate(appointments: Appointment[]): [string, Appointment[]][] {
  const map = new Map<string, Appointment[]>();
  for (const appt of appointments) {
    const key = format(appt.date, "yyyy-MM-dd");
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(appt);
  }
  return Array.from(map.entries());
}

function formatDateHeading(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (isToday(d))    return "Today — " + format(d, "MMMM d");
  if (isTomorrow(d)) return "Tomorrow — " + format(d, "MMMM d");
  return format(d, "EEEE, MMMM d");
}

// ─── Pre-chart dialog ─────────────────────────────────────────────────────────

const HISTORY_FLAGS = [
  "Previous orthopaedic surgery",
  "Diabetes",
  "Hypertension",
  "Anticoagulant therapy",
  "Cardiac history",
  "Renal impairment",
  "Active infection",
  "Latex allergy",
];

function PreChartDialog({ appt, open, onClose }: { appt: Appointment; open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg tracking-tight flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Pre-chart — {appt.patientName}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {format(appt.date, "EEEE, MMMM d, yyyy")} · {appt.time} · {appt.duration} min · {appt.type}
          </p>
        </DialogHeader>

        <div className="pt-2">
          <PreChartForm apptId={appt.id} patientName={appt.patientName} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Post-chart dialog ────────────────────────────────────────────────────────

const REFERRAL_OPTIONS = [
  "Physiotherapy",
  "Diagnostic imaging",
  "Pain management clinic",
  "Occupational therapy",
  "Social work",
  "Other specialist",
];

const FOLLOWUP_OPTIONS = [
  "1 week", "2 weeks", "1 month", "3 months", "6 months", "PRN", "None",
];

function PostChartDialog({ appt, open, onClose }: { appt: Appointment; open: boolean; onClose: () => void }) {
  const [summary, setSummary]         = useState("");
  const [assessment, setAssessment]   = useState("");
  const [plan, setPlan]               = useState("");
  const [prescriptions, setPrescriptions] = useState("");
  const [followUp, setFollowUp]       = useState("PRN");
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [referrals, setReferrals]     = useState<string[]>([]);
  const [saved, setSaved]             = useState(false);

  function toggleReferral(r: string) {
    setReferrals(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Post-chart — {appt.patientName}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {format(appt.date, "EEEE, MMMM d, yyyy")} · {appt.time} · {appt.duration} min · {appt.type}
          </p>
        </DialogHeader>

        <div className="space-y-6 pt-2">

          {/* Patient overview */}
          <section className="bg-muted/30 rounded-xl border border-border/50 p-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Patient</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{appt.patientName}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Date of birth</p>
              <p className="text-sm text-foreground mt-0.5">{appt.patientDob}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Reason for visit</p>
              <p className="text-sm text-foreground mt-0.5">{appt.reason}</p>
            </div>
          </section>

          {/* Visit summary */}
          <section>
            <Label className="text-sm font-semibold font-display">Visit summary</Label>
            <Textarea
              value={summary}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSummary(e.target.value)}
              placeholder="Brief summary of what occurred during the visit..."
              rows={3}
              className="mt-2 text-sm resize-none"
            />
          </section>

          {/* Assessment & Plan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <section>
              <Label className="text-sm font-semibold font-display">Assessment / Diagnosis</Label>
              <Textarea
                value={assessment}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAssessment(e.target.value)}
                placeholder="Clinical assessment and diagnosis..."
                rows={4}
                className="mt-2 text-sm resize-none"
              />
            </section>
            <section>
              <Label className="text-sm font-semibold font-display">Management plan</Label>
              <Textarea
                value={plan}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPlan(e.target.value)}
                placeholder="Treatment plan and next steps..."
                rows={4}
                className="mt-2 text-sm resize-none"
              />
            </section>
          </div>

          {/* Prescriptions */}
          <section>
            <Label className="text-sm font-semibold font-display">Prescriptions / medication changes</Label>
            <Textarea
              value={prescriptions}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPrescriptions(e.target.value)}
              placeholder="New prescriptions or changes to existing medications..."
              rows={2}
              className="mt-2 text-sm resize-none"
            />
          </section>

          {/* Follow-up */}
          <section>
            <Label className="text-sm font-semibold font-display">Follow-up</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {FOLLOWUP_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFollowUp(opt)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-150",
                    followUp === opt
                      ? "bg-primary text-white border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/50 hover:text-primary"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
            <Textarea
              value={followUpNotes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFollowUpNotes(e.target.value)}
              placeholder="Follow-up instructions for patient..."
              rows={2}
              className="mt-2 text-sm resize-none"
            />
          </section>

          {/* Referrals */}
          <section>
            <Label className="text-sm font-semibold font-display">Referrals</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              {REFERRAL_OPTIONS.map((r) => (
                <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
                  <Checkbox
                    checked={referrals.includes(r)}
                    onCheckedChange={() => toggleReferral(r)}
                  />
                  <span className="text-sm text-foreground group-hover:text-foreground/80 transition-colors">
                    {r}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} className="gap-2 min-w-32">
              {saved ? (
                <><CheckCircle2 className="w-4 h-4" /> Saved</>
              ) : (
                "Save post-chart"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Appointment card ─────────────────────────────────────────────────────────

export function AppointmentCard({ appt, expanded, onToggle, isPast = false }: {
  appt: Appointment;
  expanded: boolean;
  onToggle: () => void;
  isPast?: boolean;
}) {
  const style = STATUS_STYLES[appt.status];
  const [chartOpen, setChartOpen] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <>
      <div
        className={cn(
          "bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-all duration-200",
          expanded && "shadow-md"
        )}
      >
        <button
          className="w-full flex items-center gap-5 p-5 text-left hover:bg-muted/30 transition-colors"
          onClick={onToggle}
        >
          {/* Time */}
          <div className="shrink-0 text-center w-16">
            <p className="text-base font-semibold text-foreground font-display">{appt.time}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{appt.duration}min</p>
          </div>

          {/* Divider */}
          <div className="w-px h-11 bg-border shrink-0" />

          {/* Patient info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[15px] font-semibold text-foreground">{appt.patientName}</span>
              <span className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full",
                style.bg, style.text
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
                {appt.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 truncate">{appt.reason}</p>
          </div>

          {/* Type badge + ready indicator + chevron */}
          <div className="shrink-0 flex items-center gap-3">
            {!isPast && isToday(appt.date) && (appt.status === "Confirmed" || appt.status === "Pending") && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Ready to join
              </span>
            )}
            <span className={cn(
              "hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-md",
              "bg-muted/60 text-muted-foreground"
            )}>
              <Video className="w-3.5 h-3.5" />
              Virtual
            </span>
            <ChevronDown className={cn(
              "w-5 h-5 text-muted-foreground transition-transform duration-200",
              expanded && "rotate-180"
            )} />
          </div>
        </button>

        {/* Expanded detail */}
        {expanded && (
          <div className="px-4 pb-4 border-t border-border/60 pt-3">
            <div className="flex items-start gap-6">
              {/* Info — left side */}
              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Patient DOB</p>
                    <p className="text-sm text-foreground">{appt.patientDob}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Duration</p>
                    <p className="text-sm text-foreground">{appt.duration} minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Video className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Type</p>
                    <p className="text-sm text-foreground">Virtual</p>
                  </div>
                </div>
                <div className="sm:col-span-3 flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Reason</p>
                    <p className="text-sm text-foreground">{appt.reason}</p>
                  </div>
                </div>
              </div>

              {/* Actions — right side, vertically centered */}
              <div className="shrink-0 flex flex-col items-end gap-2 w-44">
                {isPast ? (
                  <Button
                    onClick={(e) => { e.stopPropagation(); setChartOpen(true); }}
                    variant="outline"
                    className="gap-2 w-full justify-center text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/30"
                  >
                    <FileText className="w-4 h-4" />
                    Complete post-chart
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={(e) => { e.stopPropagation(); setChartOpen(true); }}
                      className="gap-2 w-full justify-center"
                    >
                      <ClipboardList className="w-4 h-4" />
                      Complete pre-chart
                    </Button>
                    {appt.zoomUrl ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); setLocation(`/call/zoom/${appt.id}`); }}
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        Join Zoom
                      </button>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setLocation(`/call/voip/${appt.id}`); }}
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                      >
                        <PhoneCall className="w-4 h-4" />
                        VOIP Patient
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      {isPast ? (
        <PostChartDialog appt={appt} open={chartOpen} onClose={() => setChartOpen(false)} />
      ) : (
        <PreChartDialog  appt={appt} open={chartOpen} onClose={() => setChartOpen(false)} />
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProviderAppointments() {
  const [view, setView]               = useState<"upcoming" | "past">("upcoming");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("today");
  const [expandedId, setExpandedId]   = useState<string | null>(null);

  const effectiveFilter: FilterKey = view === "past" ? "past" : activeFilter;
  const filtered = filterAppointments(MOCK_APPOINTMENTS, effectiveFilter);
  const grouped  = groupByDate(filtered);

  const confirmedCount = filtered.filter(a => a.status === "Confirmed").length;
  const completedCount = filtered.filter(a => a.status === "Completed").length;

  return (
    <ProviderLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">Appointments</h1>
        <p className="text-base text-muted-foreground mt-1.5 font-light">
          View and manage your scheduled patient appointments.
        </p>
      </div>

      {/* Upcoming / Past toggle */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg w-fit mb-4">
        {(["upcoming", "past"] as const).map((v) => (
          <button
            key={v}
            onClick={() => { setView(v); setExpandedId(null); }}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 capitalize",
              view === v ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {v === "upcoming" ? "Upcoming" : "Past"}
          </button>
        ))}
      </div>

      {/* Upcoming sub-filters */}
      {view === "upcoming" && (
        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg w-fit mb-6 flex-wrap border border-border/50">
          {UPCOMING_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => { setActiveFilter(f.key); setExpandedId(null); }}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150",
                activeFilter === f.key
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Summary */}
      {filtered.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> appointment{filtered.length !== 1 ? "s" : ""}
          </span>
          {view === "upcoming" && confirmedCount > 0 && (
            <>
              <span className="text-border">·</span>
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-green-700">{confirmedCount}</span> confirmed
              </span>
            </>
          )}
          {view === "past" && completedCount > 0 && (
            <>
              <span className="text-border">·</span>
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-blue-700">{completedCount}</span> completed
              </span>
            </>
          )}
        </div>
      )}

      {/* Appointment groups */}
      {grouped.length === 0 ? (
        <div className="bg-card rounded-xl border border-border shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-5 h-5 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-foreground">No appointments</p>
          <p className="text-xs text-muted-foreground mt-1">Nothing scheduled for this period.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([dateStr, appts]) => (
            <div key={dateStr}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {view === "past" ? format(new Date(dateStr + "T00:00:00"), "EEEE, MMMM d") : formatDateHeading(dateStr)}
              </h2>
              <div className="space-y-2">
                {appts.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appt={appt}
                    expanded={expandedId === appt.id}
                    onToggle={() => setExpandedId(expandedId === appt.id ? null : appt.id)}
                    isPast={view === "past"}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </ProviderLayout>
  );
}
