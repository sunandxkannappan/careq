import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ClipboardCheck } from "lucide-react";
import jsPDF from "jspdf";

interface ActionStep {
  action: string;
  responsible: string;
  timing: string;
  priority: "routine" | "important";
}

interface Medication {
  name: string;
  dose: string;
  duration: string;
  action: "New" | "Continue" | "Modify" | "Stop";
  notes: string;
}

const CARE_PLAN_STEPS: ActionStep[] = [
  {
    action: "Continue prescribed physiotherapy — focus on quadriceps strengthening and range-of-motion exercises as directed",
    responsible: "Patient",
    timing: "Ongoing",
    priority: "routine",
  },
  {
    action: "Review and optimise analgesic regimen — consider step-up to topical NSAID if current medications insufficient",
    responsible: "GP",
    timing: "Within 2 weeks",
    priority: "important",
  },
  {
    action: "Arrange / attend pre-operative optimisation appointment (diabetes management, BMI reduction plan)",
    responsible: "Patient + GP",
    timing: "Before next visit",
    priority: "important",
  },
  {
    action: "Repeat weight-bearing X-ray of right knee — AP and lateral views — if not done within 12 months",
    responsible: "GP",
    timing: "Before next visit",
    priority: "routine",
  },
  {
    action: "Provide patient education materials on total knee arthroplasty and what to expect pre- and post-operatively",
    responsible: "Care Coordinator",
    timing: "This visit",
    priority: "routine",
  },
  {
    action: "Assess home safety and post-operative support plan — consider OT referral if concerns identified",
    responsible: "Nurse / OT",
    timing: "Within 4 weeks",
    priority: "routine",
  },
  {
    action: "Next CareQ virtual check-in scheduled — reassess risk score, treatment adherence, and waitlist position",
    responsible: "Care Coordinator",
    timing: "In 3-4 months",
    priority: "routine",
  },
];

const SAMPLE_MEDICATIONS: Medication[] = [
  { name: "Acetaminophen", dose: "500 mg, up to 4x daily as needed", duration: "Ongoing", action: "Continue", notes: "First-line analgesic" },
  { name: "Diclofenac gel 1%", dose: "Apply to right knee 3-4x daily", duration: "4 weeks trial", action: "New", notes: "Topical NSAID — monitor GI/renal" },
  { name: "Physiotherapy referral", dose: "2x per week, structured programme", duration: "8 weeks", action: "New", notes: "Quadriceps & ROM focus" },
];

// ── PDF drawing helpers ──────────────────────────────────────────────

const TEAL = [15, 118, 110] as const;
const PURPLE = [88, 55, 140] as const;
const DARK = [30, 30, 30] as const;
const BODY = [55, 55, 55] as const;
const META = [120, 120, 120] as const;
const WHITE = [255, 255, 255] as const;
const RED = [200, 50, 50] as const;
const AMBER = [180, 100, 20] as const;
const LIGHT_BG = [247, 248, 250] as const;
const BORDER = [215, 220, 228] as const;

