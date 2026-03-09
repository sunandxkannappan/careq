import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck } from "lucide-react";

const linkedAccount = {
  firstName: "Sunand",
  lastName: "Kannappan",
  dob: "1990-03-12",
  phn: "9876 543 210",
  referralPhysician: "Dr. Justin Case",
  referralDate: "November 12, 2025",
};

export default function Login() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"patient" | "staff">("patient");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");

  const contactLabel = useMemo(() => (mode === "patient" ? "Email or phone" : "Staff email or phone"), [mode]);

  const toPortal = () => {
    localStorage.setItem("careq_auth", "true");
    localStorage.setItem("careq_onboarding", "complete");
    navigate("/referral");
  };

  const next = () => {
    setError("");
    if (step === 1 && !contact.trim()) return setError("Enter email or phone.");
    if (step === 2 && otp.length < 6) return setError("Enter the 6-digit OTP.");
    if (step === 3 && !dob) return setError("Enter your date of birth.");
    setStep((Math.min(4, step + 1) as 1 | 2 | 3 | 4));
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Link href="/referral" className="fixed top-4 right-4 text-sm text-primary font-medium hover:underline">Skip to portal</Link>
      <div className="w-full max-w-[560px]">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-extrabold text-2xl">Q</div>
          <h1 className="font-display font-bold text-2xl mt-2">CareQ</h1>
          <p className="text-sm text-muted-foreground">Patient Portal</p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-5">
          <Tabs value={mode} onValueChange={(v) => { setMode(v as "patient" | "staff"); setStep(1); }}>
            <TabsList className="grid grid-cols-2 w-full max-w-sm bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="patient" className="data-[state=active]:bg-white">Patient login</TabsTrigger>
              <TabsTrigger value="staff" className="data-[state=active]:bg-white">Staff login</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
          <p className="text-xs text-muted-foreground">Step {step} of 4</p>

          {step === 1 && (
            <div className="space-y-3">
              <h2 className="font-display font-bold text-xl">Sign in with OTP</h2>
              <p className="text-sm text-muted-foreground">Enter your {mode === "patient" ? "patient" : "staff"} email or phone to receive a one-time code.</p>
              <div>
                <Label>{contactLabel}</Label>
                <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="you@example.com or (403) 555-1234" />
              </div>
              <Button className="w-full" onClick={next}>Send OTP</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h2 className="font-display font-bold text-xl">Enter OTP</h2>
              <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to {contact}.</p>
              <div>
                <Label>One-time passcode</Label>
                <Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="123456" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="w-full">Resend OTP</Button>
                <Button className="w-full" onClick={next}>Verify OTP</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h2 className="font-display font-bold text-xl">Identity verification</h2>
              <p className="text-sm text-muted-foreground">Confirm your date of birth to match your patient record.</p>
              <div>
                <Label>Date of birth</Label>
                <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>
              <Button className="w-full" onClick={next}>Verify identity</Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h2 className="font-display font-bold text-xl">Account linked</h2>
                  <p className="text-sm text-muted-foreground">Your account has been matched to the referral record.</p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm space-y-1">
                <p><span className="font-semibold">Name:</span> {linkedAccount.firstName} {linkedAccount.lastName}</p>
                <p><span className="font-semibold">DOB:</span> {linkedAccount.dob}</p>
                <p><span className="font-semibold">PHN:</span> {linkedAccount.phn}</p>
                <p><span className="font-semibold">Referral physician:</span> {linkedAccount.referralPhysician}</p>
                <p><span className="font-semibold">Date of referral:</span> {linkedAccount.referralDate}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="w-full" onClick={() => navigate("/onboarding/forms")}>View next forms</Button>
                <Button className="w-full" onClick={toPortal}>Enter portal</Button>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="mt-6 pt-5 border-t border-border text-center">
          <p className="text-sm text-primary font-medium mb-3">New to CareQ?</p>
          <Link href="/register">
            <Button variant="outline" className="px-6">Register now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
