import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Stethoscope,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// ─── Shared UI helpers (same pattern as HealthHistoryForm) ──

function BigRadioOption({ value, label, sublabel, selected, onSelect }: {
  value: string; label: string; sublabel?: string; selected: boolean; onSelect: (v: string) => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => onSelect(value)}
          className={cn(
            "w-full min-w-0 flex items-center gap-3 px-4 py-3.5 rounded-lg border-2 transition-all text-left min-h-[52px]",
            "text-[15px] font-medium",
            selected
              ? "border-primary bg-primary/5 text-primary"
              : "border-border bg-white text-foreground hover:border-primary/30 hover:bg-muted/30"
          )}
        >
          <div className={cn(
            "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors",
            selected ? "border-primary bg-primary" : "border-muted-foreground/40"
          )}>
            {selected && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div className="min-w-0 overflow-hidden">
            <span className="line-clamp-2">{label}</span>
            {sublabel && <span className="block text-xs text-muted-foreground font-normal mt-0.5">{sublabel}</span>}
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-center bg-primary text-white border-primary">{label}</TooltipContent>
    </Tooltip>
  );
}

function BigCheckbox({ checked, onCheckedChange, label }: {
  checked: boolean; onCheckedChange: (v: boolean) => void; label: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => onCheckedChange(!checked)}
          className={cn(
            "w-full min-w-0 flex items-center gap-3 px-4 py-3.5 rounded-lg border-2 transition-all text-left min-h-[52px]",
            "text-[15px] font-medium",
            checked
              ? "border-primary bg-primary/5 text-primary"
              : "border-border bg-white text-foreground hover:border-primary/30 hover:bg-muted/30"
          )}
        >
          <div className={cn(
            "w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors",
            checked ? "border-primary bg-primary" : "border-muted-foreground/40"
          )}>
            {checked && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className="min-w-0 overflow-hidden line-clamp-2">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-center bg-primary text-white border-primary">{label}</TooltipContent>
    </Tooltip>
  );
}

function FormField({ label, required, children, hint, source }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string; source?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <Label className="text-[15px] font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {source && <span className="text-[11px] text-muted-foreground italic shrink-0">{source}</span>}
      </div>
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function SectionHeading({ children, tag }: { children: React.ReactNode; tag?: string }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      {tag && (
        <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md">{tag}</span>
      )}
      <h3 className="text-lg font-semibold font-display tracking-tight text-foreground">{children}</h3>
    </div>
  );
}

function BigInput({ ...props }: React.ComponentProps<typeof Input>) {
  return <Input {...props} className={cn("h-12 text-[15px] px-4", props.className)} />;
}

function ClinicianBadge() {
  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
      <Stethoscope className="w-4 h-4 text-amber-600" />
      <span className="text-sm font-medium text-amber-800">Clinician / Chart Review</span>
    </div>
  );
}

// ─── Types ──────────────────────────────────────────────────

export interface TriageFormData {
  // Header
  patientName: string;
  dob: string;
  date: string;
  jointAssessed: string;
  referringClinician: string;
  nhiMrn: string;

  // Section A – Pain & Symptoms (each 0–4)
  a1: string; a2: string; a3: string; a4: string; a5: string; a6: string;

  // Section B – Functional Impact (each 0–4)
  b1: string; b2: string; b3: string; b4: string; b5: string; b6: string;

  // Section C – Quality of Life
  c1: string; // 0–10 slider
  c2: string; // 0–3
  c3: string; // 0–4
  c4: string; // 0–4

  // Section D – Attempted Management
  d1Treatments: { physio: boolean; bracing: boolean; antiInflammatories: boolean; injections: boolean; weightLoss: boolean; exercise: boolean; acupuncture: boolean; otherTreatment: boolean };
  d2: string;
  d3: string;
  d4: string;
  d5Medications: string;

  // Section E – Patient Readiness
  e1Told: string;
  e1Interest: string;
  e2Expectations: { painRelief: boolean; walkBetter: boolean; returnWork: boolean; sleepBetter: boolean; returnSport: boolean; independence: boolean };
  e3Support: string;
  e3Barriers: string;
  e3BarrierDetails: string;

  // Section F – Radiographic (clinician)
  f1Grade: string;
  f1XrayDate: string;
  f1Projection: string;
  f1Features: { cysts: boolean; malalignment: boolean; boneOnBone: boolean; deformity: boolean };
  f2Knee: string;
  f2Hip: string;
  f3Contralateral: string;

  // Section G – Physical Exam (clinician)
  g1Gait: string;
  g1MobilityAid: string;
  g2FlexionDeg: string;
  g2ExtensionDeg: string;
  g2AbductionDeg: string;
  g2InternalRotDeg: string;
  g2FlexionSev: string;
  g2ExtensionSev: string;
  g2AbductionSev: string;
  g2InternalRotSev: string;
  g2Overall: string;
  g3ML: string;
  g3AP: string;
  g4Deformity: string;

  // Section H – Medical Complexity (clinician)
  h1Asa: string;
  h2Comorbidities: string;
  h3PrevSurgery: string;
  h3Skin: string;

  // Override triggers
  overrideTriggers: Record<string, boolean>;
  clinicianName: string;
  clinicianDate: string;
  clinicalComments: string;
}

