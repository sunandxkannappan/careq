import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ClipboardCheck, CalendarClock } from "lucide-react";

const forms = [
  {
    key: "health-history",
    title: "Health History Form",
    description: "Multi-step intake form with autosave and completion tracking.",
    href: "/forms/health-history",
    icon: FileText,
  },
  {
    key: "consent",
    title: "Consent Form",
    description: "Consent and privacy acknowledgement flow.",
    href: "/forms/consent",
    icon: ClipboardCheck,
  },
  {
    key: "pre-appointment",
    title: "Pre-Appointment Form",
    description: "Short form before each appointment to update readiness and symptoms.",
    href: "/forms/pre-appointment",
    icon: CalendarClock,
  },
];

export default function OnboardingForms() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Link href="/referral" className="fixed top-4 left-4 text-sm text-primary font-medium hover:underline">Skip to portal</Link>
      <div className="w-full max-w-4xl space-y-5">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Next Forms</h1>
          <p className="text-muted-foreground mt-1">Complete these forms when ready. Progress is saved automatically.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {forms.map((form) => {
            const Icon = form.icon;
            return (
              <Card key={form.key} className="border border-border/60">
                <CardContent className="p-4 space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center"><Icon className="w-4.5 h-4.5 text-primary" /></div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{form.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{form.description}</p>
                  </div>
                  <Button className="w-full" onClick={() => navigate(form.href)}>Start Form</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => navigate("/referral")}>Continue to Portal</Button>
        </div>
      </div>
    </div>
  );
}
