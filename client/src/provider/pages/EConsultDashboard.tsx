import { useMemo } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Pill,
  Shield,
  FileText,
  Heart,
  Stethoscope,
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertTriangle,
  Dumbbell,
  FlaskConical,
  Salad,
  ChevronDown,
} from "lucide-react";
import { ProviderLayout } from "@/provider/components/ProviderLayout";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  MOCK_PATIENTS,
  MOCK_ECONSULT_PATIENTS,
  type TreatmentResponse,
  type EConsultPatient,
  type SymptomDataPoint,
  type TreatmentAttempt,
} from "@/provider/lib/mockData";

// ─── Response badge styles ────────────────────────────────────────────────────

const RESPONSE_STYLES: Record<
  TreatmentResponse,
  { bg: string; text: string; border: string; label: string; icon: typeof CheckCircle2 }
> = {
  improvement: { bg: "bg-green-50",  text: "text-green-700",  border: "border-l-green-500",  label: "Improvement",    icon: CheckCircle2 },
  partial:     { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-l-amber-500",  label: "Partial",        icon: MinusCircle  },
  none:        { bg: "bg-slate-100", text: "text-slate-600",  border: "border-l-slate-400",  label: "No Response",    icon: XCircle      },
  worsening:   { bg: "bg-red-50",    text: "text-red-700",    border: "border-l-red-500",    label: "Worsening",      icon: AlertTriangle },
};

const CATEGORY_ICONS: Record<string, typeof Pill> = {
  medication:    Pill,
  therapy:       Dumbbell,
  procedure:     Stethoscope,
  lifestyle:     Salad,
  investigation: FlaskConical,
};

function scoreColor(score: number): string {
  if (score <= 3) return "#16a34a";
  if (score <= 6) return "#d97706";
  return "#dc2626";
}

function calcAge(dob: string): number {
  const birth = new Date(dob);
  const now   = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
  return age;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}

// ─── SVG Symptom Chart ────────────────────────────────────────────────────────

function SymptomChart({ data }: { data: SymptomDataPoint[] }) {
  const W = 600, H = 200;
  const pad = { top: 20, right: 30, bottom: 35, left: 45 };
  const cw  = W - pad.left - pad.right;
  const ch  = H - pad.top  - pad.bottom;

  const points = data.map((d, i) => ({
    x: pad.left + (data.length > 1 ? (i / (data.length - 1)) * cw : cw / 2),
    y: pad.top + ch - (d.score / 10) * ch,
    ...d,
  }));
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  const monthLabel = (d: string) => {
    const [y, m] = d.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[parseInt(m) - 1]} '${y.slice(2)}`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {[0, 2, 4, 6, 8, 10].map((v) => {
        const y = pad.top + ch - (v / 10) * ch;
        return (
          <g key={v}>
            <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={v === 0 ? "0" : "4 4"} />
            <text x={pad.left - 8} y={y + 4} textAnchor="end" className="fill-slate-400" fontSize="10">{v}</text>
          </g>
        );
      })}
      <text x={12} y={pad.top + ch / 2} textAnchor="middle" className="fill-slate-400" fontSize="9" transform={`rotate(-90, 12, ${pad.top + ch / 2})`}>Pain (0–10)</text>
      <polyline points={polyline} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill={scoreColor(p.score)} stroke="white" strokeWidth="2" />
          <text x={p.x} y={H - 8} textAnchor="middle" className="fill-slate-500" fontSize="9">{monthLabel(p.date)}</text>
          <title>{`${monthLabel(p.date)}: ${p.score}/10${p.note ? ` — ${p.note}` : ""}`}</title>
        </g>
      ))}
    </svg>
  );
}

// ─── Core Stat Box (LifestyleRx-style) ───────────────────────────────────────

function CoreStat({ label, value, sub, colorClass }: {
  label: string;
  value: string;
  sub?: string;
  colorClass: string;
}) {
  return (
    <div className={cn("rounded-lg p-3 text-center flex flex-col items-center justify-center", colorClass)}>
      <p className="text-xl font-bold font-display tracking-tight leading-none">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide mt-1 opacity-75">{label}</p>
      {sub && <p className="text-[10px] mt-0.5 opacity-60">{sub}</p>}
    </div>
  );
}

// ─── Treatment Card (Attempted Management) ───────────────────────────────────