function getInitialTriageData(): TriageFormData {
  return {
    patientName: "", dob: "", date: new Date().toISOString().split("T")[0],
    jointAssessed: "", referringClinician: "", nhiMrn: "",
    a1: "", a2: "", a3: "", a4: "", a5: "", a6: "",
    b1: "", b2: "", b3: "", b4: "", b5: "", b6: "",
    c1: "", c2: "", c3: "", c4: "",
    d1Treatments: { physio: false, bracing: false, antiInflammatories: false, injections: false, weightLoss: false, exercise: false, acupuncture: false, otherTreatment: false },
    d2: "", d3: "", d4: "", d5Medications: "",
    e1Told: "", e1Interest: "", e2Expectations: { painRelief: false, walkBetter: false, returnWork: false, sleepBetter: false, returnSport: false, independence: false },
    e3Support: "", e3Barriers: "", e3BarrierDetails: "",
    f1Grade: "", f1XrayDate: "", f1Projection: "",
    f1Features: { cysts: false, malalignment: false, boneOnBone: false, deformity: false },
    f2Knee: "", f2Hip: "",
    f3Contralateral: "",
    g1Gait: "", g1MobilityAid: "",
    g2FlexionDeg: "", g2ExtensionDeg: "", g2AbductionDeg: "", g2InternalRotDeg: "",
    g2FlexionSev: "", g2ExtensionSev: "", g2AbductionSev: "", g2InternalRotSev: "",
    g2Overall: "", g3ML: "", g3AP: "", g4Deformity: "",
    h1Asa: "", h2Comorbidities: "", h3PrevSurgery: "", h3Skin: "",
    overrideTriggers: {},
    clinicianName: "", clinicianDate: new Date().toISOString().split("T")[0],
    clinicalComments: "",
  };
}

// ─── Score calculation (exported for use in ScoreView) ──────

export interface SectionScore {
  key: string;
  label: string;
  raw: number;
  rawMax: number;
  scaled: number;
  scaledMax: number;
  severity: "mild" | "moderate" | "severe" | "na";
  completedBy: "patient" | "clinician";
}

export function calculateScores(d: TriageFormData): { sections: SectionScore[]; total: number; band: number; overrideToUrgent: boolean } {
  const num = (v: string) => { const n = parseInt(v); return isNaN(n) ? 0 : n; };

  // A: Pain (raw /24 → /20)
  const aRaw = num(d.a1) + num(d.a2) + num(d.a3) + num(d.a4) + num(d.a5) + num(d.a6);
  const aScaled = Math.round((aRaw / 24) * 20 * 10) / 10;
  const aSev = aScaled <= 6 ? "mild" : aScaled <= 13 ? "moderate" : "severe";

  // B: Function (raw /24 → /20)
  const bRaw = num(d.b1) + num(d.b2) + num(d.b3) + num(d.b4) + num(d.b5) + num(d.b6);
  const bScaled = Math.round((bRaw / 24) * 20 * 10) / 10;
  const bSev = bScaled <= 6 ? "mild" : bScaled <= 13 ? "moderate" : "severe";

  // C: QoL (raw /14 → /12)
  // C1 recode: 0–4→3, 5–6→2, 7–8→1, 9–10→0
  const c1val = num(d.c1);
  const c1Recoded = c1val <= 4 ? 3 : c1val <= 6 ? 2 : c1val <= 8 ? 1 : 0;
  const cRaw = c1Recoded + num(d.c2) + num(d.c3) + num(d.c4);
  const cScaled = Math.round((cRaw / 14) * 12 * 10) / 10;

  // D: Management (raw /16 → /10)
  const d1Count = Object.values(d.d1Treatments).filter(Boolean).length;
  const d1Score = d1Count >= 3 ? 0 : d1Count >= 1 ? 2 : 4;
  const dRaw = d1Score + num(d.d2) + num(d.d3) + num(d.d4);
  const dScaled = Math.round((dRaw / 16) * 10 * 10) / 10;

  // E: Readiness (E1 interest + E3 barriers, max 8)
  const e1 = num(d.e1Interest);
  const e3Map: Record<string, number> = { "no-barriers": 4, "minor": 2, "significant": 0 };
  const e3 = e3Map[d.e3Barriers] ?? 0;
  const eScaled = Math.min(e1 + e3, 8);

  // F: Radiographic (raw /13 → /15)
  const f1Map: Record<string, number> = { "0": 0, "1": 1, "2": 2, "3": 4, "4": 6 };
  const f1 = f1Map[d.f1Grade] ?? 0;
  const f2 = Math.max(num(d.f2Knee), num(d.f2Hip));
  const f3 = num(d.f3Contralateral);
  const fRaw = f1 + f2 + f3;
  const fScaled = Math.round((fRaw / 13) * 15 * 10) / 10;

  // G: Physical (raw /14 → /10)
  const g1 = num(d.g1Gait) + num(d.g1MobilityAid);
  const g2 = num(d.g2Overall);
  const g3 = num(d.g3ML) + num(d.g3AP);
  const g4 = num(d.g4Deformity);
  const gRaw = g1 + g2 + g3 + g4;
  const gScaled = Math.round((gRaw / 14) * 10 * 10) / 10;

  // H: Medical (raw /6 → /5)
  const hRaw = num(d.h1Asa) + num(d.h2Comorbidities);
  const hScaled = Math.round((hRaw / 6) * 5 * 10) / 10;

  const sections: SectionScore[] = [
    { key: "A", label: "Pain & Symptoms", raw: aRaw, rawMax: 24, scaled: Math.min(aScaled, 20), scaledMax: 20, severity: aSev as any, completedBy: "patient" },
    { key: "B", label: "Functional Impact", raw: bRaw, rawMax: 24, scaled: Math.min(bScaled, 20), scaledMax: 20, severity: bSev as any, completedBy: "patient" },
    { key: "C", label: "Quality of Life", raw: cRaw, rawMax: 14, scaled: Math.min(cScaled, 12), scaledMax: 12, severity: cScaled <= 4 ? "mild" : cScaled <= 8 ? "moderate" : "severe", completedBy: "patient" },
    { key: "D", label: "Attempted Management", raw: dRaw, rawMax: 16, scaled: Math.min(dScaled, 10), scaledMax: 10, severity: dScaled <= 3 ? "mild" : dScaled <= 6 ? "moderate" : "severe", completedBy: "patient" },
    { key: "E", label: "Patient Readiness", raw: e1 + e3, rawMax: 8, scaled: eScaled, scaledMax: 8, severity: eScaled <= 3 ? "mild" : eScaled <= 5 ? "moderate" : "severe", completedBy: "patient" },
    { key: "F", label: "Radiographic Findings", raw: fRaw, rawMax: 13, scaled: Math.min(fScaled, 15), scaledMax: 15, severity: fScaled <= 5 ? "mild" : fScaled <= 10 ? "moderate" : "severe", completedBy: "clinician" },
    { key: "G", label: "Physical Examination", raw: gRaw, rawMax: 14, scaled: Math.min(gScaled, 10), scaledMax: 10, severity: gScaled <= 3 ? "mild" : gScaled <= 6 ? "moderate" : "severe", completedBy: "clinician" },
    { key: "H", label: "Medical Complexity", raw: hRaw, rawMax: 6, scaled: Math.min(hScaled, 5), scaledMax: 5, severity: hScaled <= 1.5 ? "mild" : hScaled <= 3 ? "moderate" : "severe", completedBy: "clinician" },
  ];

  const total = Math.round(sections.reduce((s, sec) => s + sec.scaled, 0) * 10) / 10;

  const overrideToUrgent = Object.values(d.overrideTriggers).some(Boolean);
  const band = overrideToUrgent ? 1 : total >= 75 ? 1 : total >= 55 ? 2 : total >= 35 ? 3 : 4;

  return { sections, total: Math.min(total, 100), band, overrideToUrgent };
}

