import { Layout } from "@/components/Layout";
import { useWaitlist } from "@/hooks/use-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Activity,
  CalendarDays,
  Hourglass,
  Info,
  Video,
  MapPin,
  Pill,
  Dumbbell,
  Microscope,
  ClipboardCheck,
  Download
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function Waitlist() {
  const { data: waitlist, isLoading } = useWaitlist();
  if (isLoading) return <Layout><div className="animate-pulse h-64 bg-muted rounded-xl" /></Layout>;
  if (!waitlist) return null;

  const planItems = [
    { icon: Pill, text: "Daily Naproxen (500mg) for joint inflammation", category: "Medication" },
    { icon: Dumbbell, text: "Pre-habilitation strengthening exercises", category: "Lifestyle" },
    { icon: Microscope, text: "Pre-operative blood panels and imaging", category: "Investigations" },
    { icon: ClipboardCheck, text: "Surgical referral preparation and triage review", category: "Referral" },
    { icon: Activity, text: "Cardiac and medical risk optimization before consult", category: "Medical Optimization" },
  ];

  const downloadStatusPdf = () => {
    const lines = [
      "CareQ Status Summary",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "WAIT LIST STATUS",
      "Waiting for consult",
      "",
      "TIME WAITED SINCE REFERRAL",
      "6 months",
      "",
      "WAIT TIME TO CONSULT",
      "16-18 months",
      "",
      "NEXT STEP",
      "Your next step is a 6 month appointment on March 12, 2026.",
      "",
      "CURRENT CONDITION",
      "Right Knee Osteoarthritis",
      "You have osteoarthritis in your right knee. The cartilage has gradually worn down, which can cause pain,",
      "stiffness, swelling, and difficulty with walking, standing, or stairs.",
      "",
      "CURRENT PLAN",
      ...planItems.flatMap((item) => [`- ${item.text} (${item.category.toUpperCase()})`]),
      "",
      "CARE JOURNEY",
      ...stages.map((stage, index) => `${index + 1}. ${stage.name} - ${stage.date}`),
    ];

    const escapePdfText = (value: string) =>
      value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

    const contentLines = lines.map((line, i) => `BT /F1 12 Tf 50 ${800 - i * 18} Td (${escapePdfText(line)}) Tj ET`);
    const contentStream = contentLines.join("\n");

    const objects = [
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
      "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
      "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
      `5 0 obj << /Length ${contentStream.length} >> stream\n${contentStream}\nendstream endobj`,
    ];

    let pdf = "%PDF-1.4\n";
    const offsets: number[] = [0];
    for (const obj of objects) {
      offsets.push(pdf.length);
      pdf += `${obj}\n`;
    }
    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    for (let i = 1; i < offsets.length; i++) {
      pdf += `${offsets[i].toString().padStart(10, "0")} 00000 n \n`;
    }
    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "careq-status-live-summary.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stages = [
    { id: 1, name: "Referred", date: "June 18, 2025", mode: "in-person" as const },
    { id: 2, name: "Accepted", date: "June 24, 2025", mode: "virtual" as const },
    { id: 3, name: "Registered", date: "July 3, 2025", mode: "virtual" as const },
    { id: 4, name: "Initial Appointment", date: "September 9, 2025", mode: "in-person" as const },
    { id: 5, name: "3 Month Appointment", date: "December 2025", mode: "virtual" as const },
    { id: 6, name: "6 Month Appointment", date: "March 2026", mode: "virtual" as const },
    { id: 7, name: "9 Month Appointment", date: "June 2026", mode: "virtual" as const },
    { id: 8, name: "12 Month Appointment", date: "September 2026", mode: "virtual" as const },
    { id: 9, name: "15 Month Appointment", date: "December 2026", mode: "virtual" as const },
    { id: 10, name: "Surgical Consult", date: "December 2026", mode: "in-person" as const },
    { id: 11, name: "Surgery", date: "Decided after surgical consult", mode: "in-person" as const },
  ];

  const currentStage = 6;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border/40">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3" data-testid="text-page-title">
              <Hourglass className="w-8 h-8 text-primary" />
              Status
            </h1>
            <p className="text-muted-foreground mt-1">View your status and progress through your care journey</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last updated: {new Date(waitlist.lastUpdated!).toLocaleDateString()}
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={downloadStatusPdf}>
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </header>

        {/* Condition Card — single unit */}
        <Card className="border border-border/60 shadow-md overflow-hidden" data-testid="card-condition-hip">
          <CardContent className="px-6 pb-6 pt-6 space-y-8">
              {/* Wait Times Row */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-muted/30 p-5 rounded-xl border border-border/50 text-center flex flex-col justify-center">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Wait list status</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-muted-foreground/60 hover:text-primary transition-colors">
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 text-xs space-y-2">
                          <p className="font-semibold text-sm text-foreground">What does this mean?</p>
                          <p>Your current status is determined by your most recent clinical assessment and placement on the provincial waitlist.</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <p className="font-bold text-xl text-primary text-center leading-snug">Waiting for consult</p>
                  </div>

                  <div className="bg-muted/30 p-5 rounded-xl border border-border/50 text-center flex flex-col justify-center">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Time waited since referral</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-muted-foreground/60 hover:text-primary transition-colors" data-testid="button-info-surgeon">
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 text-xs space-y-2">
                          <p className="font-semibold text-sm text-foreground">What does this mean?</p>
                          <p>This shows how long you have already been on the waitlist since your referral was received.</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <p className="font-bold text-xl text-primary text-center leading-snug">6 months</p>
                  </div>

                  <div className="bg-muted/30 p-5 rounded-xl border border-border/50 text-center flex flex-col justify-center">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Wait time to consult</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-muted-foreground/60 hover:text-primary transition-colors" data-testid="button-info-surgery">
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 text-xs space-y-2">
                          <p className="font-semibold text-sm text-foreground">What does this mean?</p>
                          <p>This is the estimated time remaining before your surgical consult based on current waitlist trends.</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <p className="font-bold text-xl text-primary text-center leading-snug">16-18 months</p>
                  </div>
                </div>
              </div>

              {/* Two-Column: Conditions Summary + Journey */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                
                {/* Care Status */}
                <div className="lg:col-span-2">
                  <div className="mb-4">
                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Care Status
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white p-5 rounded-lg border border-border">
                      <h4 className="font-semibold text-base text-foreground mb-3">Current Condition</h4>
                      <h5 className="text-xs text-primary uppercase tracking-wide mb-3 origin-left scale-90">Right Knee Osteoarthritis</h5>
                      <p className="text-sm font-medium text-foreground leading-relaxed">
                        You have osteoarthritis in your right knee. This means that the cartilage in the knee joint has gradually worn down over time, which can cause the bones in the joint to rub against each other. This often leads to symptoms such as pain, stiffness, swelling, and difficulty with activities like walking, standing for long periods, or climbing stairs. Your imaging and symptoms suggest that the arthritis is moderate to advanced, which explains the discomfort you have been experiencing.
                      </p>
                      <p className="text-sm font-medium text-foreground leading-relaxed mt-3">
                        At this stage, treatment focuses on managing symptoms and improving joint function. This may include lifestyle changes such as weight management and exercise, medications to reduce pain, and other treatments if needed. If symptoms continue to worsen or significantly affect your daily activities, surgical options such as joint replacement may be considered. Your care team will continue to monitor your symptoms and help guide you through the next steps in your care.
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg border border-border">
                      <h4 className="font-semibold text-base text-foreground mb-4">Current Plan</h4>
                      <div className="space-y-2">
                        {planItems.map((item) => (
                          <div key={item.text} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg border border-border/50">
                            <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0">
                              <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs text-primary uppercase tracking-wide mb-1 origin-left scale-90">{item.category}</p>
                              <p className="text-sm font-medium">{item.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Care Journey */}
                <div className="lg:col-span-1 flex flex-col">
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 mb-4">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    Care Journey
                  </h3>
                  <div className="mb-4 rounded-lg border border-secondary/40 bg-accent p-3">
                    <p className="text-sm font-semibold text-primary">
                      Your next step is a 6 month appointment on March 12, 2026.
                    </p>
                  </div>
                  <div className="relative pl-2 flex-1 flex flex-col bg-white border border-border rounded-lg p-4">
                    <div className="absolute left-[28px] top-5 bottom-5 w-0.5 bg-border/60" />
                    <div className="flex flex-col flex-1 gap-6">
                      {stages.map((stage) => {
                        const isCompleted = stage.id < currentStage;
                        const isCurrent = stage.id === currentStage;
                        return (
                          <div key={stage.id} className="relative flex items-start gap-4" data-testid={`journey-stage-${stage.id}`}>
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-background transition-colors shrink-0",
                              isCompleted ? "border-primary bg-primary text-white" :
                              isCurrent ? "border-primary bg-white text-primary border-4" :
                              "border-muted-foreground/30 text-muted-foreground/30"
                            )}>
                              {isCompleted ? <CheckCircle2 className="w-6 h-6" /> :
                               isCurrent ? <div className="w-2.5 h-2.5 bg-primary rounded-full" /> :
                               <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                              }
                            </div>
                            <div className={cn("pt-1 transition-colors min-w-0 flex-1")}>
                              <div className="flex items-center justify-between gap-2">
                                <h4 className={cn(
                                  "font-bold text-sm leading-tight",
                                  isCurrent ? "text-primary" : "text-foreground"
                                )}>
                                  {stage.name}
                                </h4>
                                {stage.mode && stage.id > 3 && (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium px-1 py-0 rounded-full bg-muted text-muted-foreground border border-border origin-right scale-90">
                                    {stage.mode === "virtual" ? <Video className="w-2 h-2" /> :
                                     <MapPin className="w-2 h-2" />}
                                    {stage.mode === "virtual" ? "Virtual" : "In Person"}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{stage.date}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
}
