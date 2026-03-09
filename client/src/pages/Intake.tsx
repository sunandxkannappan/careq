import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const STEPS = ["Medical History", "Medications", "Surgical History", "Emergency Contact"];

const CONDITIONS = [
  "Diabetes (Type 1 or 2)",
  "Heart disease or heart failure",
  "High blood pressure",
  "Asthma or COPD",
  "Kidney disease",
  "Liver disease",
  "Thyroid disorder",
  "Cancer (current or previous)",
  "Blood clotting disorders",
  "Obesity (BMI ≥ 30)",
  "Depression or anxiety",
  "None of the above",
];

const ALLERGIES = [
  "Penicillin / amoxicillin",
  "Sulfa drugs",
  "Aspirin / NSAIDs",
  "Codeine or opioids",
  "Latex",
  "Iodine / contrast dye",
  "No known allergies",
];

export default function Intake() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);

  // Step 1: Medical history
  const [conditions, setConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);

  // Step 2: Medications
  const [medications, setMedications] = useState([
    { name: "", dose: "", frequency: "" },
  ]);
  const [noMeds, setNoMeds] = useState(false);

  // Step 3: Surgical history
  const [surgeries, setSurgeries] = useState([{ procedure: "", year: "" }]);
  const [noSurgeries, setNoSurgeries] = useState(false);

  // Step 4: Emergency contact
  const [emergency, setEmergency] = useState({
    name: "",
    relationship: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleCondition(val: string) {
    if (val === "None of the above") {
      setConditions(conditions.includes(val) ? [] : ["None of the above"]);
    } else {
      setConditions((prev) =>
        prev.includes(val)
          ? prev.filter((c) => c !== val)
          : [...prev.filter((c) => c !== "None of the above"), val]
      );
    }
  }

  function toggleAllergy(val: string) {
    if (val === "No known allergies") {
      setAllergies(allergies.includes(val) ? [] : ["No known allergies"]);
    } else {
      setAllergies((prev) =>
        prev.includes(val)
          ? prev.filter((a) => a !== val)
          : [...prev.filter((a) => a !== "No known allergies"), val]
      );
    }
  }

  function validateStep() {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (conditions.length === 0) errs.conditions = "Please select at least one option";
      if (allergies.length === 0) errs.allergies = "Please select at least one option";
    }
    if (step === 3) {
      if (!emergency.name.trim()) errs.emergencyName = "Required";
      if (!emergency.relationship.trim()) errs.emergencyRelationship = "Required";
      if (!emergency.phone.trim()) errs.emergencyPhone = "Required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function back() {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit() {
    if (!validateStep()) return;
    localStorage.setItem("careq_onboarding", "complete");
    navigate("/referral");
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

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {["Account", "Consent", "Intake"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1.5 text-xs font-medium",
                i === 2 ? "text-primary" : "text-green-600"
              )}>
                {i < 2 ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">3</div>
                )}
                {s}
              </div>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-1.5 mb-5">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mb-6">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>

        {/* Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h2 className="font-display font-bold text-xl text-foreground tracking-tight mb-5">
            {STEPS[step]}
          </h2>

          {/* ── Step 0: Medical History ── */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-foreground mb-3">
                  Do you have any of the following conditions?{" "}
                  <span className="text-destructive">*</span>
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {CONDITIONS.map((c) => (
                    <label key={c} className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors text-sm",
                      conditions.includes(c)
                        ? "border-primary/30 bg-primary/[0.04] text-foreground font-medium"
                        : "border-border hover:bg-muted/30 text-muted-foreground"
                    )}>
                      <input
                        type="checkbox"
                        checked={conditions.includes(c)}
                        onChange={() => toggleCondition(c)}
                        className="w-4 h-4 accent-primary shrink-0"
                      />
                      {c}
                    </label>
                  ))}
                </div>
                {errors.conditions && <p className="text-xs text-destructive mt-2">{errors.conditions}</p>}
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-3">
                  Known drug allergies <span className="text-destructive">*</span>
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {ALLERGIES.map((a) => (
                    <label key={a} className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors text-sm",
                      allergies.includes(a)
                        ? "border-primary/30 bg-primary/[0.04] text-foreground font-medium"
                        : "border-border hover:bg-muted/30 text-muted-foreground"
                    )}>
                      <input
                        type="checkbox"
                        checked={allergies.includes(a)}
                        onChange={() => toggleAllergy(a)}
                        className="w-4 h-4 accent-primary shrink-0"
                      />
                      {a}
                    </label>
                  ))}
                </div>
                {errors.allergies && <p className="text-xs text-destructive mt-2">{errors.allergies}</p>}
              </div>
            </div>
          )}

          {/* ── Step 1: Medications ── */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={noMeds}
                  onChange={(e) => setNoMeds(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                I am not currently taking any medications
              </label>

              {!noMeds && (
                <div className="space-y-3">
                  {medications.map((med, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2">
                      <div className="col-span-3 sm:col-span-1 space-y-1">
                        <Label className="text-xs">Medication name</Label>
                        <Input
                          value={med.name}
                          onChange={(e) => {
                            const m = [...medications];
                            m[i] = { ...m[i], name: e.target.value };
                            setMedications(m);
                          }}
                          placeholder="e.g. Metformin"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Dose</Label>
                        <Input
                          value={med.dose}
                          onChange={(e) => {
                            const m = [...medications];
                            m[i] = { ...m[i], dose: e.target.value };
                            setMedications(m);
                          }}
                          placeholder="500mg"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Frequency</Label>
                        <Input
                          value={med.frequency}
                          onChange={(e) => {
                            const m = [...medications];
                            m[i] = { ...m[i], frequency: e.target.value };
                            setMedications(m);
                          }}
                          placeholder="Twice daily"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMedications([...medications, { name: "", dose: "", frequency: "" }])}
                  >
                    + Add medication
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Surgical History ── */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={noSurgeries}
                  onChange={(e) => setNoSurgeries(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                I have not had any previous surgeries or procedures
              </label>

              {!noSurgeries && (
                <div className="space-y-3">
                  {surgeries.map((s, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-1">
                        <Label className="text-xs">Procedure</Label>
                        <Input
                          value={s.procedure}
                          onChange={(e) => {
                            const arr = [...surgeries];
                            arr[i] = { ...arr[i], procedure: e.target.value };
                            setSurgeries(arr);
                          }}
                          placeholder="e.g. Appendectomy"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Year</Label>
                        <Input
                          value={s.year}
                          onChange={(e) => {
                            const arr = [...surgeries];
                            arr[i] = { ...arr[i], year: e.target.value };
                            setSurgeries(arr);
                          }}
                          placeholder="2018"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSurgeries([...surgeries, { procedure: "", year: "" }])}
                  >
                    + Add surgery
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Emergency Contact ── */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground -mt-2">
                This information may be used by your care team in an urgent situation.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="eName">
                  Full name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="eName"
                  value={emergency.name}
                  onChange={(e) => setEmergency({ ...emergency, name: e.target.value })}
                  placeholder="Jane Mitchell"
                  className={cn(errors.emergencyName && "border-destructive")}
                />
                {errors.emergencyName && <p className="text-xs text-destructive">{errors.emergencyName}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eRel">
                  Relationship <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="eRel"
                  value={emergency.relationship}
                  onChange={(e) => setEmergency({ ...emergency, relationship: e.target.value })}
                  placeholder="Spouse, parent, sibling…"
                  className={cn(errors.emergencyRelationship && "border-destructive")}
                />
                {errors.emergencyRelationship && <p className="text-xs text-destructive">{errors.emergencyRelationship}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ePhone">
                  Phone number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ePhone"
                  type="tel"
                  value={emergency.phone}
                  onChange={(e) => setEmergency({ ...emergency, phone: e.target.value })}
                  placeholder="(403) 555-0100"
                  className={cn(errors.emergencyPhone && "border-destructive")}
                />
                {errors.emergencyPhone && <p className="text-xs text-destructive">{errors.emergencyPhone}</p>}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <Button variant="outline" onClick={back} className="flex-1">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button onClick={next} className={cn("flex-1", step === 0 && "w-full")}>
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex-1">
                Complete setup
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          You can update this information anytime in your profile.
        </p>
      </div>
    </div>
  );
}