// ─── Steps ──────────────────────────────────────────────────

const STEPS = [
  "Patient Information",
  "A: Pain & Symptoms",
  "B: Functional Impact",
  "C: Quality of Life",
  "D: Attempted Management",
  "E: Patient Readiness",
  "F: Radiographic Findings",
  "G: Physical Examination",
  "H: Medical Complexity",
  "Summary & Sign-off",
];

// ─── Step Components ────────────────────────────────────────

function StepHeader({ d, u }: { d: TriageFormData; u: (p: Partial<TriageFormData>) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Instructions</p>
          <p>Sections A-E are completed by the <strong>patient</strong>. Sections F-H are completed by the <strong>assessing clinician</strong>.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Patient Name" required>
          <BigInput value={d.patientName} onChange={e => u({ patientName: e.target.value })} placeholder="Full name" />
        </FormField>
        <FormField label="Date of Birth" required>
          <DatePicker value={d.dob} onChange={v => u({ dob: v })} placeholder="Select date of birth" />
        </FormField>
        <FormField label="Assessment Date">
          <DatePicker value={d.date} onChange={v => u({ date: v })} placeholder="Select assessment date" />
        </FormField>
        <FormField label="NHI / MRN">
          <BigInput value={d.nhiMrn} onChange={e => u({ nhiMrn: e.target.value })} placeholder="Patient ID" />
        </FormField>
      </div>

      <FormField label="Joint Assessed" required>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { v: "hip-l", l: "Hip (Left)" },
            { v: "hip-r", l: "Hip (Right)" },
            { v: "knee-l", l: "Knee (Left)" },
            { v: "knee-r", l: "Knee (Right)" },
          ].map(j => (
            <BigRadioOption key={j.v} value={j.v} label={j.l} selected={d.jointAssessed === j.v} onSelect={v => u({ jointAssessed: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="Referring Clinician">
        <BigInput value={d.referringClinician} onChange={e => u({ referringClinician: e.target.value })} placeholder="Dr. ..." />
      </FormField>
    </div>
  );
}

function StepA({ d, u }: { d: TriageFormData; u: (p: Partial<TriageFormData>) => void }) {
  const q = (key: "a1"|"a2"|"a3"|"a4"|"a5"|"a6", question: string, options: { v: string; l: string }[], source: string) => (
    <FormField label={question} source={source}>
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-2">
        {options.map(o => (
          <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d[key] === o.v} onSelect={v => u({ [key]: v })} />
        ))}
      </div>
    </FormField>
  );

  const severity5 = (labels: string[]) => labels.map((l, i) => ({ v: String(i), l }));

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground italic">Based on: Oxford Hip/Knee Score, WOMAC Pain subscale</p>

      {q("a1", "A1 — How would you describe the pain you usually have from your hip/knee?",
        severity5(["None (0)", "Very mild (1)", "Mild (2)", "Moderate (3)", "Severe (4)"]),
        "OHS Q1 / OKS Q1")}

      {q("a2", "A2 — How much pain do you experience when walking or bearing weight on the joint?",
        severity5(["None (0)", "Mild (1)", "Moderate (2)", "Severe (3)", "Extreme (4)"]),
        "WOMAC P2")}

      {q("a3", "A3 — How much pain or discomfort do you have when sitting, lying, or resting?",
        severity5(["None (0)", "Mild (1)", "Moderate (2)", "Severe (3)", "Extreme (4)"]),
        "WOMAC P4")}

      {q("a4", "A4 — How often have you been troubled by pain at night in bed (past month)?",
        severity5(["Not at all (0)", "1-2 nights (1)", "Some nights (2)", "Most nights (3)", "Every night (4)"]),
        "OHS Q12")}

      {q("a5", "A5 — Have you had sudden, severe pain (shooting, stabbing, spasms) from this joint?",
        severity5(["No days (0)", "1-2 days/mo (1)", "1-2 days/wk (2)", "Most days (3)", "Every day (4)"]),
        "OHS Q10")}

      {q("a6", "A6 — How severe is your joint stiffness after first waking in the morning?",
        severity5(["None (0)", "Mild (1)", "Moderate (2)", "Severe (3)", "Extreme (4)"]),
        "WOMAC S1")}
    </div>
  );
}

function StepB({ d, u }: { d: TriageFormData; u: (p: Partial<TriageFormData>) => void }) {
  const q = (key: "b1"|"b2"|"b3"|"b4"|"b5"|"b6", question: string, options: { v: string; l: string }[], source: string) => (
    <FormField label={question} source={source}>
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-2">
        {options.map(o => (
          <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d[key] === o.v} onSelect={v => u({ [key]: v })} />
        ))}
      </div>
    </FormField>
  );

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground italic">Based on: Oxford Hip/Knee Score, HOOS/KOOS ADL subscale</p>

      {q("b1", "B1 — How far are you able to walk before pain becomes severe?",
        [{ v: "0", l: "No limitation" }, { v: "1", l: ">30 min" }, { v: "2", l: "16-30 min" }, { v: "3", l: "6-15 min" }, { v: "4", l: "<5 min / housebound" }],
        "OHS Q6")}

      {q("b2", "B2 — How much difficulty going up and down stairs?",
        [{ v: "0", l: "None" }, { v: "1", l: "Slight" }, { v: "2", l: "Moderate" }, { v: "3", l: "Severe" }, { v: "4", l: "Unable" }],
        "OHS Q7")}

      {q("b3", "B3 — How much difficulty rising from a chair after sitting?",
        [{ v: "0", l: "None" }, { v: "1", l: "Slight" }, { v: "2", l: "Moderate" }, { v: "3", l: "Severe" }, { v: "4", l: "Unable" }],
        "OHS Q8")}

      {q("b4", "B4 — Difficulty washing, drying, or managing footwear?",
        [{ v: "0", l: "No trouble" }, { v: "1", l: "Little" }, { v: "2", l: "Moderate" }, { v: "3", l: "Extreme" }, { v: "4", l: "Impossible" }],
        "OHS Q2")}

      {q("b5", "B5 — Could you do shopping or community outings on your own?",
        [{ v: "0", l: "Yes, easily" }, { v: "1", l: "Little difficulty" }, { v: "2", l: "Moderate" }, { v: "3", l: "Great difficulty" }, { v: "4", l: "Impossible" }],
        "OHS Q5")}

      {q("b6", "B6 — How much has pain interfered with usual work / housework?",
        [{ v: "0", l: "Not at all" }, { v: "1", l: "A little" }, { v: "2", l: "Moderately" }, { v: "3", l: "Greatly" }, { v: "4", l: "Totally" }],
        "OHS Q11")}
    </div>
  );
}