function generateCarePlanPDF() {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const m = 18; // margin
  const cw = pw - m * 2;

  let yPos = 0;

  // ── helpers ──

  const rgb = (c: readonly [number, number, number]) => c;

  const footer = () => {
    doc.setDrawColor(...rgb(BORDER));
    doc.setLineWidth(0.3);
    doc.line(m, ph - 14, pw - m, ph - 14);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 160, 160);
    doc.text("CareQ Health Technology Inc.", m, ph - 9);
    doc.text("POST-VISIT CARE PLAN", pw / 2, ph - 9, { align: "center" });
  };

  const pageBreak = (need: number) => {
    if (yPos + need > ph - 22) {
      footer();
      doc.addPage();
      yPos = 18;
    }
  };

  // ── Page 1: header ──

  // Top teal strip
  doc.setFillColor(...rgb(TEAL));
  doc.rect(0, 0, pw, 6, "F");

  // Brand row
  yPos = 16;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...rgb(TEAL));
  doc.text("CareQ", m, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(130, 130, 130);
  doc.text("  |  Post-Visit Care Plan", m + 17, yPos);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 60, 60);
  doc.text("PRIVATE & CONFIDENTIAL", pw - m, yPos, { align: "right" });

  doc.setDrawColor(...rgb(TEAL));
  doc.setLineWidth(0.4);
  doc.line(m, yPos + 3, pw - m, yPos + 3);
  yPos += 12;

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...rgb(DARK));
  doc.text("Post-Visit Care Plan", m, yPos);
  yPos += 9;

  // Patient info block
  doc.setFillColor(...rgb(LIGHT_BG));
  doc.roundedRect(m, yPos, cw, 18, 2, 2, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...rgb(DARK));
  doc.text("Patient:", m + 5, yPos + 7);
  doc.setFont("helvetica", "normal");
  doc.text("Margaret Chen", m + 24, yPos + 7);
  doc.setFont("helvetica", "bold");
  doc.text("DOB:", m + 70, yPos + 7);
  doc.setFont("helvetica", "normal");
  doc.text("1958-04-12", m + 82, yPos + 7);
  doc.setFont("helvetica", "bold");
  doc.text("Condition:", m + 5, yPos + 14);
  doc.setFont("helvetica", "normal");
  doc.text("Right knee osteoarthritis (KL Grade III)", m + 30, yPos + 14);
  doc.setFont("helvetica", "bold");
  doc.text("Date:", m + 120, yPos + 14);
  doc.setFont("helvetica", "normal");
  doc.text("March 10, 2026", m + 133, yPos + 14);
  yPos += 24;

  // ── Action Steps section ──

  // Section header bar
  doc.setFillColor(...rgb(TEAL));
  doc.roundedRect(m, yPos, cw, 9, 1.5, 1.5, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...rgb(WHITE));
  doc.text("Action Steps", m + 5, yPos + 6.5);
  yPos += 14;

  // Steps
  CARE_PLAN_STEPS.forEach((step, idx) => {
    pageBreak(28);
    const isImportant = step.priority === "important";

    // Step card background
    const cardH = 20;
    if (isImportant) {
      doc.setFillColor(255, 251, 240);
    } else {
      doc.setFillColor(250, 252, 255);
    }
    doc.roundedRect(m, yPos - 3, cw, cardH, 1.5, 1.5, "F");

    // Left accent bar
    if (isImportant) {
      doc.setFillColor(...rgb(AMBER));
    } else {
      doc.setFillColor(...rgb(TEAL));
    }
    doc.roundedRect(m, yPos - 3, 3, cardH, 1.5, 1.5, "F");

    // Step number circle
    const circleX = m + 10;
    const circleY = yPos + 4;
    if (isImportant) {
      doc.setFillColor(...rgb(AMBER));
    } else {
      doc.setFillColor(...rgb(TEAL));
    }
    doc.circle(circleX, circleY, 4, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...rgb(WHITE));
    doc.text(`${idx + 1}`, circleX - (idx + 1 >= 10 ? 2.2 : 1.3), circleY + 2.8);

    // Action text
    const textX = m + 18;
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...rgb(BODY));
    const maxTextW = cw - 20;
    const lines = doc.splitTextToSize(step.action, maxTextW);
    doc.text(lines[0], textX, yPos + 2);
    if (lines.length > 1) {
      doc.text(lines[1], textX, yPos + 6.5);
    }

    // Meta: responsible + timing + priority badge
    const metaY = yPos + (lines.length > 1 ? 11.5 : 8);
    doc.setFontSize(7.5);
    doc.setTextColor(...rgb(META));
    doc.setFont("helvetica", "normal");
    doc.text(`By: ${step.responsible}`, textX, metaY);
    doc.text(`When: ${step.timing}`, textX + 45, metaY);

    if (isImportant) {
      const badgeX = textX + 90;
      doc.setFillColor(...rgb(RED));
      doc.roundedRect(badgeX, metaY - 3, 20, 4.5, 2, 2, "F");
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...rgb(WHITE));
      doc.text("IMPORTANT", badgeX + 2, metaY);
    }

    yPos += cardH + 3;
  });

  // ── Medications section ──

  yPos += 4;
  pageBreak(60);

  doc.setFillColor(...rgb(PURPLE));
  doc.roundedRect(m, yPos, cw, 9, 1.5, 1.5, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...rgb(WHITE));
  doc.text("Medication & Treatment Recommendations", m + 5, yPos + 6.5);
  yPos += 13;

  doc.setFontSize(8);
  doc.setTextColor(...rgb(META));
  doc.setFont("helvetica", "italic");
  doc.text("GP-prescribed medications and therapies arising from this assessment", m, yPos);
  yPos += 7;

  // Table header
  const cols = [
    { label: "Medication / Therapy", w: 42 },
    { label: "Dose / Frequency", w: 46 },
    { label: "Duration", w: 24 },
    { label: "Action", w: 22 },
    { label: "Notes", w: cw - 42 - 46 - 24 - 22 },
  ];

  doc.setFillColor(...rgb(PURPLE));
  doc.rect(m, yPos, cw, 7, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...rgb(WHITE));
  let cx = m + 2;
  cols.forEach((c) => {
    doc.text(c.label, cx, yPos + 5);
    cx += c.w;
  });
  yPos += 7;

  // Medication rows
  SAMPLE_MEDICATIONS.forEach((med, ri) => {
    const rowH = 10;
    // Alternating row bg
    if (ri % 2 === 0) {
      doc.setFillColor(248, 247, 252);
      doc.rect(m, yPos, cw, rowH, "F");
    }
    doc.setDrawColor(...rgb(BORDER));
    doc.setLineWidth(0.15);
    doc.line(m, yPos + rowH, m + cw, yPos + rowH);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...rgb(BODY));
    let rx = m + 2;
    const values = [med.name, med.dose, med.duration, med.action, med.notes];
    cols.forEach((c, ci) => {
      const txt = doc.splitTextToSize(values[ci], c.w - 3);
      doc.text(txt[0], rx, yPos + 6);
      rx += c.w;
    });
    yPos += rowH;
  });

  // Allergy box
  yPos += 8;
  pageBreak(18);
  doc.setFillColor(245, 243, 252);
  doc.roundedRect(m, yPos, cw, 8, 1.5, 1.5, "F");
  doc.setTextColor(...rgb(PURPLE));
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Allergy / Adverse Drug Reaction Alerts:", m + 5, yPos + 5.5);
  yPos += 10;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...rgb(BODY));
  doc.text("No known drug allergies (NKDA). Patient reports mild seasonal rhinitis — no medication allergy documented.", m, yPos);

  footer();
  doc.save("CareQ_Care_Plan.pdf");
}

