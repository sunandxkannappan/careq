import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowLeft, Clock } from "lucide-react";
import type { TriageFormData } from "./TriageAssessmentForm";
import { calculateScores, type SectionScore } from "./TriageAssessmentForm";

// ─── Score cell color (heatmap: green → lime → yellow → amber → red) ──

function scoreCellColor(pct: number): string {
  if (pct <= 0.25) return "bg-[#8BC34A]"; // green
  if (pct <= 0.45) return "bg-[#CDDC39]"; // lime-yellow
  if (pct <= 0.60) return "bg-[#FFC107]"; // amber
  if (pct <= 0.80) return "bg-[#FF9800]"; // orange
  return "bg-[#E53935]"; // red
}

function scoreCellText(pct: number): string {
  // white text on dark backgrounds, dark on light
  if (pct <= 0.45) return "text-gray-900";
  return "text-white";
}

// ─── Short factor labels (matching mockup) ──────────────────

const FACTOR_LABELS: Record<string, string> = {
  A: "Pain",
  B: "Function",
  C: "Quality of Life",
  D: "Management",
  E: "Readiness",
  F: "Radiology",
  G: "Physical Exam",
  H: "Medical Complexity",
};

// ─── Auto-generated rationale ───────────────────────────────

function generateRationale(section: SectionScore, data: TriageFormData): string {
  const num = (v: string) => { const n = parseInt(v); return isNaN(n) ? 0 : n; };
  const pct = section.scaledMax > 0 ? section.scaled / section.scaledMax : 0;

  switch (section.key) {
    case "A": {
      const parts: string[] = [];
      if (num(data.a1) >= 3) parts.push("severe usual pain");
      else if (num(data.a1) === 2) parts.push("mild-moderate usual pain");
      if (num(data.a2) >= 3) parts.push("severe pain on weight-bearing");
      if (num(data.a3) >= 3) parts.push("significant rest pain");
      if (num(data.a4) >= 3) parts.push("frequent night pain");
      if (num(data.a5) >= 3) parts.push("daily sharp/shooting episodes");
      if (num(data.a6) >= 3) parts.push("severe morning stiffness");
      if (parts.length === 0) return pct <= 0.3 ? "Minimal pain reported across all domains" : "Moderate pain reported";
      return `Pain is ${section.severity} due to ${parts.join(", ")}`;
    }
    case "B": {
      const parts: string[] = [];
      if (num(data.b1) >= 3) parts.push("severely limited walking capacity");
      if (num(data.b2) >= 3) parts.push("major difficulty with stairs");
      if (num(data.b3) >= 3) parts.push("difficulty rising from seated");
      if (num(data.b4) >= 3) parts.push("unable to manage personal care");
      if (num(data.b5) >= 3) parts.push("cannot do shopping/outings alone");
      if (num(data.b6) >= 3) parts.push("work significantly impacted");
      if (parts.length === 0) return pct <= 0.3 ? "Functional capacity largely preserved" : "Moderate functional limitation";
      return `Function is impacted by ${parts.join(", ")}`;
    }
    case "C": {
      const parts: string[] = [];
      if (num(data.c1) <= 4) parts.push("poor overall health rating");
      if (num(data.c2) >= 2) parts.push("significant mood/anxiety impact");
      if (num(data.c3) >= 3) parts.push("constantly aware of joint");
      if (num(data.c4) >= 3) parts.push("given up valued activities");
      if (parts.length === 0) return pct <= 0.3 ? "Quality of life minimally affected" : "Quality of life moderately affected";
      return `Quality of life reduced due to ${parts.join(", ")}`;
    }
    case "D": {
      const tried = Object.values(data.d1Treatments).filter(Boolean).length;
      const parts: string[] = [];
      if (tried === 0) parts.push("no conservative treatments tried");
      else if (tried <= 2) parts.push(`only ${tried} treatment modality tried`);
      else parts.push(`${tried} modalities tried`);
      if (num(data.d2) >= 3) parts.push("treated >6 months");
      if (num(data.d3) >= 2) parts.push(num(data.d3) === 4 ? "no relief from treatments" : "minimal relief");
      if (num(data.d4) >= 3) parts.push("daily pain medication use");
      return parts.join("; ");
    }
    case "E": {
      const parts: string[] = [];
      const interest = num(data.e1Interest);
      if (interest === 4) parts.push("strongly interested in surgery");
      else if (interest === 2) parts.push("somewhat interested");
      else if (interest <= 1) parts.push("uncertain about surgery");
      if (data.e3Barriers === "no-barriers") parts.push("no logistical barriers");
      else if (data.e3Barriers === "minor") parts.push("minor barriers");
      else if (data.e3Barriers === "significant") parts.push("significant barriers present");
      return parts.join("; ") || "Patient readiness not fully assessed";
    }
    case "F": {
      const parts: string[] = [];
      const grade = num(data.f1Grade);
      if (grade === 4) parts.push("KL Grade 4 (bone-on-bone)");
      else if (grade === 3) parts.push("KL Grade 3 (moderate OA)");
      else if (grade === 2) parts.push("KL Grade 2 (mild OA)");
      else parts.push(`KL Grade ${grade}`);
      if (Math.max(num(data.f2Knee), num(data.f2Hip)) >= 2) parts.push("significant malalignment/collapse");
      if (num(data.f3Contralateral) >= 2) parts.push("bilateral disease");
      return parts.join("; ");
    }
    case "G": {
      const parts: string[] = [];
      if (num(data.g1Gait) >= 1) parts.push("antalgic gait");
      if (num(data.g1MobilityAid) >= 1) parts.push("uses mobility aid");
      if (num(data.g2Overall) >= 2) parts.push("severe ROM limitation");
      else if (num(data.g2Overall) === 1) parts.push("moderate ROM limitation");
      if (num(data.g3ML) + num(data.g3AP) >= 2) parts.push("joint instability");
      if (num(data.g4Deformity) >= 2) parts.push("fixed deformity");
      if (parts.length === 0) return "Physical examination within normal limits";
      return `Exam findings: ${parts.join(", ")}`;
    }
    case "H": {
      const asa = num(data.h1Asa);
      const comorbidities = num(data.h2Comorbidities);
      const parts: string[] = [];
      parts.push(`ASA ${["I", "II", "III", "IV"][asa] || asa}`);
      if (comorbidities === 0) parts.push("no comorbidities requiring optimisation");
      else parts.push(`${comorbidities}${comorbidities === 3 ? "+" : ""} comorbidities`);
      return parts.join("; ");
    }
    default: return "";
  }
}