function StepC({ d, u }: { d: TriageFormData; u: (p: Partial<TriageFormData>) => void }) {
  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground italic">Based on: EQ-5D-5L, Forgotten Joint Score (FJS-12)</p>

      <FormField label="C1 — On a scale of 0 to 10, how would you rate your overall health today?" source="EQ-5D VAS" hint="0 = worst imaginable, 10 = best imaginable">
        <div className="grid grid-cols-11 gap-1">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => u({ c1: String(i) })}
              className={cn(
                "py-3 rounded-lg border-2 text-center text-[15px] font-medium transition-all",
                d.c1 === String(i)
                  ? "border-primary bg-primary text-white"
                  : "border-border hover:border-primary/30 hover:bg-muted/30"
              )}
            >
              {i}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Scoring: 0-4 = 3 pts, 5-6 = 2 pts, 7-8 = 1 pt, 9-10 = 0 pts (higher = worse)</p>
      </FormField>

      <FormField label="C2 — How much has your joint problem affected your mood, worry, or emotional wellbeing?" source="EQ-5D Dim 5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[{ v: "0", l: "Not at all" }, { v: "1", l: "Slightly" }, { v: "2", l: "Moderately" }, { v: "3", l: "Severely" }].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.c2 === o.v} onSelect={v => u({ c2: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="C3 — How often are you aware of your problem joint during daily activities?" source="FJS-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {[{ v: "0", l: "Never" }, { v: "1", l: "Almost never" }, { v: "2", l: "Sometimes" }, { v: "3", l: "Most of the time" }, { v: "4", l: "Constantly" }].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.c3 === o.v} onSelect={v => u({ c3: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="C4 — How much have you had to change or give up activities you enjoy?" source="KOOS/HOOS QoL">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {[{ v: "0", l: "Not at all" }, { v: "1", l: "Mildly" }, { v: "2", l: "Moderately" }, { v: "3", l: "Severely" }, { v: "4", l: "Completely" }].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.c4 === o.v} onSelect={v => u({ c4: v })} />
          ))}
        </div>
      </FormField>
    </div>
  );
}

