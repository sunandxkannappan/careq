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
  Image,
  Heart,
  Weight,
  Stethoscope,
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertTriangle,
  Dumbbell,
  FlaskConical,
  Salad,
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

// ─── Response badge styles ─────────────────────────────────

const RESPONSE_STYLES: Record<
  TreatmentResponse,
  { bg: string; text: string; border: string; label: string; icon: typeof CheckCircle2 }
> = {
  improvement: { bg: "bg-green-50", text: "text-green-700", border: "border-l-green-500", label: "Improvement", icon: CheckCircle2 },
  partial: { bg: "bg-amber-50", text: "text-amber-700", border: "border-l-amber-500", label: "Partial Response", icon: MinusCircle },
  none: { bg: "bg-slate-100", text: "text-slate-600", border: "border-l-slate-400", label: "No Response", icon: XCircle },
  worsening: { bg: "bg-red-50", text: "text-red-700", border: "border-l-red-500", label: "Worsening", icon: AlertTriangle },
};

const CATEGORY_ICONS: Record<string, typeof Pill> = {
  medication: Pill,
  therapy: Dumbbell,
  procedure: Stethoscope,
  lifestyle: Salad,
  investigation: FlaskConical,
};

function scoreColor(score: number): string {
  if (score <= 3) return "#16a34a";
  if (score <= 6) return "#d97706";
  return "#dc2626";
}

function calcAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
  return age;
}

// ─── SVG Symptom Chart ─────────────────────────────────────