// ─── Band info ──────────────────────────────────────────────

const BAND_INFO = [
  { label: "Urgent", range: "75-100", mawt: "Up to 8 weeks", bgLight: "bg-red-50 border-red-300", textColor: "text-red-800", impression: "Severe, functionally incapacitated, failed all management" },
  { label: "Semi-urgent", range: "55-74", mawt: "9-16 weeks", bgLight: "bg-amber-50 border-amber-300", textColor: "text-amber-800", impression: "Moderate-severe, significant impairment, conservative exhausted" },
  { label: "Scheduled", range: "35-54", mawt: "17-24 weeks", bgLight: "bg-blue-50 border-blue-300", textColor: "text-blue-800", impression: "Moderate, ongoing conservative options or optimisation needed" },
  { label: "Elective", range: "<35", mawt: ">24 weeks", bgLight: "bg-green-50 border-green-300", textColor: "text-green-800", impression: "Mild, adequate conservative management, consider review" },
];

// ─── Main component ─────────────────────────────────────────

export default function TriageScoreView({ data, onBack }: { data: TriageFormData; onBack: () => void }) {
  const { sections, total, band, overrideToUrgent } = calculateScores(data);
  const bandIdx = band - 1;
  const bi = BAND_INFO[bandIdx];

  const overrideTriggerLabels = Object.entries(data.overrideTriggers)
    .filter(([, v]) => v)
    .map(([k]) => {
      const map: Record<string, string> = {
        boneOnBone: "Bone-on-bone (KL Grade 4)",
        rapidProgression: "Rapidly progressive destruction",
        fixedDeformity: "Fixed deformity (flexion >30° / varus >10°)",
        severeInstability: "Severe instability (fall risk)",
        avn: "AVN / osteonecrosis with collapse",
        opioid: "Opioid with inadequate control",
      };
      return map[k] || k;
    });

  const flags: string[] = [];
  if (data.a1 === "4" || data.a1 === "3") flags.push("Severe pain (A1 >= 3) — flag for expedited review");
  if (data.a4 === "4") flags.push("Every-night pain (A4 = 4) — clinical trigger");
  if (data.f1Grade === "4") flags.push("KL Grade 4 (bone-on-bone) — expedited listing trigger");
  if (parseInt(data.g4Deformity) >= 2) flags.push("Fixed deformity (G4 >= 2) — independent priority indicator");
  if ((parseInt(data.g3ML || "0") + parseInt(data.g3AP || "0")) >= 4) flags.push("Joint instability (G3 = 4) — independent priority indicator");
  if (data.h1Asa === "3") flags.push("ASA IV — pre-operative optimisation referral");
  if (data.h2Comorbidities === "3") flags.push("3+ comorbidities — pre-operative optimisation referral");

  const jointLabel = data.jointAssessed?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase()) || "—";

  return (
    <div className="animate-enter">
      {/* Back */}
      <Button variant="ghost" onClick={onBack} className="mb-6 -ml-2 text-muted-foreground hover:text-foreground gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to forms
      </Button>

      {/* ── Header block (plain text, matching mockup) ── */}
      <div className="mb-6">
        <h1 className="text-xl font-bold font-display tracking-tight text-foreground mb-3">
          Triage and Assessment Score
        </h1>
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-1 mb-1">
          <p className="text-[15px] font-bold text-foreground">
            {data.patientName || "Unknown Patient"}
          </p>
          <p className="text-[15px] text-foreground">
            <span className="font-semibold">Condition:</span> {jointLabel}
          </p>
        </div>
        <p className="text-sm text-foreground">
          <span className="font-semibold">Triage Date:</span> {data.date || "—"}
        </p>
        <p className="text-sm text-foreground">
          <span className="font-semibold">Triage completed by:</span> {data.referringClinician || "—"}
        </p>
        <p className="text-sm text-foreground">
          <span className="font-semibold">Assessment completed by:</span> {data.clinicianName || "—"}
        </p>
      </div>

      {/* Override alert */}
      {overrideToUrgent && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-800">Clinical Override Active — Upgraded to Band 1 (Urgent)</p>
            <ul className="text-xs text-red-700 mt-1 space-y-0.5">
              {overrideTriggerLabels.map(t => <li key={t}>- {t}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* ── Heatmap table ──────────────────────────────── */}
      <div className="border border-border rounded-xl overflow-hidden mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-center py-3 px-5 text-sm font-bold text-foreground w-[220px] border-r border-border bg-white">
                Factor
              </th>
              <th className="text-center py-3 px-4 text-sm font-bold text-foreground w-[110px] border-r border-border bg-white">
                Score
              </th>
              <th className="text-center py-3 px-5 text-sm font-bold text-foreground bg-gray-50">
                Rationale for Score
              </th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s, i) => {
              const pct = s.scaledMax > 0 ? s.scaled / s.scaledMax : 0;
              const rationale = generateRationale(s, data);
              return (
                <tr key={s.key} className="border-b border-border">
                  {/* Factor — light blue bg */}
                  <td className="py-4 px-5 text-center border-r border-border bg-sky-50">
                    <span className="text-[15px] font-medium text-foreground">
                      {FACTOR_LABELS[s.key] || s.label}
                    </span>
                  </td>

                  {/* Score — heatmap color */}
                  <td className="py-3 px-3 border-r border-border bg-white">
                    <div className={cn(
                      "rounded-md py-2 px-2 text-center font-bold text-[15px] font-display",
                      scoreCellColor(pct),
                      scoreCellText(pct),
                    )}>
                      {s.scaled.toFixed(1)}/{s.scaledMax}
                    </div>
                  </td>

                  {/* Rationale — gray bg */}
                  <td className={cn("py-4 px-5", i % 2 === 0 ? "bg-gray-50" : "bg-gray-100/50")}>
                    <p className="text-sm text-foreground text-center">{rationale}</p>
                  </td>
                </tr>
              );
            })}

            {/* Overall row */}
            <tr className="border-t-2 border-border">
              <td className="py-4 px-5 text-center border-r border-border border-2 bg-white">
                <span className="text-[15px] font-bold text-foreground">Overall</span>
              </td>
              <td className="py-3 px-3 border-r border-border bg-white">
                <div className={cn(
                  "rounded-md py-2 px-2 text-center font-bold text-[16px] font-display",
                  scoreCellColor(total / 100),
                  scoreCellText(total / 100),
                )}>
                  {total.toFixed(1)}/100
                </div>
              </td>
              <td className="py-4 px-5 bg-gray-50">
                <p className="text-sm font-medium text-foreground text-center">
                  Priority Band {band} — {bi.label}
                  <span className="text-muted-foreground font-normal ml-2">(MAWT: {bi.mawt})</span>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Clinical flags ─────────────────────────────── */}
      {flags.length > 0 && (
        <Card className="shadow-sm border-amber-200 bg-amber-50/50 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Clinical Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {flags.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* ── Priority band reference ────────────────────── */}
      <Card className="shadow-sm border-border mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Priority Band Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {BAND_INFO.map((b, i) => (
              <div key={i} className={cn(
                "rounded-xl border-2 p-4 transition-all",
                i === bandIdx ? cn(b.bgLight, "ring-2 ring-offset-2 ring-primary") : "border-border bg-white"
              )}>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Band {i + 1}</div>
                <div className={cn("text-lg font-bold font-display", i === bandIdx ? b.textColor : "text-foreground")}>{b.label}</div>
                <div className="text-xs text-muted-foreground mt-1">Score: {b.range}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <Clock className="w-3 h-3" /> MAWT: {b.mawt}
                </div>
                {i === bandIdx && <div className="text-xs font-semibold text-primary mt-2">Current Band</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clinical comments */}
      {data.clinicalComments && (
        <Card className="shadow-sm border-border mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Clinical Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground whitespace-pre-wrap">{data.clinicalComments}</p>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">
              Assessed by {data.clinicianName || "—"} on {data.clinicianDate || "—"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

