import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function ConsentForm() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phn, setPhn] = useState("");
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [signature, setSignature] = useState("");

  const pct = step === 1 ? 50 : 100;

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-card rounded-xl border border-border shadow-sm p-6 space-y-5">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2"><span>Consent Form</span><span>Step {step} of 2</span></div>
          <div className="h-1.5 rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${pct}%` }} /></div>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-xl">Identity and privacy acknowledgements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>First name</Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
              <div><Label>Last name</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
              <div><Label>Date of birth</Label><Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></div>
              <div><Label>PHN</Label><Input value={phn} onChange={(e) => setPhn(e.target.value)} /></div>
            </div>
            <label className="flex items-start gap-2 text-sm"><Checkbox checked={agreedPrivacy} onCheckedChange={(v) => setAgreedPrivacy(!!v)} /><span>I have read and acknowledge the CareQ Privacy Policy.</span></label>
            <label className="flex items-start gap-2 text-sm"><Checkbox checked={agreedTerms} onCheckedChange={(v) => setAgreedTerms(!!v)} /><span>I have read and agree to the CareQ Terms of Use.</span></label>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-xl">Final acknowledgement and signature</h2>
            <label className="flex items-start gap-2 text-sm"><Checkbox /><span>I confirm information provided is accurate to the best of my knowledge.</span></label>
            <label className="flex items-start gap-2 text-sm"><Checkbox /><span>I understand emergency issues should not be managed through this portal.</span></label>
            <div><Label>Full legal name (e-sign)</Label><Input value={signature} onChange={(e) => setSignature(e.target.value)} /></div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => (step === 1 ? navigate("/onboarding/forms") : setStep(1))}>Back</Button>
          {step === 1 ? <Button onClick={() => setStep(2)}>Next</Button> : <Button onClick={() => navigate("/onboarding/forms")}>Save and return</Button>}
        </div>
      </div>
    </div>
  );
}