function TreatmentCard({ t }: { t: TreatmentAttempt }) {
  const style = RESPONSE_STYLES[t.response];
  const Icon  = CATEGORY_ICONS[t.category] || Activity;
  return (
    <div className={cn("rounded-lg border bg-white p-4 border-l-4", style.border)}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className={cn("w-7 h-7 rounded-md flex items-center justify-center", style.bg)}>
            <Icon className={cn("w-3.5 h-3.5", style.text)} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-900">{t.name}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {formatDate(t.startDate)}{t.endDate ? ` — ${formatDate(t.endDate)}` : " — Ongoing"}
              {t.prescribedBy && <span className="ml-2 text-slate-500">· {t.prescribedBy}</span>}
            </p>
          </div>
        </div>
        <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", style.bg, style.text)}>
          <style.icon className="w-3 h-3" />
          {style.label}
        </span>
      </div>
      <p className="text-[12px] text-slate-600 mt-2.5 leading-relaxed">{t.responseNote}</p>
    </div>
  );
}

// ─── Sidebar Section (simple card with +/- toggle via native details) ────────

function SidebarSection({ title, defaultOpen = false, children }: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none list-none">
        <span className="text-[13px] font-bold text-slate-900">{title}</span>
        <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-4 pb-4 border-t border-slate-100 pt-3">
        {children}
      </div>
    </details>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EConsultDashboard({ patientId }: { patientId: string }) {
  const econsult = useMemo(() => MOCK_ECONSULT_PATIENTS.find((e) => e.patientId === patientId), [patientId]);
  const patient  = useMemo(() => MOCK_PATIENTS.find((p) => p.id === patientId), [patientId]);

  if (!econsult || !patient) {
    return (
      <ProviderLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <AlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
          <h2 className="text-lg font-semibold text-slate-900">Patient not found</h2>
          <p className="text-sm text-slate-500 mt-1">No eConsult data available for this patient.</p>
          <Link href="/reviews" className="mt-4 text-sm font-medium text-primary hover:underline">Back to Reviews</Link>
        </div>
      </ProviderLayout>
    );
  }

  const age         = calcAge(patient.dob);
  const latestPain  = econsult.symptomScores[econsult.symptomScores.length - 1];
  const firstPain   = econsult.symptomScores[0];
  const latestBmi   = econsult.bmiHistory[econsult.bmiHistory.length - 1];
  const firstBmi    = econsult.bmiHistory[0];
  const latestWt    = econsult.weightHistory[econsult.weightHistory.length - 1];
  const firstWt     = econsult.weightHistory[0];

  const painDelta   = latestPain.score - firstPain.score;
  const bmiDelta    = (latestBmi.value - firstBmi.value).toFixed(1);
  const wtDelta     = (latestWt.value  - firstWt.value).toFixed(1);

  const treatmentSummary = econsult.treatments.reduce((acc, t) => {
    acc[t.response] = (acc[t.response] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group conditions by a rough system category for the sidebar display
  const conditionsBySystem = econsult.conditions.reduce((acc, c) => {
    const sys = c.system ?? "Other";
    if (!acc[sys]) acc[sys] = [];
    acc[sys].push(c);
    return acc;
  }, {} as Record<string, typeof econsult.conditions>);

  return (
    <ProviderLayout>
      <div className="max-w-6xl mx-auto animate-enter">

        {/* ── Back link ─────────────────────────────────────────────────── */}
        <Link href="/reviews" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Reviews
        </Link>

        {/* ── Patient Header ─────────────────────────────────────────────── */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-slate-900 font-display tracking-tight">{patient.name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[13px] text-slate-500">
            <span>{age} Year Old</span>
            <span className="text-slate-300">|</span>
            <span>Active since {econsult.programStartDate}</span>
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-slate-700">Program Month {econsult.programDurationMonths}</span>
            <span className="text-slate-300">|</span>
            <span>PHN {patient.phn}</span>
            <span className="text-slate-300">|</span>
            <span
              className={cn(
                "font-semibold",
                patient.triageScore >= 75 ? "text-red-600" :
                patient.triageScore >= 45 ? "text-amber-600" : "text-green-600"
              )}
            >
              Triage {patient.triageScore}
            </span>
          </div>
          <p className="text-[13px] text-slate-500 mt-1.5">
            <span className="font-semibold text-slate-700">Consult Reason: </span>{econsult.consultReason}
          </p>
        </div>

        {/* ── Two-column body ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-6 items-start">

          {/* ── LEFT: Main Accordion ──────────────────────────────────────── */}
          <Accordion type="multiple" defaultValue={["symptom-trend", "attempted-management", "assessment"]} className="space-y-3">

            {/* Symptom Trend */}
            <AccordionItem value="symptom-trend" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <AccordionTrigger className="px-5 py-3.5 hover:no-underline">
                <span className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                  <Activity className="w-4 h-4 text-slate-400" />
                  Symptom Trend
                  <span className="text-[11px] font-medium text-slate-400 ml-1">
                    Pain {firstPain.score}/10 → {latestPain.score}/10 over {econsult.programDurationMonths} months
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4">
                <SymptomChart data={econsult.symptomScores} />
                <div className="mt-2 space-y-1">
                  {econsult.symptomScores.filter((s) => s.note).map((s, i) => (
                    <p key={i} className="text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-600">{s.date}:</span> {s.note}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Attempted Management */}
            <AccordionItem value="attempted-management" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <AccordionTrigger className="px-5 py-3.5 hover:no-underline">
                <span className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                  <Stethoscope className="w-4 h-4 text-slate-400" />
                  Attempted Management
                  <span className="text-[11px] font-medium text-slate-400 ml-1">
                    {econsult.treatments.length} treatments
                    {treatmentSummary.improvement ? ` · ${treatmentSummary.improvement} improved` : ""}
                    {treatmentSummary.none ? ` · ${treatmentSummary.none} no response` : ""}
                    {treatmentSummary.worsening ? ` · ${treatmentSummary.worsening} worsening` : ""}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4">
                <div className="space-y-3">
                  {econsult.treatments.map((t) => <TreatmentCard key={t.id} t={t} />)}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Assessment & Plan */}
            <AccordionItem value="assessment" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <AccordionTrigger className="px-5 py-3.5 hover:no-underline">
                <span className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Assessment &amp; Plan
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4">
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Assessment</p>
                  <p className="text-[13px] text-slate-700 leading-relaxed">{econsult.assessmentNotes}</p>
                </div>
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Plan</p>
                  <ol className="space-y-2">
                    {econsult.planItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
                {econsult.clinicianNotes && (
                  <div className="mb-4 bg-blue-50/60 rounded-lg p-3.5 border border-blue-100">
                    <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wide mb-1">Clinician Notes</p>
                    <p className="text-[13px] text-slate-700 leading-relaxed">{econsult.clinicianNotes}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2.5 pt-4 border-t border-slate-100">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-primary/90 transition-all">
                    <CheckCircle2 className="w-4 h-4" /> Accept for Surgery
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all">
                    <FileText className="w-4 h-4 text-slate-400" /> Request More Info
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all">
                    <ArrowLeft className="w-4 h-4 text-slate-400" /> Send Back to GP
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Treatment Timeline (collapsed) */}
            <AccordionItem value="treatment-timeline" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <AccordionTrigger className="px-5 py-3.5 hover:no-underline">
                <span className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Treatment Timeline
                  <span className="text-[11px] font-medium text-slate-400 ml-1">
                    {econsult.treatments.length} interventions over {econsult.programDurationMonths} months
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4">
                <div className="relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200" />
                  <div className="space-y-3">
                    {econsult.treatments.map((t) => {
                      const style = RESPONSE_STYLES[t.response];
                      const Icon  = CATEGORY_ICONS[t.category] || Activity;
                      return (
                        <div key={t.id} className="relative pl-8">
                          <div className={cn(
                            "absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm",
                            t.response === "improvement" ? "bg-green-500" :
                            t.response === "partial"     ? "bg-amber-500" :
                            t.response === "worsening"   ? "bg-red-500"   : "bg-slate-400"
                          )} />
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[13px] font-semibold text-slate-900">{t.name}</p>
                              <p className="text-[11px] text-slate-400">
                                {formatDate(t.startDate)}{t.endDate ? ` — ${formatDate(t.endDate)}` : " — Ongoing"}
                              </p>
                            </div>
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", style.bg, style.text)}>
                              {style.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          {/* ── RIGHT: Sidebar ─────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Core Stats — LifestyleRx-style colored boxes */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-3">Core Stats</p>
              <div className="grid grid-cols-3 gap-2">
                <CoreStat
                  label="Pain"
                  value={`${latestPain.score}/10`}
                  sub={`${painDelta > 0 ? "+" : ""}${painDelta} from start`}
                  colorClass={latestPain.score >= 7 ? "bg-red-100 text-red-900" : latestPain.score >= 4 ? "bg-amber-100 text-amber-900" : "bg-green-100 text-green-900"}
                />
                <CoreStat
                  label="BMI"
                  value={latestBmi.value.toFixed(1)}
                  sub={`${Number(bmiDelta) > 0 ? "+" : ""}${bmiDelta} from start`}
                  colorClass={Number(bmiDelta) <= 0 ? "bg-green-100 text-green-900" : "bg-amber-100 text-amber-900"}
                />
                <CoreStat
                  label="Weight"
                  value={`${latestWt.value}kg`}
                  sub={`${Number(wtDelta) > 0 ? "+" : ""}${wtDelta} kg`}
                  colorClass={Number(wtDelta) <= 0 ? "bg-blue-100 text-blue-900" : "bg-amber-100 text-amber-900"}
                />
              </div>
              {/* Trend indicators below boxes */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Pain trend", val: painDelta, good: painDelta < 0 },
                  { label: "BMI trend",  val: Number(bmiDelta), good: Number(bmiDelta) < 0 },
                  { label: "Wt trend",   val: Number(wtDelta),  good: Number(wtDelta) < 0  },
                ].map(({ label, val, good }) => {
                  const Icon = val < 0 ? TrendingDown : val > 0 ? TrendingUp : Minus;
                  return (
                    <div key={label} className={cn("flex items-center justify-center gap-0.5 text-[10px] font-semibold", good ? "text-green-600" : val === 0 ? "text-slate-400" : "text-red-600")}>
                      <Icon className="w-3 h-3" />
                      {label}
                    </div>
                  );
                })}
              </div>
              {/* Program duration */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {econsult.programDurationMonths} months on program</span>
                <span>Updated {econsult.lastUpdated}</span>
              </div>
            </div>

            {/* Medical History */}
            <SidebarSection title="Medical History" defaultOpen>
              {Object.keys(conditionsBySystem).length === 0 ? (
                <p className="text-[12px] text-slate-400">No conditions recorded.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(conditionsBySystem).map(([system, conds]) => (
                    <div key={system}>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">{system}</p>
                      <div className="space-y-0.5">
                        {conds.map((c, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-[12px] text-slate-700">{c.name}</span>
                            <span className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded",
                              c.status === "active"   ? "bg-red-50 text-red-600" :
                              c.status === "managed"  ? "bg-blue-50 text-blue-600" :
                              "bg-green-50 text-green-600"
                            )}>
                              {c.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SidebarSection>

            {/* Medications */}
            <SidebarSection title="Medications" defaultOpen>
              {patient.medications.length === 0 ? (
                <p className="text-[12px] text-slate-400">No medications recorded.</p>
              ) : (
                <div className="space-y-1.5">
                  {patient.medications.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Pill className="w-3 h-3 text-slate-300 shrink-0" />
                      <span className="text-[12px] text-slate-700">{m}</span>
                    </div>
                  ))}
                  {patient.allergies.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1 mb-2">
                        <Shield className="w-3 h-3 text-red-400" /> Allergies
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {patient.allergies.map((a, i) => (
                          <span key={i} className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </SidebarSection>

            {/* Surgeon info */}
            <SidebarSection title="Surgeon Assignment">
              <div className="space-y-2 text-[12px] text-slate-700">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{patient.surgeon}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{patient.nextAppointment ? `Next visit: ${patient.nextAppointment}` : "No upcoming visit scheduled"}</span>
                </div>
                <div className={cn(
                  "inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full mt-1",
                  patient.triageScore >= 75 ? "bg-red-50 text-red-700" :
                  patient.triageScore >= 45 ? "bg-amber-50 text-amber-700" :
                  "bg-green-50 text-green-700"
                )}>
                  <Activity className="w-3 h-3" />
                  Triage Score: {patient.triageScore}
                </div>
              </div>
            </SidebarSection>

          </div>
          {/* end RIGHT */}

        </div>
        {/* end two-column */}

      </div>
    </ProviderLayout>
  );
}
