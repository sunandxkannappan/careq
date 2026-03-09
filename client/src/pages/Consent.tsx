import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CONSENTS = [
  {
    id: "portal",
    title: "Access to Patient Portal",
    description:
      "I consent to accessing my surgical waitlist information, appointment details, and health records through the CareQ patient portal.",
  },
  {
    id: "data",
    title: "Collection and Use of Health Information",
    description:
      "I consent to Alberta Health Services and the referring clinic collecting, using, and securely storing my personal health information for the purposes of managing my care and surgical waitlist placement.",
  },
  {
    id: "communications",
    title: "Electronic Communications",
    description:
      "I consent to receiving appointment reminders, waitlist updates, and care-related notifications by email and through the portal. I understand I may opt out at any time in my profile settings.",
  },
  {
    id: "sharing",
    title: "Information Sharing with Care Team",
    description:
      "I consent to my health information being shared with members of my care team — including surgeons, nurses, and administrative staff — solely for the purpose of providing and coordinating my care.",
  },
];

export default function Consent() {
  const [, navigate] = useLocation();
  const [agreed, setAgreed] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAgreed = CONSENTS.every((c) => agreed[c.id]);

  function toggle(id: string) {
    setAgreed((a) => ({ ...a, [id]: !a[id] }));
  }

  function handleContinue() {
    if (!allAgreed) {
      setSubmitted(true);
      return;
    }
    localStorage.setItem("careq_onboarding", "intake");
    navigate("/intake");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[560px] animate-enter">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold font-display text-2xl mb-3">
            Q
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">CareQ</h1>
          <p className="text-sm text-muted-foreground mt-1">Patient Portal</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {["Account", "Consent", "Intake"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1.5 text-xs font-medium",
                i === 1 ? "text-primary" : i < 1 ? "text-green-600" : "text-muted-foreground"
              )}>
                {i < 1 ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                    i === 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}>{i + 1}</div>
                )}
                {step}
              </div>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-foreground tracking-tight">Patient Consent</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Please review and agree to each item below before continuing.
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {CONSENTS.map((consent) => {
              const isChecked = !!agreed[consent.id];
              const hasError = submitted && !isChecked;
              return (
                <label
                  key={consent.id}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                    isChecked
                      ? "border-primary/30 bg-primary/[0.04]"
                      : hasError
                      ? "border-destructive/40 bg-destructive/[0.03]"
                      : "border-border hover:border-border/80 hover:bg-muted/30"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(consent.id)}
                    className="mt-0.5 w-4 h-4 rounded border-border accent-primary cursor-pointer shrink-0"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground leading-snug">{consent.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{consent.description}</p>
                  </div>
                </label>
              );
            })}
          </div>

          {submitted && !allAgreed && (
            <p className="text-sm text-destructive mb-4">
              Please agree to all items above to continue.
            </p>
          )}

          <Button onClick={handleContinue} className="w-full">
            Continue to health questionnaire
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 leading-relaxed">
          Your information is protected under PIPA (Alberta) and handled in accordance with our{" "}
          <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
