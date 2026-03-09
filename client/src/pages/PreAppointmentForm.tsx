import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const steps = ["Readiness", "Clinical Update", "Goals", "Final Confirmation"];

export default function PreAppointmentForm() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState("");

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-card rounded-xl border border-border shadow-sm p-6 space-y-5">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2"><span>Pre-Appointment Form</span><span>Step {step + 1} of {steps.length}</span></div>
          <div className="h-1.5 rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
        </div>

        <h2 className="font-display font-bold text-xl">{steps[step]}</h2>

        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Appointment date/time</Label><Input value="June 12, 2026 at 10:00 AM" readOnly className="bg-muted/30" /></div>
            <div>
              <Label>Preferred mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Interpreter needed?</Label><Input placeholder="Language (optional)" /></div>
            <div><Label>Accessibility accommodations</Label><Input placeholder="Optional details" /></div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div><Label>Pain score (0-10)</Label><Input type="number" min={0} max={10} /></div>
            <div><Label>Has pain changed?</Label><Input placeholder="Improved / same / worsened" /></div>
            <div><Label>Any recent falls, swelling, or injuries?</Label><Textarea rows={3} /></div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div><Label>Top concerns for this visit</Label><Textarea rows={3} /></div>
            <div><Label>Questions you want answered</Label><Textarea rows={3} /></div>
            <div><Label>Activities you want to return to</Label><Textarea rows={2} /></div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">I confirm my information is up to date and I will be available at the appointment time.</p>
            <div><Label>Anything else your care team should know?</Label><Textarea rows={3} /></div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => (step === 0 ? navigate("/onboarding/forms") : setStep(step - 1))}>Back</Button>
          {step < steps.length - 1 ? <Button onClick={() => setStep(step + 1)}>Next</Button> : <Button onClick={() => navigate("/onboarding/forms")}>Save and return</Button>}
        </div>
      </div>
    </div>
  );
}