export default function CarePlanForm() {
  return (
    <Card className="rounded-xl border border-border shadow-sm max-w-2xl">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <ClipboardCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display font-semibold tracking-tight text-base">
              Post-Visit Care Plan
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Step-by-step care plan with sample patient data
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <div className="rounded-lg bg-muted/30 border border-border/50 p-4 text-sm text-muted-foreground space-y-2">
          <p className="font-medium text-foreground text-sm">Sample patient: Margaret Chen</p>
          <p className="text-[13px] leading-relaxed">
            Right knee osteoarthritis (KL Grade III) — 7 action steps with responsible parties
            and timelines, 3 filled medication rows, and allergy alerts.
          </p>
        </div>

        {/* Preview of steps */}
        <div className="rounded-lg border border-border/50 p-4 space-y-2.5">
          <p className="text-xs font-medium text-muted-foreground mb-2">Preview — Action Steps:</p>
          {CARE_PLAN_STEPS.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-[12px]">
              <span
                className={`mt-0.5 w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-semibold text-white ${
                  step.priority === "important" ? "bg-amber-500" : "bg-emerald-600"
                }`}
              >
                {idx + 1}
              </span>
              <div className="flex-1">
                <span className="text-foreground">{step.action}</span>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground/70">
                  <span>By: {step.responsible}</span>
                  <span>When: {step.timing}</span>
                  {step.priority === "important" && (
                    <span className="text-[9px] font-semibold bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">
                      IMPORTANT
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={generateCarePlanPDF} className="gap-2 w-full sm:w-auto">
          <Download className="w-4 h-4" />
          Download Template
        </Button>
      </CardContent>
    </Card>
  );
}
