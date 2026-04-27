import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// ─── Shared UI helpers (mirrored from TriageAssessmentForm) ──

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

function BigInput({ ...props }: React.ComponentProps<typeof Input>) {
  return <Input {...props} className={cn("h-12 text-[15px] px-4", props.className)} />;
}

// ─── Types ──────────────────────────────────────────────────

export interface PreVisitFormData {
  // Header
  patientName: string;
  dob: string;
  date: string;
  jointAssessed: string;
  referringClinician: string;
  nhiMrn: string;

  // Section A – Pain & Symptoms
  a1: string; a2: string; a3: string; a4: string; a5: string; a6: string;

  // Section B – Functional Impact
  b1: string; b2: string; b3: string; b4: string; b5: string; b6: string;

  // Section C – Quality of Life
  c1: string; c2: string; c3: string; c4: string;

  // Section D – Attempted Management
  d1Treatments: { physio: boolean; bracing: boolean; antiInflammatories: boolean; injections: boolean; weightLoss: boolean; exercise: boolean; acupuncture: boolean; otherTreatment: boolean };
  d2: string;
  d3: string;
  d4: string;
  d5Medications: string;
  appointmentDate: string;
  appointmentType: "virtual" | "in-person" | "";
  canAttend: "yes" | "no" | "";
  needsInterpreter: "yes" | "no" | "";
  interpreterLanguage: string;
  supportPerson: "yes" | "no" | "";
  jointToday: "left-hip" | "right-hip" | "left-knee" | "right-knee" | "";
  symptomChange: "significantly-improved" | "slightly-improved" | "no-change" | "slightly-worse" | "significantly-worse" | "";
  painRest: string;
  painActivity: string;
  symptomIncreasePain: boolean;
  symptomSwelling: boolean;
  symptomGivingWay: boolean;
  symptomFall: boolean;
  symptomWalkingDifficulty: boolean;
  symptomNeuro: boolean;
  symptomFever: boolean;
  symptomNone: boolean;
  symptomDescription: string;
  medsChanged: "yes" | "no" | "";
  medsChangedDetails: string;
  painMedicationType: "none" | "otc" | "prescription-non-opioid" | "prescription-opioid" | "";
  opioidAdequate: "yes" | "partial" | "no" | "";
  newTreatments: "yes" | "no" | "";
  newTreatmentsDetails: string;
  functionalChange: "better" | "same" | "worse" | "";
  walkingAbility: "no-difficulty" | "with-difficulty" | "housebound" | "";
  fallsInPastMonth: "yes" | "no" | "";
  fallsCount: string;
  mainIssue: string;
  questionsForTeam: string;
  otherCareTeamNotes: string;
  techChecked: "yes" | "no" | "na" | "";
  deviceType: "smartphone" | "tablet" | "laptop" | "other" | "";
  deviceTypeOther: string;
  privateSpace: "yes" | "no" | "";
}

function getInitialData(): PreVisitFormData {
  return {
    patientName: "", dob: "", date: new Date().toISOString().split("T")[0],
    jointAssessed: "", referringClinician: "", nhiMrn: "",
    a1: "", a2: "", a3: "", a4: "", a5: "", a6: "",
    b1: "", b2: "", b3: "", b4: "", b5: "", b6: "",
    c1: "", c2: "", c3: "", c4: "",
    d1Treatments: { physio: false, bracing: false, antiInflammatories: false, injections: false, weightLoss: false, exercise: false, acupuncture: false, otherTreatment: false },
    d2: "", d3: "", d4: "", d5Medications: "",
    appointmentDate: new Date().toISOString().split("T")[0],
    appointmentType: "",
    canAttend: "",
    needsInterpreter: "",
    interpreterLanguage: "",
    supportPerson: "",
    jointToday: "",
    symptomChange: "",
    painRest: "",
    painActivity: "",
    symptomIncreasePain: false,
    symptomSwelling: false,
    symptomGivingWay: false,
    symptomFall: false,
    symptomWalkingDifficulty: false,
    symptomNeuro: false,
    symptomFever: false,
    symptomNone: false,
    symptomDescription: "",
    medsChanged: "",
    medsChangedDetails: "",
    painMedicationType: "",
    opioidAdequate: "",
    newTreatments: "",
    newTreatmentsDetails: "",
    functionalChange: "",
    walkingAbility: "",
    fallsInPastMonth: "",
    fallsCount: "",
    mainIssue: "",
    questionsForTeam: "",
    otherCareTeamNotes: "",
    techChecked: "",
    deviceType: "",
    deviceTypeOther: "",
    privateSpace: "",
  };
}