function StepD({ d, u }: { d: TriageFormData; u: (p: Partial<TriageFormData>) => void }) {
  const tx = d.d1Treatments;
  const setTx = (key: keyof typeof tx, val: boolean) => u({ d1Treatments: { ...tx, [key]: val } });

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground italic">Based on: HKPT Failed Conservative Treatment</p>

      <FormField label="D1 — Which treatments have you tried for this joint? (check all)" source="HKPT Item 7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <BigCheckbox checked={tx.physio} onCheckedChange={v => setTx("physio", v)} label="Physiotherapy" />
          <BigCheckbox checked={tx.bracing} onCheckedChange={v => setTx("bracing", v)} label="Bracing" />
          <BigCheckbox checked={tx.antiInflammatories} onCheckedChange={v => setTx("antiInflammatories", v)} label="Anti-inflammatories" />
          <BigCheckbox checked={tx.injections} onCheckedChange={v => setTx("injections", v)} label="Injections" />
          <BigCheckbox checked={tx.weightLoss} onCheckedChange={v => setTx("weightLoss", v)} label="Weight loss" />
          <BigCheckbox checked={tx.exercise} onCheckedChange={v => setTx("exercise", v)} label="Exercise program" />
          <BigCheckbox checked={tx.acupuncture} onCheckedChange={v => setTx("acupuncture", v)} label="Acupuncture" />
          <BigCheckbox checked={tx.otherTreatment} onCheckedChange={v => setTx("otherTreatment", v)} label="Other" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Scoring: 3+ tried = 0 pts, 1-2 tried = 2 pts, none = 4 pts</p>
      </FormField>

      <FormField label="D2 — How long have you been receiving non-surgical treatment?" source="HKPT">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {[{ v: "0", l: "Haven't tried" }, { v: "1", l: "< 3 months" }, { v: "2", l: "3-6 months" }, { v: "3", l: "6-12 months" }, { v: "4", l: "> 12 months" }].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.d2 === o.v} onSelect={v => u({ d2: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="D3 — Overall, how much benefit from treatments you've tried?" source="HKPT">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { v: "0", l: "Good relief — joint manageable" },
            { v: "1", l: "Some relief — still significant limitation" },
            { v: "2", l: "Minimal relief — partially helped" },
            { v: "4", l: "No relief — treatments not helpful" },
          ].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.d3 === o.v} onSelect={v => u({ d3: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="D4 — How often do you take pain medication for this joint?" source="WOMAC/HKPT">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {[{ v: "0", l: "Never" }, { v: "1", l: "Occasionally" }, { v: "2", l: "Several days/wk" }, { v: "3", l: "Daily" }, { v: "4", l: "Daily & inadequate" }].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.d4 === o.v} onSelect={v => u({ d4: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="D5 — List current medications for this joint">
        <Textarea value={d.d5Medications} onChange={e => u({ d5Medications: e.target.value })} className="text-[15px] min-h-[80px]" placeholder="e.g. Ibuprofen 400mg twice daily, Acetaminophen as needed..." />
      </FormField>
    </div>
  );
}

function StepE({ d, u }: { d: TriageFormData; u: (p: Partial<TriageFormData>) => void }) {
  const ex = d.e2Expectations;
  const setEx = (key: keyof typeof ex, val: boolean) => u({ e2Expectations: { ...ex, [key]: val } });

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground italic">Based on: KSS 2011 Patient Expectations, HKPT</p>

      <FormField label="Have you been told that joint replacement surgery may be an option?">
        <div className="grid grid-cols-3 gap-2">
          {["Yes", "No", "Uncertain"].map(v => (
            <BigRadioOption key={v} value={v.toLowerCase()} label={v} selected={d.e1Told === v.toLowerCase()} onSelect={v => u({ e1Told: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="E1 — How interested are you in proceeding with joint replacement?" source="KSS 2011">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {[
            { v: "0", l: "Not at all interested" },
            { v: "1", l: "Uncertain / need more info" },
            { v: "2", l: "Somewhat interested" },
            { v: "4", l: "Strongly interested" },
          ].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.e1Interest === o.v} onSelect={v => u({ e1Interest: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="E2 — What do you most hope to achieve from surgery? (pick up to 2)" source="KSS 2011" hint="Not scored — guides counselling">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <BigCheckbox checked={ex.painRelief} onCheckedChange={v => setEx("painRelief", v)} label="Pain relief" />
          <BigCheckbox checked={ex.walkBetter} onCheckedChange={v => setEx("walkBetter", v)} label="Walk better" />
          <BigCheckbox checked={ex.returnWork} onCheckedChange={v => setEx("returnWork", v)} label="Return to work" />
          <BigCheckbox checked={ex.sleepBetter} onCheckedChange={v => setEx("sleepBetter", v)} label="Sleep better" />
          <BigCheckbox checked={ex.returnSport} onCheckedChange={v => setEx("returnSport", v)} label="Return to sport" />
          <BigCheckbox checked={ex.independence} onCheckedChange={v => setEx("independence", v)} label="Independence" />
        </div>
      </FormField>

      <SectionHeading tag="E3">Social / Logistical Readiness</SectionHeading>

      <FormField label="Do you have a support person at home for recovery?">
        <div className="grid grid-cols-3 gap-2">
          {[{ v: "yes", l: "Yes, definitely" }, { v: "possibly", l: "Possibly" }, { v: "no", l: "No / uncertain" }].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.e3Support === o.v} onSelect={v => u({ e3Support: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="Is there any reason you couldn't proceed with surgery in the next 6 months?">
        <div className="grid grid-cols-3 gap-2">
          {[
            { v: "no-barriers", l: "No barriers" },
            { v: "minor", l: "Minor barriers" },
            { v: "significant", l: "Significant barriers" },
          ].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.e3Barriers === o.v} onSelect={v => u({ e3Barriers: v })} />
          ))}
        </div>
        {(d.e3Barriers === "minor" || d.e3Barriers === "significant") && (
          <BigInput value={d.e3BarrierDetails} onChange={e => u({ e3BarrierDetails: e.target.value })} placeholder="Describe barriers..." className="mt-3" />
        )}
      </FormField>
    </div>
  );
}

function StepF({ d, u }: { d: TriageFormData; u: (p: Partial<TriageFormData>) => void }) {
  const feat = d.f1Features;
  const setFeat = (key: keyof typeof feat, val: boolean) => u({ f1Features: { ...feat, [key]: val } });

  return (
    <div className="space-y-8">
      <ClinicianBadge />
      <p className="text-sm text-muted-foreground italic">Based on: Kellgren-Lawrence, HKPT Radiological Severity</p>

      <FormField label="F1 — Radiographic OA Severity (Kellgren-Lawrence)" source="KL Grade">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {[
            { v: "0", l: "Grade 0 — Normal", sub: "0 pts" },
            { v: "1", l: "Grade 1 — Doubtful", sub: "Micro-osteophytes · 1 pt" },
            { v: "2", l: "Grade 2 — Mild", sub: "Osteophytes, possible JSN · 2 pts" },
            { v: "3", l: "Grade 3 — Moderate", sub: "Definite JSN, sclerosis · 4 pts" },
            { v: "4", l: "Grade 4 — Severe", sub: "Bone-on-bone · 6 pts" },
          ].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} sublabel={o.sub} selected={d.f1Grade === o.v} onSelect={v => u({ f1Grade: v })} />
          ))}
        </div>
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="X-ray date">
          <DatePicker value={d.f1XrayDate} onChange={v => u({ f1XrayDate: v })} placeholder="Select X-ray date" />
        </FormField>
        <FormField label="Projection / view">
          <BigInput value={d.f1Projection} onChange={e => u({ f1Projection: e.target.value })} placeholder="e.g. AP pelvis, lateral knee" />
        </FormField>
      </div>

      <FormField label="Additional features">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <BigCheckbox checked={feat.cysts} onCheckedChange={v => setFeat("cysts", v)} label="Subchondral cysts" />
          <BigCheckbox checked={feat.malalignment} onCheckedChange={v => setFeat("malalignment", v)} label="Varus/valgus malalignment" />
          <BigCheckbox checked={feat.boneOnBone} onCheckedChange={v => setFeat("boneOnBone", v)} label="Bone-on-bone contact" />
          <BigCheckbox checked={feat.deformity} onCheckedChange={v => setFeat("deformity", v)} label="Deformity" />
        </div>
      </FormField>

      <Separator />

      <FormField label="F2 — Alignment / Sphericity" source="KSS / Tönnis">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Knee — Femoral-tibial axis</Label>
            <div className="space-y-2">
              {[{ v: "0", l: "<5° varus/valgus" }, { v: "2", l: "5-10° deviation" }, { v: "4", l: ">10° deviation" }].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.f2Knee === o.v} onSelect={v => u({ f2Knee: v })} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Hip — Femoral head sphericity</Label>
            <div className="space-y-2">
              {[{ v: "0", l: "Maintained" }, { v: "2", l: "Mild distortion" }, { v: "4", l: "Collapsed / AVN" }].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.f2Hip === o.v} onSelect={v => u({ f2Hip: v })} />
              ))}
            </div>
          </div>
        </div>
      </FormField>

      <FormField label="F3 — Contralateral Joint / Other Joints" source="HKPT Item 6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {[
            { v: "0", l: "No / isolated" },
            { v: "1", l: "Mild contralateral" },
            { v: "2", l: "Moderate bilateral" },
            { v: "3", l: "Severe bilateral" },
          ].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.f3Contralateral === o.v} onSelect={v => u({ f3Contralateral: v })} />
          ))}
        </div>
      </FormField>
    </div>
  );
}

function StepG({ d, u }: { d: TriageFormData; u: (p: Partial<TriageFormData>) => void }) {
  return (
    <div className="space-y-8">
      <ClinicianBadge />
      <p className="text-sm text-muted-foreground italic">Based on: Harris Hip Score, KSS 2011, Lequesne Index</p>

      <FormField label="G1 — Gait & Mobility Aid" source="HHS">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Gait pattern observed</Label>
            {[{ v: "0", l: "Normal" }, { v: "1", l: "Antalgic limp" }, { v: "2", l: "Severe limp / Trendelenburg" }].map(o => (
              <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.g1Gait === o.v} onSelect={v => u({ g1Gait: v })} />
            ))}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Mobility aid currently used</Label>
            {[{ v: "0", l: "None" }, { v: "1", l: "Walking stick" }, { v: "2", l: "Walker / frame / wheelchair" }].map(o => (
              <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.g1MobilityAid === o.v} onSelect={v => u({ g1MobilityAid: v })} />
            ))}
          </div>
        </div>
      </FormField>

      <Separator />

      <FormField label="G2 — Range of Motion" source="HHS Domain 4 / KSS">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Measurement</th>
                <th className="text-left py-2 px-2 font-medium">Degrees</th>
                <th className="text-left py-2 pl-2 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Flexion", degKey: "g2FlexionDeg" as const, sevKey: "g2FlexionSev" as const },
                { label: "Extension deficit", degKey: "g2ExtensionDeg" as const, sevKey: "g2ExtensionSev" as const },
                { label: "Abduction (hip) / Valgus stress (knee)", degKey: "g2AbductionDeg" as const, sevKey: "g2AbductionSev" as const },
                { label: "Internal rotation (hip) / Patellar tracking (knee)", degKey: "g2InternalRotDeg" as const, sevKey: "g2InternalRotSev" as const },
              ].map(row => (
                <tr key={row.label} className="border-b border-border/50">
                  <td className="py-3 pr-4 text-[13px]">{row.label}</td>
                  <td className="py-3 px-2">
                    <Input
                      type="number"
                      value={d[row.degKey]}
                      onChange={e => u({ [row.degKey]: e.target.value })}
                      className="h-10 w-20 text-sm"
                      placeholder="°"
                    />
                  </td>
                  <td className="py-3 pl-2">
                    <div className="flex gap-1">
                      {["Preserved", "Reduced", "Severely limited"].map((sev, idx) => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => u({ [row.sevKey]: sev })}
                          className={cn(
                            "px-2 py-1.5 rounded-md text-xs font-medium border transition-all",
                            d[row.sevKey] === sev
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:bg-muted/30"
                          )}
                        >{sev}</button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Label className="text-sm font-medium mb-2 block">Overall ROM impairment</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { v: "0", l: "Minimal / normal" },
              { v: "1", l: "Moderate limitation" },
              { v: "2", l: "Severe limitation" },
              { v: "3", l: "Fixed deformity / ankylosis" },
            ].map(o => (
              <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.g2Overall === o.v} onSelect={v => u({ g2Overall: v })} />
            ))}
          </div>
        </div>
      </FormField>

      <Separator />

      <FormField label="G3 — Joint Stability" source="KSS Objective">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Medial-lateral stability</Label>
            {[{ v: "0", l: "Stable" }, { v: "1", l: "<5° laxity" }, { v: "2", l: ">5° laxity" }].map(o => (
              <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.g3ML === o.v} onSelect={v => u({ g3ML: v })} />
            ))}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">AP / rotational stability</Label>
            {[{ v: "0", l: "Stable" }, { v: "1", l: "Mildly lax" }, { v: "2", l: "Unstable" }].map(o => (
              <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.g3AP === o.v} onSelect={v => u({ g3AP: v })} />
            ))}
          </div>
        </div>
      </FormField>

      <FormField label="G4 — Clinically significant fixed deformity?" source="HHS Domain 3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[{ v: "0", l: "None" }, { v: "1", l: "Mild" }, { v: "2", l: "Moderate" }, { v: "3", l: "Severe" }].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.g4Deformity === o.v} onSelect={v => u({ g4Deformity: v })} />
          ))}
        </div>
      </FormField>
    </div>
  );
}