function SymptomChart({ data }: { data: SymptomDataPoint[] }) {
  const W = 600, H = 200;
  const pad = { top: 20, right: 30, bottom: 35, left: 45 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  const points = data.map((d, i) => ({
    x: pad.left + (data.length > 1 ? (i / (data.length - 1)) * cw : cw / 2),
    y: pad.top + ch - (d.score / 10) * ch,
    ...d,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  const monthLabel = (d: string) => {
    const [y, m] = d.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(m) - 1]} '${y.slice(2)}`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {/* Gridlines */}
      {[0, 2, 4, 6, 8, 10].map((v) => {
        const y = pad.top + ch - (v / 10) * ch;
        return (
          <g key={v}>
            <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={v === 0 ? "0" : "4 4"} />
            <text x={pad.left - 8} y={y + 4} textAnchor="end" className="fill-slate-400" fontSize="10">{v}</text>
          </g>
        );
      })}
      {/* Axis label */}
      <text x={12} y={pad.top + ch / 2} textAnchor="middle" className="fill-slate-400" fontSize="9" transform={`rotate(-90, 12, ${pad.top + ch / 2})`}>Pain (0-10)</text>
      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#1f64ad" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots & labels */}
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

// ─── Treatment Timeline ────────────────────────────────────

function TreatmentTimelineItem({ t }: { t: TreatmentAttempt }) {
  const style = RESPONSE_STYLES[t.response];
  const Icon = CATEGORY_ICONS[t.category] || Activity;

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-CA", { month: "short", year: "numeric" });
  };

  return (
    <div className="relative pl-8">
      {/* Dot */}
      <div className={cn("absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm", style.bg === "bg-green-50" ? "bg-green-500" : style.bg === "bg-amber-50" ? "bg-amber-500" : style.bg === "bg-red-50" ? "bg-red-500" : "bg-slate-400")} />
      {/* Card */}
      <div className={cn('rounded-lg border bg-white p-4 border-l-4', style.border)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center">
              <Icon className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-900">{t.name}</p>
              <p className="text-[11px] text-slate-400">
                {formatDate(t.startDate)}{t.endDate ? ` — ${formatDate(t.endDate)}` : " — Ongoing"}
                {t.prescribedBy && <span className="ml-2">by {t.prescribedBy}</span>}
              </p>
            </div>
          </div>
          <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", style.bg, style.text)}>
            <style.icon className="w-3 h-3" />
            {style.label}
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{t.responseNote}</p>
      </div>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────

function StatCard({ label, value, unit, delta, deltaDirection }: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaDirection?: "up" | "down" | "flat";
}) {
  const isGoodDirection = (label === "BMI" || label === "Weight") ? deltaDirection === "down" : deltaDirection === "up";
  const TrendIcon = deltaDirection === "up" ? TrendingUp : deltaDirection === "down" ? TrendingDown : Minus;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm">
      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-xl font-bold text-slate-900">{value}</span>
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
      </div>
      {delta && deltaDirection && (
        <div className={cn("flex items-center gap-1 mt-1.5 text-[11px] font-semibold", isGoodDirection ? "text-green-600" : deltaDirection === "flat" ? "text-slate-400" : "text-red-600")}>
          <TrendIcon className="w-3 h-3" />
          {delta}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────

export default function EConsultDashboard({ patientId }: { patientId: string }) {
  const econsult = useMemo(() => MOCK_ECONSULT_PATIENTS.find((e) => e.patientId === patientId), [patientId]);
  const patient = useMemo(() => MOCK_PATIENTS.find((p) => p.id === patientId), [patientId]);

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

  const age = calcAge(patient.dob);
  const latestPain = econsult.symptomScores[econsult.symptomScores.length - 1];
  const firstPain = econsult.symptomScores[0];
  const latestBmi = econsult.bmiHistory[econsult.bmiHistory.length - 1];
  const firstBmi = econsult.bmiHistory[0];
  const latestWeight = econsult.weightHistory[econsult.weightHistory.length - 1];
  const firstWeight = econsult.weightHistory[0];

  const treatmentSummary = econsult.treatments.reduce((acc, t) => {
    acc[t.response] = (acc[t.response] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeConds = econsult.conditions.filter((c) => c.status === "active").length;
  const managedConds = econsult.conditions.filter((c) => c.status === "managed").length;

  return (
    <ProviderLayout>
      <div className="max-w-5xl mx-auto p-0 sm:p-2">
        {/* Back link */}
        <Link href="/reviews" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Reviews
        </Link>

        {/* ── Patient Header ─────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                {patient.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">{patient.name}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{age}yo</span>
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" />PHN {patient.phn}</span>
                  <span className="flex items-center gap-1"><Stethoscope className="w-3 h-3" />{patient.surgeon}</span>
                  <span className={cn("flex items-center gap-1 font-semibold", patient.triageScore >= 75 ? "text-red-600" : patient.triageScore >= 45 ? "text-amber-600" : "text-green-600")}>
                    <Activity className="w-3 h-3" />Triage {patient.triageScore}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                <Clock className="w-3 h-3" /> {econsult.programDurationMonths} months
              </span>
              <span className="text-[11px] text-slate-400">Updated {econsult.lastUpdated}</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed border-t border-slate-100 pt-3">
            <span className="font-semibold text-slate-700">Consult Reason: </span>{econsult.consultReason}
          </p>
        </div>

        {/* ── Quick Stats + Figure Area ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Stats column */}
          <div className="space-y-3">
            <StatCard
              label="Pain Score"
              value={`${latestPain.score}/10`}
              delta={`${latestPain.score > firstPain.score ? "+" : ""}${latestPain.score - firstPain.score} from baseline`}
              deltaDirection={latestPain.score > firstPain.score ? "up" : latestPain.score < firstPain.score ? "down" : "flat"}
            />
            <StatCard
              label="BMI"
              value={latestBmi.value.toFixed(1)}
              delta={`${(latestBmi.value - firstBmi.value).toFixed(1)} from baseline`}
              deltaDirection={latestBmi.value < firstBmi.value ? "down" : latestBmi.value > firstBmi.value ? "up" : "flat"}
            />
            <StatCard
              label="Weight"
              value={latestWeight.value.toFixed(1)}
              unit="kg"
              delta={`${(latestWeight.value - firstWeight.value).toFixed(1)} kg`}
              deltaDirection={latestWeight.value < firstWeight.value ? "down" : latestWeight.value > firstWeight.value ? "up" : "flat"}
            />
            <StatCard
              label="Images"
              value={econsult.images.length}
              unit="uploaded"
            />
          </div>

          {/* Figure area */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Image className="w-4 h-4 text-slate-400" /> Clinical Images
            </h3>
            {econsult.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {econsult.images.map((img) => (
                  <div key={img.id} className="bg-slate-50 rounded-lg border border-slate-200 aspect-[4/3] flex flex-col items-center justify-center p-3 text-center">
                    <Image className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-[11px] font-medium text-slate-600">{img.label}</p>
                    <p className="text-[10px] text-slate-400">{img.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
                No images uploaded
              </div>
            )}
          </div>
        </div>

        {/* ── Accordion Sections ─────────────────────────── */}
        <Accordion type="multiple" defaultValue={["attempted-management", "assessment"]} className="space-y-3">

          {/* Symptom Timeline */}
          <AccordionItem value="symptom-timeline" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <AccordionTrigger className="px-5 py-3.5 text-[13px] font-bold text-slate-900 hover:no-underline">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                Symptom Trend
                <span className="text-[11px] font-medium text-slate-400 ml-2">
                  Pain {firstPain.score}/10 &rarr; {latestPain.score}/10 over {econsult.programDurationMonths} months
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5">
              <SymptomChart data={econsult.symptomScores} />
              {/* Notes under chart */}
              <div className="mt-3 space-y-1">
                {econsult.symptomScores.filter((s) => s.note).map((s, i) => (
                  <p key={i} className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-600">{s.date}:</span> {s.note}
                  </p>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Treatment Timeline */}
          <AccordionItem value="treatment-timeline" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <AccordionTrigger className="px-5 py-3.5 text-[13px] font-bold text-slate-900 hover:no-underline">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Treatment Timeline
                <span className="text-[11px] font-medium text-slate-400 ml-2">
                  {econsult.treatments.length} treatments
                  {treatmentSummary.improvement ? `, ${treatmentSummary.improvement} improved` : ""}
                  {treatmentSummary.partial ? `, ${treatmentSummary.partial} partial` : ""}
                  {treatmentSummary.none ? `, ${treatmentSummary.none} no response` : ""}
                  {treatmentSummary.worsening ? `, ${treatmentSummary.worsening} worsening` : ""}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5">
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200" />
                <div className="space-y-3">
                  {econsult.treatments.map((t) => (
                    <TreatmentTimelineItem key={t.id} t={t} />
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Past Medical History */}
          <AccordionItem value="pmhx" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <AccordionTrigger className="px-5 py-3.5 text-[13px] font-bold text-slate-900 hover:no-underline">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-slate-400" />
                Past Medical History
                <span className="text-[11px] font-medium text-slate-400 ml-2">
                  {activeConds} active, {managedConds} managed
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5">
              <div className="space-y-2">
                {econsult.conditions.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-700">{c.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">{c.diagnosedDate}</span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        c.status === "active" ? "bg-red-50 text-red-600" :
                        c.status === "managed" ? "bg-blue-50 text-blue-600" :
                        "bg-green-50 text-green-600"
                      )}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Attempted Management (EXPANDED by default) */}
          <AccordionItem value="attempted-management" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <AccordionTrigger className="px-5 py-3.5 text-[13px] font-bold text-slate-900 hover:no-underline">
              <span className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-slate-400" />
                Attempted Management
                <span className="text-[11px] font-medium text-slate-400 ml-2">
                  {econsult.treatments.length} treatments tried
                  {treatmentSummary.improvement ? ` — ${treatmentSummary.improvement} improved` : ""}
                  {treatmentSummary.none ? `, ${treatmentSummary.none} no response` : ""}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5">
              <div className="space-y-3">
                {econsult.treatments.map((t) => {
                  const style = RESPONSE_STYLES[t.response];
                  const Icon = CATEGORY_ICONS[t.category] || Activity;
                  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
                  return (
                    <div key={t.id} className={cn("rounded-lg border bg-white p-4 border-l-4", style.border)}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", style.bg)}>
                            <Icon className={cn("w-4 h-4", style.text)} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {formatDate(t.startDate)}{t.endDate ? ` — ${formatDate(t.endDate)}` : " — Ongoing"}
                              {t.prescribedBy && <span className="ml-2 text-slate-500">| {t.prescribedBy}</span>}
                            </p>
                          </div>
                        </div>
                        <span className={cn("inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0", style.bg, style.text)}>
                          <style.icon className="w-3 h-3" />
                          {style.label}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-600 mt-2.5 leading-relaxed">{t.responseNote}</p>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Medications */}
          <AccordionItem value="medications" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <AccordionTrigger className="px-5 py-3.5 text-[13px] font-bold text-slate-900 hover:no-underline">
              <span className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-slate-400" />
                Medications
                <span className="text-[11px] font-medium text-slate-400 ml-2">
                  {patient.medications.length} current
                  {patient.medications.length > 0 && ` — ${patient.medications.slice(0, 2).join(", ")}${patient.medications.length > 2 ? "..." : ""}`}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5">
              <div className="space-y-2">
                {patient.medications.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0">
                    <Pill className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    <span className="text-sm text-slate-700">{m}</span>
                  </div>
                ))}
              </div>
              {patient.allergies.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[12px] font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                    <Shield className="w-3.5 h-3.5 text-red-400" /> Allergies
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {patient.allergies.map((a, i) => (
                      <span key={i} className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Assessment / Plan / Notes (EXPANDED by default) */}
          <AccordionItem value="assessment" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <AccordionTrigger className="px-5 py-3.5 text-[13px] font-bold text-slate-900 hover:no-underline">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Assessment &amp; Plan
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5">
              {/* Assessment narrative */}
              <div className="mb-5">
                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-2">Assessment</p>
                <p className="text-sm text-slate-700 leading-relaxed">{econsult.assessmentNotes}</p>
              </div>

              {/* Plan items */}
              <div className="mb-5">
                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-2">Plan</p>
                <ol className="space-y-2">
                  {econsult.planItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Clinician notes */}
              {econsult.clinicianNotes && (
                <div className="mb-5 bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                  <p className="text-[12px] font-bold text-blue-700 uppercase tracking-wide mb-1.5">Clinician Notes</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{econsult.clinicianNotes}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1f64ad] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all">
                  <CheckCircle2 className="w-4 h-4" /> Accept for Surgery
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all">
                  <FileText className="w-4 h-4 text-slate-400" /> Request More Info
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all">
                  <ArrowLeft className="w-4 h-4 text-slate-400" /> Send Back to GP
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </ProviderLayout>
  );
}
