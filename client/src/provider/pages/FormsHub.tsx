import { useState } from "react";
import { ProviderLayout } from "@/provider/components/ProviderLayout";
import { cn } from "@/lib/utils";
import { ClipboardList, Stethoscope, BarChart3, FileText, ClipboardCheck, ClipboardPen } from "lucide-react";
import { HealthHistoryFormContent } from "./HealthHistoryForm";
import TriageAssessmentForm from "./TriageAssessmentForm";
import TriageScoreView from "./TriageScoreView";
import AppointmentSummaryForm from "./AppointmentSummaryForm";
import CarePlanForm from "./CarePlanForm";
import PreVisitForm from "./PreVisitForm";
import type { TriageFormData } from "./TriageAssessmentForm";

type Tab = "health-history" | "pre-visit" | "triage-assessment" | "assessment-results" | "appointment-summary" | "care-plan";

const TABS: { id: Tab; label: string; icon: typeof ClipboardList; description: string }[] = [
  { id: "health-history", label: "Health History", icon: ClipboardList, description: "Patient intake form" },
  { id: "pre-visit", label: "Pre-Visit Form", icon: ClipboardPen, description: "Patient sections A–D plus pre-appointment questions" },
  { id: "triage-assessment", label: "Triage Assessment", icon: Stethoscope, description: "Composite scoring" },
  { id: "assessment-results", label: "Assessment Results", icon: BarChart3, description: "Score heatmap" },
  { id: "appointment-summary", label: "Appointment Summary", icon: FileText, description: "Visit summary PDF" },
  { id: "care-plan", label: "Care Plan", icon: ClipboardCheck, description: "Post-visit care plan" },
];

export default function FormsHub() {
  const [activeTab, setActiveTab] = useState<Tab>("health-history");
  const [submittedTriageData, setSubmittedTriageData] = useState<TriageFormData | null>(null);

  const handleTriageSubmit = (data: TriageFormData) => {
    setSubmittedTriageData(data);
    setActiveTab("assessment-results");
    window.scrollTo(0, 0);
  };

  return (
    <ProviderLayout>
      <div className="animate-enter">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">Forms</h1>
          <p className="text-sm text-muted-foreground mt-1">Patient intake forms and clinical assessments</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const isDisabled = tab.id === "assessment-results" && !submittedTriageData;
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                disabled={isDisabled}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-3 rounded-lg border-2 transition-all shrink-0",
                  "text-[14px] font-medium",
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : isDisabled
                    ? "border-border/50 text-muted-foreground/40 cursor-not-allowed"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-muted/30"
                )}
              >
                <tab.icon className={cn("w-4 h-4", isActive ? "text-primary" : isDisabled ? "text-muted-foreground/30" : "")} />
                <div className="text-left">
                  <span className="block leading-tight">{tab.label}</span>
                  <span className={cn("block text-[11px] font-normal", isActive ? "text-primary/60" : "text-muted-foreground/60")}>{tab.description}</span>
                </div>
                {tab.id === "assessment-results" && submittedTriageData && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-green-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "health-history" && <HealthHistoryFormContent />}
        {activeTab === "pre-visit" && <PreVisitForm />}
        {activeTab === "triage-assessment" && <TriageAssessmentForm onSubmit={handleTriageSubmit} />}
        {activeTab === "assessment-results" && submittedTriageData && (
          <TriageScoreView data={submittedTriageData} onBack={() => setActiveTab("triage-assessment")} />
        )}
        {activeTab === "appointment-summary" && <AppointmentSummaryForm />}
        {activeTab === "care-plan" && <CarePlanForm />}
      </div>
    </ProviderLayout>
  );
}