function StepH({ d, u }: { d: TriageFormData; u: (p: Partial<TriageFormData>) => void }) {
  return (
    <div className="space-y-8">
      <ClinicianBadge />
      <p className="text-sm text-muted-foreground italic">Based on: ASA Classification, Charlson Comorbidity Index</p>

      <FormField label="H1 — ASA Physical Status Classification" source="ASA">
        <div className="space-y-2">
          {[
            { v: "0", l: "ASA I — Normal healthy patient", sub: "No systemic disease (0 pts)" },
            { v: "1", l: "ASA II — Mild systemic disease", sub: "Well-controlled, e.g. hypertension (1 pt)" },
            { v: "2", l: "ASA III — Severe systemic disease", sub: "Significant limitation, e.g. poorly controlled DM, COPD (2 pts)" },
            { v: "3", l: "ASA IV — Constant threat to life", sub: "Consider optimisation before listing (3 pts)" },
          ].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} sublabel={o.sub} selected={d.h1Asa === o.v} onSelect={v => u({ h1Asa: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="H2 — Comorbidities requiring pre-operative optimisation" source="Charlson">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[{ v: "0", l: "None" }, { v: "1", l: "1 condition" }, { v: "2", l: "2 conditions" }, { v: "3", l: "3+ conditions" }].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.h2Comorbidities === o.v} onSelect={v => u({ h2Comorbidities: v })} />
          ))}
        </div>
      </FormField>

      <Separator />

      <FormField label="H3 — Surgical Risk Flags" hint="Documented but not scored — flags for surgical complexity">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Previous surgery to this joint</Label>
            {[{ v: "none", l: "None" }, { v: "arthroscopy", l: "Arthroscopy" }, { v: "osteotomy", l: "Osteotomy" }, { v: "prior-replacement", l: "Prior replacement" }].map(o => (
              <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.h3PrevSurgery === o.v} onSelect={v => u({ h3PrevSurgery: v })} />
            ))}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Skin / wound considerations</Label>
            {[{ v: "none", l: "None" }, { v: "mild", l: "Mild (scars, varicosities)" }, { v: "significant", l: "Significant (ulcers, previous infection)" }].map(o => (
              <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.h3Skin === o.v} onSelect={v => u({ h3Skin: v })} />
            ))}
          </div>
        </div>
      </FormField>
    </div>
  );
}

