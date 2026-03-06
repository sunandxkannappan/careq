import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useWaitlist } from "@/hooks/use-data";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Activity,
  CalendarDays,
  Hourglass,
  ChevronDown,
  ChevronUp,
  CalendarCheck,
  CalendarClock,
  CircleCheckBig,
  Info,
  Video,
  MapPin,
  Pill,
  Dumbbell,
  Stethoscope,
  ClipboardCheck,
  FileText,
  Download,
  Microscope,
  Heart,
  Zap
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function Waitlist() {
  const { data: waitlist, isLoading } = useWaitlist();
  const [expanded, setExpanded] = useState(true);

  if (isLoading) return <Layout><div className="animate-pulse h-64 bg-muted rounded-xl" /></Layout>;
  if (!waitlist) return null;

  const stages = [
    { id: 1, name: "Referred", date: "Jun 2025", mode: "in-person" as const },
    { id: 2, name: "Registered", date: "Jul 2025", mode: "virtual" as const },
    { id: 3, name: "Initial Appointment", date: "Sep 2025", mode: "in-person" as const },
    { id: 4, name: "3 Month Appointment", date: "Dec 2025", mode: "virtual" as const },
    { id: 5, name: "6 Month Appointment", date: "Mar 2026", mode: "virtual" as const },
    { id: 6, name: "9 Month Appointment", date: "Jun 2026", mode: "virtual" as const },
    { id: 7, name: "12 Month Appointment", date: "Sep 2026", mode: "virtual" as const },
    { id: 8, name: "15 Month Appointment", date: "Dec 2026", mode: "virtual" as const },
    { id: 9, name: "Surgical Consult", date: "Dec 2026", mode: "in-person" as const },
    { id: 10, name: "Surgery", date: "Mar 2027", mode: "in-person" as const },
  ];

  const currentStage = 5; // Set to 6 Month Visit (Ready to book) to show grayed out logic

  const getBookingStatus = (stageId: number): "ready" | "booked" | "completed" | null => {
    if (stageId < currentStage) return "completed";
    if (stageId === currentStage) return "ready";
    return null;
  };

  const getBookingBadge = (status: "ready" | "booked" | "completed" | null) => {
    return null;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border/40">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3" data-testid="text-page-title">
              <Hourglass className="w-8 h-8 text-primary" />
              Status
            </h1>
            <p className="text-muted-foreground mt-1">Track your progress and view your current care journey status</p>
          </div>
          <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated: {new Date(waitlist.lastUpdated!).toLocaleDateString()}
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
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Current wait list status</p>
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
                    <p className="font-bold text-lg text-primary text-center leading-snug">
                      Awaiting surgical consult
                    </p>
                  </div>

                  <div className="bg-muted/30 p-5 rounded-xl border border-border/50 text-center flex flex-col justify-center">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Wait time to surgical consult</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-muted-foreground/60 hover:text-primary transition-colors" data-testid="button-info-surgeon">
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 text-xs space-y-2">
                          <p className="font-semibold text-sm text-foreground">What does this mean?</p>
                          <p>This estimate is based on the average time patients in your region wait from referral to their first surgical consultation.</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-primary">18</span>
                      <span className="text-base font-medium text-muted-foreground">months</span>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-5 rounded-xl border border-border/50 text-center flex flex-col justify-center">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Wait time to surgery</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-muted-foreground/60 hover:text-primary transition-colors" data-testid="button-info-surgery">
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 text-xs space-y-2">
                          <p className="font-semibold text-sm text-foreground">What does this mean?</p>
                          <p>This estimate covers the full timeline from referral to your surgery date.</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-primary">21</span>
                      <span className="text-base font-medium text-muted-foreground">months</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two-Column: Conditions Summary + Journey */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                
                {/* Latest Summary */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Latest Summary
                    </h3>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-muted rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-muted/30 p-5 rounded-lg border border-border/50">
                      <h4 className="font-semibold text-base text-foreground mb-3">Diagnoses</h4>
                      <ul className="text-base text-foreground/80 leading-relaxed font-bold list-disc list-inside">
                        <li>Left Hip Osteoarthritis</li>
                        <li>Right Knee Osteoarthritis</li>
                      </ul>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-lg border border-border/50">
                      <h4 className="font-semibold text-base text-foreground mb-3">Assessment</h4>
                      <p className="text-base text-foreground/80 leading-relaxed">
                        Assessments have confirmed advanced osteoarthritis in both your left hip and right knee, resulting in chronic joint pain and significant stiffness. These conditions currently limit your mobility, making daily activities like walking and climbing stairs increasingly difficult. Previous attempts with physical therapy and standard pain medications have provided only temporary relief.
                      </p>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-lg border border-border/50">
                      <h4 className="font-semibold text-base text-foreground mb-4">Plan</h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Pharmacologic</h5>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border/30">
                              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                <Pill className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-medium">Daily Naproxen (500mg) for joint inflammation</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border/30">
                              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                <Zap className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-medium">Supplement regimen for bone health</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Allied Health</h5>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border/30">
                              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                <Dumbbell className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-medium">Pre-habilitation strengthening exercises</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border/30">
                              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                <Activity className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-medium">Mobility and low-impact conditioning</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Investigations</h5>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border/30">
                              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                <Microscope className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-medium">Pre-operative blood panels and imaging</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border/30">
                              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                <Heart className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-medium">Obtain cardiac clearance</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Clinical Review</h5>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border/30">
                              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                <Stethoscope className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-medium">Monthly mobility assessments</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-border/30">
                              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                <ClipboardCheck className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-medium">Surgical readiness review</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Journey Progress */}
                <div className="lg:col-span-1 flex flex-col">
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 mb-4">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    Journey Progress
                  </h3>
                  <div className="relative pl-2 flex-1 flex flex-col">
                    <div className="absolute left-[19px] top-2 bottom-[52px] w-0.5 bg-border/60" />
                    <div className="flex flex-col flex-1 gap-6">
                      {stages.map((stage) => {
                        const isCompleted = stage.id < currentStage;
                        const isCurrent = stage.id === currentStage;
                        const isFuture = stage.id > currentStage;

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
                            <div className={cn("pt-1 transition-colors min-w-0")}>
                              <h4 className={cn(
                                "font-bold text-sm leading-tight",
                                isCurrent ? "text-primary" : "text-foreground"
                              )}>
                                {stage.name}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-0.5">{stage.date}</p>
                              {stage.mode && (
                                <span className={cn(
                                  "inline-flex items-center gap-1 text-[10px] font-medium mt-1 px-2 py-1 rounded-full",
                                  stage.mode === "virtual" ? "bg-secondary/20 text-secondary-foreground" :
                                  "bg-primary text-white"
                                )}>
                                  {stage.mode === "virtual" ? <Video className="w-2.5 h-2.5" /> :
                                   <MapPin className="w-2.5 h-2.5" />}
                                  {stage.mode === "virtual" ? "Virtual" :
                                   "In Person"}
                                </span>
                              )}
                              {getBookingBadge(getBookingStatus(stage.id))}
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