// ─── Steps ──────────────────────────────────────────────────

const STEPS = [
  "Patient Information",
  "A: Pain & Symptoms",
  "B: Functional Impact",
  "C: Quality of Life",
  "D: Attempted Management",
  "Part 5 — Questions & Agenda for Today's Appointment",
];

// ─── Step Components ────────────────────────────────────────

function StepHeader({ d, u }: { d: PreVisitFormData; u: (p: Partial<PreVisitFormData>) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Pre-Visit Patient Questionnaire</p>
          <p>Please complete sections A through D before your upcoming appointment. This helps your care team prepare for your visit.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Patient Name">
          <BigInput value={d.patientName} onChange={e => u({ patientName: e.target.value })} placeholder="Full name" />
        </FormField>
        <FormField label="Date of Birth">
          <DatePicker value={d.dob} onChange={v => u({ dob: v })} placeholder="Select date of birth" />
        </FormField>
        <FormField label="Assessment Date">
          <DatePicker value={d.date} onChange={v => u({ date: v })} placeholder="Select assessment date" />
        </FormField>
        <FormField label="NHI / MRN">
          <BigInput value={d.nhiMrn} onChange={e => u({ nhiMrn: e.target.value })} placeholder="Patient ID" />
        </FormField>
      </div>

      <FormField label="Joint Assessed">
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

function StepA({ d, u }: { d: PreVisitFormData; u: (p: Partial<PreVisitFormData>) => void }) {
  const q = (key: "a1"|"a2"|"a3"|"a4"|"a5"|"a6", question: string, options: { v: string; l: string }[], source: string) => (
    <FormField label={question} source={source}>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
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

function StepB({ d, u }: { d: PreVisitFormData; u: (p: Partial<PreVisitFormData>) => void }) {
  const q = (key: "b1"|"b2"|"b3"|"b4"|"b5"|"b6", question: string, options: { v: string; l: string }[], source: string) => (
    <FormField label={question} source={source}>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
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

function StepC({ d, u }: { d: PreVisitFormData; u: (p: Partial<PreVisitFormData>) => void }) {
  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground italic">Based on: EQ-5D-5L, Forgotten Joint Score (FJS-12)</p>

      <FormField label="C1 — On a scale of 0 to 10, how would you rate your overall health today?" source="EQ-5D VAS" hint="0 = worst imaginable, 10 = best imaginable">
        <div className="grid grid-cols-6 sm:grid-cols-11 gap-1">
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
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {[{ v: "0", l: "Never" }, { v: "1", l: "Almost never" }, { v: "2", l: "Sometimes" }, { v: "3", l: "Most of the time" }, { v: "4", l: "Constantly" }].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.c3 === o.v} onSelect={v => u({ c3: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="C4 — How much have you had to change or give up activities you enjoy?" source="KOOS/HOOS QoL">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {[{ v: "0", l: "Not at all" }, { v: "1", l: "Mildly" }, { v: "2", l: "Moderately" }, { v: "3", l: "Severely" }, { v: "4", l: "Completely" }].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.c4 === o.v} onSelect={v => u({ c4: v })} />
          ))}
        </div>
      </FormField>
    </div>
  );
}

function StepD({ d, u }: { d: PreVisitFormData; u: (p: Partial<PreVisitFormData>) => void }) {
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
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
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
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {[{ v: "0", l: "Never" }, { v: "1", l: "Occasionally" }, { v: "2", l: "Several days/wk" }, { v: "3", l: "Daily" }, { v: "4", l: "Daily & inadequate" }].map(o => (
            <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.d4 === o.v} onSelect={v => u({ d4: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="D5 — List current medications for this joint">
        <Textarea value={d.d5Medications} onChange={e => u({ d5Medications: e.target.value })} className="text-[15px] min-h-[80px]" placeholder="e.g. Ibuprofen 400mg twice daily, Acetaminophen as needed..." />
      </FormField>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-medium">Next step:</p>
        <p className="mt-1">Continue to the final page for Part 5 questions and agenda, then Part 6 technical check-in for virtual appointments.</p>
      </div>
    </div>
  );
}

function StepInstrument2({ d, u }: { d: PreVisitFormData; u: (p: Partial<PreVisitFormData>) => void }) {
  const setField = <K extends keyof PreVisitFormData>(field: K, value: PreVisitFormData[K]) => {
    u({ [field]: value } as Pick<PreVisitFormData, K>);
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground italic">Completed by the patient 24–48 hours before each scheduled appointment.</p>

      <div className="space-y-6 rounded-xl border border-border bg-white p-5 shadow-sm">
        <div className="space-y-3">
          <h3 className="text-base font-semibold font-display tracking-tight">Part 1 — Appointment Confirmation</h3>
          <FormField label="Upcoming appointment date">
            <DatePicker value={d.appointmentDate} onChange={v => u({ appointmentDate: v })} placeholder="Select appointment date" />
          </FormField>

          <FormField label="Appointment type">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { v: "virtual", l: "Virtual" },
                { v: "in-person", l: "In-person" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.appointmentType === o.v} onSelect={v => setField("appointmentType", v as PreVisitFormData["appointmentType"]) } />
              ))}
            </div>
          </FormField>

          <FormField label="Do you confirm you are able to attend this appointment?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { v: "yes", l: "Yes" },
                { v: "no", l: "No — I need to reschedule" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.canAttend === o.v} onSelect={v => setField("canAttend", v as PreVisitFormData["canAttend"]) } />
              ))}
            </div>
          </FormField>

          <FormField label="Do you require an interpreter for this appointment?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { v: "no", l: "No" },
                { v: "yes", l: "Yes — language" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.needsInterpreter === o.v} onSelect={v => setField("needsInterpreter", v as PreVisitFormData["needsInterpreter"]) } />
              ))}
            </div>
            {d.needsInterpreter === "yes" && (
              <BigInput value={d.interpreterLanguage} onChange={e => u({ interpreterLanguage: e.target.value })} placeholder="Language" />
            )}
          </FormField>

          <FormField label="Will a caregiver or support person be joining you?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { v: "no", l: "No" },
                { v: "yes", l: "Yes" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.supportPerson === o.v} onSelect={v => setField("supportPerson", v as PreVisitFormData["supportPerson"]) } />
              ))}
            </div>
          </FormField>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold font-display tracking-tight">Part 2 — Symptom Update Since Last Visit</h3>
          <FormField label="Joint being assessed today">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { v: "left-hip", l: "Left Hip" },
                { v: "right-hip", l: "Right Hip" },
                { v: "left-knee", l: "Left Knee" },
                { v: "right-knee", l: "Right Knee" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.jointToday === o.v} onSelect={v => setField("jointToday", v as PreVisitFormData["jointToday"]) } />
              ))}
            </div>
          </FormField>

          <FormField label="Since your last appointment, how have your symptoms changed overall?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { v: "significantly-improved", l: "Significantly improved" },
                { v: "slightly-improved", l: "Slightly improved" },
                { v: "no-change", l: "No change" },
                { v: "slightly-worse", l: "Slightly worse" },
                { v: "significantly-worse", l: "Significantly worse" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.symptomChange === o.v} onSelect={v => setField("symptomChange", v as PreVisitFormData["symptomChange"]) } />
              ))}
            </div>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Current pain level at rest (0 = no pain, 10 = worst imaginable)">
              <div className="grid grid-cols-6 sm:grid-cols-11 gap-1">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => u({ painRest: String(i) })}
                    className={cn(
                      "py-2 rounded-lg border-2 text-center text-[13px] font-medium transition-all",
                      d.painRest === String(i) ? "border-primary bg-primary text-white" : "border-border hover:border-primary/30 hover:bg-muted/30"
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </FormField>
            <FormField label="Current pain level with activity (0 = no pain, 10 = worst imaginable)">
              <div className="grid grid-cols-6 sm:grid-cols-11 gap-1">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => u({ painActivity: String(i) })}
                    className={cn(
                      "py-2 rounded-lg border-2 text-center text-[13px] font-medium transition-all",
                      d.painActivity === String(i) ? "border-primary bg-primary text-white" : "border-border hover:border-primary/30 hover:bg-muted/30"
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </FormField>
          </div>

          <FormField label="Have you had any of the following since your last appointment? (tick all that apply)">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <BigCheckbox checked={d.symptomIncreasePain} onCheckedChange={v => u({ symptomIncreasePain: v })} label="Sudden significant increase in pain" />
              <BigCheckbox checked={d.symptomSwelling} onCheckedChange={v => u({ symptomSwelling: v })} label="New swelling or redness in the joint" />
              <BigCheckbox checked={d.symptomGivingWay} onCheckedChange={v => u({ symptomGivingWay: v })} label="Joint giving way or locking" />
              <BigCheckbox checked={d.symptomFall} onCheckedChange={v => u({ symptomFall: v })} label="Fall related to the joint" />
              <BigCheckbox checked={d.symptomWalkingDifficulty} onCheckedChange={v => u({ symptomWalkingDifficulty: v })} label="New difficulty walking or bearing weight" />
              <BigCheckbox checked={d.symptomNeuro} onCheckedChange={v => u({ symptomNeuro: v })} label="New neurological symptoms (numbness, tingling, weakness)" />
              <BigCheckbox checked={d.symptomFever} onCheckedChange={v => u({ symptomFever: v })} label="Fever or chills" />
              <BigCheckbox checked={d.symptomNone} onCheckedChange={v => u({ symptomNone: v })} label="None of the above" />
            </div>
          </FormField>

          <FormField label="If you ticked any of the above, please describe briefly:">
            <Textarea value={d.symptomDescription} onChange={e => u({ symptomDescription: e.target.value })} className="text-[15px] min-h-[100px]" placeholder="Describe any changes or concerns..." />
          </FormField>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold font-display tracking-tight">Part 3 — Medications & Management Update</h3>

          <FormField label="Have there been any changes to your medications since your last appointment?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { v: "no", l: "No" },
                { v: "yes", l: "Yes — please describe" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.medsChanged === o.v} onSelect={v => setField("medsChanged", v as PreVisitFormData["medsChanged"]) } />
              ))}
            </div>
            {d.medsChanged === "yes" && (
              <BigInput value={d.medsChangedDetails} onChange={e => u({ medsChangedDetails: e.target.value })} placeholder="Describe medication changes" />
            )}
          </FormField>

          <FormField label="Are you currently taking pain medication for this joint?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { v: "none", l: "No" },
                { v: "otc", l: "Over-the-counter" },
                { v: "prescription-non-opioid", l: "Prescription (non-opioid)" },
                { v: "prescription-opioid", l: "Prescription opioid" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.painMedicationType === o.v} onSelect={v => setField("painMedicationType", v as PreVisitFormData["painMedicationType"]) } />
              ))}
            </div>
          </FormField>

          {d.painMedicationType === "prescription-opioid" && (
            <FormField label="If taking opioid medication, is it providing adequate pain control?">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { v: "yes", l: "Yes" },
                  { v: "partial", l: "Partial relief" },
                  { v: "no", l: "No — inadequate despite current dose" },
                ].map(o => (
                  <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.opioidAdequate === o.v} onSelect={v => setField("opioidAdequate", v as PreVisitFormData["opioidAdequate"]) } />
                ))}
              </div>
            </FormField>
          )}

          <FormField label="Have you started any new treatments since your last visit? (e.g. physiotherapy, injection, new medication)">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { v: "no", l: "No" },
                { v: "yes", l: "Yes — please describe" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.newTreatments === o.v} onSelect={v => setField("newTreatments", v as PreVisitFormData["newTreatments"]) } />
              ))}
            </div>
            {d.newTreatments === "yes" && (
              <BigInput value={d.newTreatmentsDetails} onChange={e => u({ newTreatmentsDetails: e.target.value })} placeholder="Describe new treatments" />
            )}
          </FormField>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold font-display tracking-tight">Part 4 — Functional Status Update</h3>

          <FormField label="Compared to your last appointment, your ability to perform daily activities is:">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { v: "better", l: "Better" },
                { v: "same", l: "About the same" },
                { v: "worse", l: "Worse" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.functionalChange === o.v} onSelect={v => setField("functionalChange", v as PreVisitFormData["functionalChange"]) } />
              ))}
            </div>
          </FormField>

          <FormField label="Are you currently able to walk outside your home?">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { v: "no-difficulty", l: "Yes, without difficulty" },
                { v: "with-difficulty", l: "Yes, with difficulty" },
                { v: "housebound", l: "No, housebound" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.walkingAbility === o.v} onSelect={v => setField("walkingAbility", v as PreVisitFormData["walkingAbility"]) } />
              ))}
            </div>
          </FormField>

          <FormField label="Have you had any falls in the past month related to this joint?">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { v: "no", l: "No" },
                { v: "yes", l: "Yes — number of falls" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.fallsInPastMonth === o.v} onSelect={v => setField("fallsInPastMonth", v as PreVisitFormData["fallsInPastMonth"]) } />
              ))}
            </div>
            {d.fallsInPastMonth === "yes" && (
              <BigInput value={d.fallsCount} onChange={e => u({ fallsCount: e.target.value })} placeholder="Number of falls" />
            )}
          </FormField>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold font-display tracking-tight">Part 5 — Questions & Agenda for Today's Appointment</h3>

          <FormField label="What is the main thing you would like to address in today's appointment?">
            <Textarea value={d.mainIssue} onChange={e => u({ mainIssue: e.target.value })} className="text-[15px] min-h-[100px]" placeholder="Write your main concern..." />
          </FormField>

          <FormField label="Do you have specific questions for your care team today?">
            <Textarea value={d.questionsForTeam} onChange={e => u({ questionsForTeam: e.target.value })} className="text-[15px] min-h-[100px]" placeholder="List questions for your provider..." />
          </FormField>

          <FormField label="Is there anything else you would like your care team to know before the appointment?">
            <Textarea value={d.otherCareTeamNotes} onChange={e => u({ otherCareTeamNotes: e.target.value })} className="text-[15px] min-h-[100px]" placeholder="Additional information for the care team..." />
          </FormField>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold font-display tracking-tight">Part 6 — Technical Check-In (Virtual Appointments Only)</h3>

          <FormField label="Have you tested your device, camera, and microphone for this appointment?">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { v: "yes", l: "Yes, everything is working" },
                { v: "no", l: "No, I need help" },
                { v: "na", l: "Not applicable (in-person)" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.techChecked === o.v} onSelect={v => setField("techChecked", v as PreVisitFormData["techChecked"]) } />
              ))}
            </div>
          </FormField>

          <FormField label="What device will you be using?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { v: "smartphone", l: "Smartphone" },
                { v: "tablet", l: "Tablet" },
                { v: "laptop", l: "Laptop / Computer" },
                { v: "other", l: "Other" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.deviceType === o.v} onSelect={v => setField("deviceType", v as PreVisitFormData["deviceType"]) } />
              ))}
            </div>
            {d.deviceType === "other" && (
              <BigInput value={d.deviceTypeOther} onChange={e => u({ deviceTypeOther: e.target.value })} placeholder="Other device" />
            )}
          </FormField>

          <FormField label="Do you have a private, quiet space available for this appointment?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { v: "yes", l: "Yes" },
                { v: "no", l: "No — I may have limited privacy" },
              ].map(o => (
                <BigRadioOption key={o.v} value={o.v} label={o.l} selected={d.privateSpace === o.v} onSelect={v => setField("privateSpace", v as PreVisitFormData["privateSpace"]) } />
              ))}
            </div>
          </FormField>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────

export default function PreVisitForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<PreVisitFormData>(getInitialData);
  const [submitted, setSubmitted] = useState(false);

  const update = useCallback((partial: Partial<PreVisitFormData>) => {
    setFormData(prev => ({ ...prev, ...partial }));
  }, []);

  const totalSteps = STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const goNext = () => { if (step < totalSteps - 1) setStep(s => s + 1); window.scrollTo(0, 0); };
  const goPrev = () => { if (step > 0) setStep(s => s - 1); window.scrollTo(0, 0); };

  const handleSubmit = () => {
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <div className="animate-enter">
        <Card className="shadow-sm border-border max-w-2xl">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold font-display tracking-tight">Pre-Visit Form Submitted</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Thank you, {formData.patientName || "patient"}. Your responses have been recorded and will be reviewed by your care team before your appointment.
            </p>
            <Button variant="outline" onClick={() => { setSubmitted(false); setStep(0); }} className="mt-4">
              Review Responses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          {step === 5 && <StepInstrument2 d={formData} u={update} />}
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
            <Check className="w-4 h-4" /> Submit Pre-Visit Form
          </Button>
        )}
      </div>
    </div>
  );
}