function StepSummary({ d, u }: { d: TriageFormData; u: (p: Partial<TriageFormData>) => void }) {
  const triggers = d.overrideTriggers;
  const setTrigger = (key: string, val: boolean) => u({ overrideTriggers: { ...triggers, [key]: val } });
  const { sections, total, band, overrideToUrgent } = calculateScores(d);

  const bandInfo = [
    { label: "Urgent", color: "bg-red-100 text-red-800 border-red-300", range: "75-100" },
    { label: "Semi-urgent", color: "bg-amber-100 text-amber-800 border-amber-300", range: "55-74" },
    { label: "Scheduled", color: "bg-blue-100 text-blue-800 border-blue-300", range: "35-54" },
    { label: "Elective", color: "bg-green-100 text-green-800 border-green-300", range: "<35" },
  ];

  return (
    <div className="space-y-8">
      {/* Quick score preview */}
      <div className="bg-muted/30 rounded-xl border border-border/50 p-6">
        <h4 className="text-base font-semibold font-display mb-4">Score Preview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {sections.map(s => (
            <div key={s.key} className="text-center">
              <div className="text-xs text-muted-foreground mb-1">{s.key}. {s.label}</div>
              <div className="text-lg font-bold font-display text-foreground">{s.scaled.toFixed(1)}<span className="text-sm text-muted-foreground font-normal">/{s.scaledMax}</span></div>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">Composite Total</span>
            <div className="text-3xl font-bold font-display text-foreground">{total.toFixed(1)}<span className="text-lg text-muted-foreground font-normal">/100</span></div>
          </div>
          <div className={cn("px-4 py-2 rounded-lg border-2 text-sm font-bold", bandInfo[band - 1].color)}>
            Band {band} — {bandInfo[band - 1].label}
            {overrideToUrgent && <span className="block text-xs font-normal mt-0.5">Override applied</span>}
          </div>
        </div>
      </div>

      {/* Clinical Override Triggers */}
      <div>
        <SectionHeading>Clinical Override Triggers</SectionHeading>
        <p className="text-sm text-muted-foreground mb-3">Automatic upgrade to Priority Band 1 if any present:</p>
        <div className="space-y-2">
          {[
            { k: "boneOnBone", l: "Bone-on-bone contact (KL Grade 4) on plain X-ray" },
            { k: "rapidProgression", l: "Rapidly progressive joint destruction (>30% decline in 3 months)" },
            { k: "fixedDeformity", l: "Fixed deformity (flexion >30° or varus >10°)" },
            { k: "severeInstability", l: "Severe instability compromising safety (fall risk)" },
            { k: "avn", l: "AVN / osteonecrosis with collapse on imaging" },
            { k: "opioid", l: "On opioid analgesia with inadequate pain control despite optimisation" },
          ].map(t => (
            <BigCheckbox key={t.k} checked={!!triggers[t.k]} onCheckedChange={v => setTrigger(t.k, v)} label={t.l} />
          ))}
        </div>
      </div>

      <Separator />

      {/* Clinician sign-off */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Assessing Clinician" required>
          <BigInput value={d.clinicianName} onChange={e => u({ clinicianName: e.target.value })} placeholder="Dr. ..." />
        </FormField>
        <FormField label="Date" required>
          <DatePicker value={d.clinicianDate} onChange={v => u({ clinicianDate: v })} placeholder="Select date" />
        </FormField>
      </div>

      <FormField label="Clinical comments / override rationale">
        <Textarea value={d.clinicalComments} onChange={e => u({ clinicalComments: e.target.value })} className="text-[15px] min-h-[100px]" placeholder="Any additional clinical observations..." />
      </FormField>
    </div>
  );
}

// ─── Main exported component ────────────────────────────────

export default function TriageAssessmentForm({ onSubmit }: { onSubmit: (data: TriageFormData) => void }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<TriageFormData>(getInitialTriageData);

  const update = useCallback((partial: Partial<TriageFormData>) => {
    setFormData(prev => ({ ...prev, ...partial }));
  }, []);

  const totalSteps = STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const goNext = () => { if (step < totalSteps - 1) setStep(s => s + 1); window.scrollTo(0, 0); };
  const goPrev = () => { if (step > 0) setStep(s => s - 1); window.scrollTo(0, 0); };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="animate-enter">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Step {step + 1} of {totalSteps}</span>
          <span className="text-sm font-medium text-primary">{STEPS[step]}</span>
        </div>
        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-3 px-1">
          {STEPS.map((s, i) => (
            <button
              key={i} type="button"
              onClick={() => { setStep(i); window.scrollTo(0, 0); }}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                i === step ? "bg-primary scale-125" : i < step ? "bg-primary/40" : "bg-muted-foreground/20"
              )}
              title={s}
            />
          ))}
        </div>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-display">{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 0 && <StepHeader d={formData} u={update} />}
          {step === 1 && <StepA d={formData} u={update} />}
          {step === 2 && <StepB d={formData} u={update} />}
          {step === 3 && <StepC d={formData} u={update} />}
          {step === 4 && <StepD d={formData} u={update} />}
          {step === 5 && <StepE d={formData} u={update} />}
          {step === 6 && <StepF d={formData} u={update} />}
          {step === 7 && <StepG d={formData} u={update} />}
          {step === 8 && <StepH d={formData} u={update} />}
          {step === 9 && <StepSummary d={formData} u={update} />}
        </CardContent>
      </Card>

      {/* Nav buttons */}
      <div className="flex items-center justify-between mt-6 pb-8">
        <Button type="button" variant="outline" onClick={goPrev} disabled={step === 0} className="h-12 px-6 text-[15px] gap-2">
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>
        {step < totalSteps - 1 ? (
          <Button type="button" onClick={goNext} className="h-12 px-8 text-[15px] gap-2">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} className="h-12 px-8 text-[15px] gap-2 bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4" /> Submit Assessment
          </Button>
        )}
      </div>
    </div>
  );
}



