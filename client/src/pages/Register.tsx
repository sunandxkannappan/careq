import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const DRAFT_KEY = "careq_registration_draft";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  phn: "",
  referralPhysician: "",
  referralDate: "",
  acceptedConsent: false,
};

export default function Register() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState(initialForm);
  const [saveStatus, setSaveStatus] = useState("Not saved");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        setForm({ ...initialForm, ...JSON.parse(raw) });
        setSaveStatus("Draft restored");
      } catch {
        setSaveStatus("Not saved");
      }
    }
  }, []);

  useEffect(() => {
    setSaveStatus("Saving...");
    const t = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setSaveStatus("Saved just now");
    }, 300);
    return () => clearTimeout(t);
  }, [form]);

  const completion = useMemo(() => {
    const required = [form.firstName, form.lastName, form.email, form.phone, form.dob, form.phn, form.referralPhysician, form.referralDate];
    const filled = required.filter(Boolean).length + (form.acceptedConsent ? 1 : 0);
    return Math.round((filled / 9) * 100);
  }, [form]);

  const setField = (field: keyof typeof form, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));

  const createAccount = () => {
    setCreating(true);
    setTimeout(() => {
      localStorage.setItem("careq_auth", "true");
      localStorage.setItem("careq_onboarding", "account-created");
      localStorage.setItem("careq_profile", JSON.stringify(form));
      navigate("/onboarding/forms");
    }, 450);
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Link href="/referral" className="fixed top-4 left-4 text-sm text-primary font-medium hover:underline">Skip to portal</Link>
      <div className="w-full max-w-[680px]">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-extrabold text-2xl">Q</div>
          <h1 className="font-display font-bold text-2xl mt-2">CareQ</h1>
          <p className="text-sm text-muted-foreground">Create your account</p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-5">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Account creation progress</span>
              <span>{completion}% complete</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary" style={{ width: `${completion}%` }} /></div>
            <p className="text-xs text-muted-foreground mt-2">{saveStatus}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>First Name</Label><Input value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} /></div>
            <div><Label>Last Name</Label><Input value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setField("phone", e.target.value)} /></div>
            <div><Label>Date of Birth</Label><Input type="date" value={form.dob} onChange={(e) => setField("dob", e.target.value)} /></div>
            <div><Label>PHN / Health Number</Label><Input value={form.phn} onChange={(e) => setField("phn", e.target.value)} /></div>
            <div><Label>Referral Physician</Label><Input value={form.referralPhysician} onChange={(e) => setField("referralPhysician", e.target.value)} /></div>
            <div><Label>Date of Referral</Label><Input type="date" value={form.referralDate} onChange={(e) => setField("referralDate", e.target.value)} /></div>
          </div>

          <label className="flex items-start gap-2.5 text-sm">
            <Checkbox checked={form.acceptedConsent} onCheckedChange={(v) => setField("acceptedConsent", !!v)} />
            <span>I acknowledge the consent and privacy terms and will complete required forms next.</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>Save and continue later</Button>
            <Button className="w-full" onClick={createAccount} disabled={creating || !form.acceptedConsent}>{creating ? "Creating account..." : "Create Account"}</Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
