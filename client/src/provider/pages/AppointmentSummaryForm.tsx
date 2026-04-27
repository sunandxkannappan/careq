import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import jsPDF from "jspdf";

const SAMPLE_SUMMARY =
  "Margaret Chen (DOB: 1958-04-12, PHN: 9876 543 210) attended a virtual CareQ triage appointment on March 10, 2026, for assessment of progressive right knee osteoarthritis. Mrs. Chen reports worsening medial knee pain over the past 14 months, rated 7/10 at worst, with significant morning stiffness lasting approximately 30 minutes. She describes difficulty with stairs, prolonged walking, and rising from seated positions. Current management includes acetaminophen 500 mg as needed (averaging 3–4 times per week) and a home-based stretching routine, though she has not yet engaged in formal physiotherapy.\n\nPhysical examination findings from her referring GP note mild varus alignment, a small cool effusion, and reduced flexion to approximately 110 degrees. Weight-bearing radiographs from November 2025 demonstrate moderate medial compartment joint-space narrowing with early osteophyte formation (Kellgren-Lawrence Grade III). Her BMI is 31.2, and she has well-controlled Type 2 diabetes (HbA1c 6.8%) managed with metformin.\n\nBased on today's composite triage score of 62/100 (moderate-high priority), Mrs. Chen has been maintained on the surgical waitlist for right total knee arthroplasty. She has been referred to outpatient physiotherapy for a structured quadriceps strengthening and range-of-motion programme, and her GP has been asked to review her analgesic regimen within two weeks, with consideration of a step-up to a topical NSAID if appropriate given her medical history. Pre-operative optimisation for her diabetes and BMI has been recommended prior to her next review. A follow-up CareQ virtual check-in has been scheduled in approximately three months to reassess her symptoms, treatment adherence, and waitlist position.";

function generateAppointmentSummaryPDF() {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Top teal bar
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, pageWidth, 8, "F");

  // Header row
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 118, 110);
  doc.text("CareQ", margin, 18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("  |  Your Visit Summary", margin + 16, 18);

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 38, 38);
  doc.text("PRIVATE & CONFIDENTIAL", pageWidth - margin, 18, { align: "right" });

  // Divider
  doc.setDrawColor(15, 118, 110);
  doc.setLineWidth(0.5);
  doc.line(margin, 22, pageWidth - margin, 22);

  // Hero banner
  doc.setFillColor(15, 118, 110);
  doc.roundedRect(margin, 28, contentWidth, 48, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("CareQ", pageWidth / 2, 42, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Hip & Knee Arthroplasty Program", pageWidth / 2, 49, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("YOUR APPOINTMENT SUMMARY", pageWidth / 2, 58, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text("A summary of today's visit and your personalised action plan", pageWidth / 2, 65, { align: "center" });

  // Section header with teal accent bar
  let yPos = 90;
  doc.setFillColor(15, 118, 110);
  doc.rect(margin, yPos, 3, 7, "F");
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Appointment Summary", margin + 6, yPos + 5.5);
  yPos += 14;

  // Summary paragraph text
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  const paragraphs = SAMPLE_SUMMARY.split("\n\n");
  paragraphs.forEach((para) => {
    const lines = doc.splitTextToSize(para.trim(), contentWidth);
    // Check if we need a new page
    const blockHeight = lines.length * 5;
    if (yPos + blockHeight > pageHeight - 25) {
      // Footer on current page
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text("CareQ Health Technology Inc.", margin, pageHeight - 10);
      doc.text("YOUR VISIT SUMMARY", pageWidth / 2, pageHeight - 10, { align: "center" });
      doc.addPage();
      yPos = 20;
      // Reset text style after page break
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
    }
    doc.text(lines, margin, yPos, { lineHeightFactor: 1.6 });
    yPos += lines.length * 5 * 1.6 + 4;
  });

  // Footer
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text("CareQ Health Technology Inc.", margin, pageHeight - 10);
  doc.text("YOUR VISIT SUMMARY", pageWidth / 2, pageHeight - 10, { align: "center" });

  doc.save("CareQ_Appointment_Summary.pdf");
}

export default function AppointmentSummaryForm() {
  return (
    <Card className="rounded-xl border border-border shadow-sm max-w-2xl">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display font-semibold tracking-tight text-base">
              Appointment Summary
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Branded visit summary with sample patient narrative
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <div className="rounded-lg bg-muted/30 border border-border/50 p-4 text-sm text-muted-foreground space-y-2">
          <p className="font-medium text-foreground text-sm">Sample patient: Margaret Chen</p>
          <p className="text-[13px] leading-relaxed">
            Right knee osteoarthritis assessment — includes presenting complaint, examination findings,
            radiology, triage score, and management plan as a long-form narrative paragraph.
          </p>
        </div>
        <Button onClick={generateAppointmentSummaryPDF} className="gap-2 w-full sm:w-auto">
          <Download className="w-4 h-4" />
          Download Template
        </Button>
      </CardContent>
    </Card>
  );
}
