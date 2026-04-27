import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface PreChartFormData {
  appointmentDate: string;
  appointmentType: "Virtual" | "In-person";
  jointUnderReview: string[];
  appointmentNumber: string;
  interpreterRequired: "No" | "Yes";
  interpreterLanguage: string;
  supportPersonAttending: "No" | "Yes";
  nurseName: string;
  nurseDateTime: string;
  heightCm: string;
  weightKg: string;
  bmi: string;
  bpSystolic: string;
  bpDiastolic: string;
  heartRate: string;
  temperature: string;
  oxygenSaturation: string;
  painRest: string;
  painMovement: string;
  mobilityAid: string;
  medicationsReviewed: "Yes" | "No";
  medicationChanges: string;
  opioidAnalgesia: "No" | "Yes";
  opioidAdequacy: "Yes" | "Partial" | "No";
  allergyStatus: "Confirmed unchanged" | "Updated" | "Not reviewed";
  allergyNotes: string;
  preCheckInCompleted: "Yes" | "No";
  symptomChange: string;
  redFlagSymptoms: string;
  fallsInPastMonth: "No" | "Yes";
  fallsNumber: string;
  patientAgenda: string;
  imagingReviewed: "Yes" | "No";
  imagingType: string[];
  imagingFindings: string;
  klGrade: string;
  triageScore: string;
  triageBand: "High" | "Medium" | "Low";
  waitlistStatus: string;
  outstandingInvestigations: string;
  outstandingActions: string;
  physicianName: string;
  physicianDateTime: string;
  keyIssues: string;
  plannedDecisions: string[];
  plannedDecisionOther: string;
  escalationConcerns: string;
  medicationsAdjusted: "No" | "Yes";
  medicationAdjustments: string;
  newReferrals: string;
  conservativeManagementPlan: string;
  patientEducation: string[];
  patientEducationOther: string;
}

const STORAGE_KEY_PREFIX = "careq-provider-prechart";

const DEFAULT_PRECHART_DATA: PreChartFormData = {
  appointmentDate: "",
  appointmentType: "Virtual",
  jointUnderReview: [],
  appointmentNumber: "",
  interpreterRequired: "No",
  interpreterLanguage: "",
  supportPersonAttending: "No",
  nurseName: "",
  nurseDateTime: "",
  heightCm: "",
  weightKg: "",
  bmi: "",
  bpSystolic: "",
  bpDiastolic: "",
  heartRate: "",
  temperature: "",
  oxygenSaturation: "",
  painRest: "",
  painMovement: "",
  mobilityAid: "None",
  medicationsReviewed: "Yes",
  medicationChanges: "",
  opioidAnalgesia: "No",
  opioidAdequacy: "Yes",
  allergyStatus: "Confirmed unchanged",
  allergyNotes: "",
  preCheckInCompleted: "Yes",
  symptomChange: "",
  redFlagSymptoms: "",
  fallsInPastMonth: "No",
  fallsNumber: "",
  patientAgenda: "",
  imagingReviewed: "Yes",
  imagingType: [],
  imagingFindings: "",
  klGrade: "",
  triageScore: "",
  triageBand: "Medium",
  waitlistStatus: "Waitlisted",
  outstandingInvestigations: "",
  outstandingActions: "",
  physicianName: "",
  physicianDateTime: "",
  keyIssues: "",
  plannedDecisions: [],
  plannedDecisionOther: "",
  escalationConcerns: "",
  medicationsAdjusted: "No",
  medicationAdjustments: "",
  newReferrals: "",
  conservativeManagementPlan: "",
  patientEducation: [],
  patientEducationOther: "",
};

const PRECHART_SAVED_EVENT = "careq-prechart-saved";

function storageKey(apptId: string) {
  return `${STORAGE_KEY_PREFIX}-${apptId}`;
}

export function loadPreChartFormData(apptId: string): PreChartFormData {
  if (typeof window === "undefined") return DEFAULT_PRECHART_DATA;
  const raw = window.localStorage.getItem(storageKey(apptId));
  if (!raw) return DEFAULT_PRECHART_DATA;
  try {
    return { ...DEFAULT_PRECHART_DATA, ...JSON.parse(raw) } as PreChartFormData;
  } catch {
    return DEFAULT_PRECHART_DATA;
  }
}

export function savePreChartFormData(apptId: string, data: PreChartFormData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(apptId), JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(PRECHART_SAVED_EVENT, { detail: { apptId } }));
}

export function usePreChartFormData(apptId: string) {
  const [formData, setFormData] = useState<PreChartFormData>(() => loadPreChartFormData(apptId));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(loadPreChartFormData(apptId));
    setSaved(false);
  }, [apptId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSavedEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ apptId: string }>;
      if (customEvent.detail?.apptId === apptId) {
        setFormData(loadPreChartFormData(apptId));
        setSaved(false);
      }
    };

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === storageKey(apptId)) {
        setFormData(loadPreChartFormData(apptId));
        setSaved(false);
      }
    };

    window.addEventListener(PRECHART_SAVED_EVENT, handleSavedEvent as EventListener);
    window.addEventListener("storage", handleStorageEvent);
    return () => {
      window.removeEventListener(PRECHART_SAVED_EVENT, handleSavedEvent as EventListener);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [apptId]);

  const update = useCallback((partial: Partial<PreChartFormData>) => {
    setFormData((current) => ({ ...current, ...partial }));
  }, []);

  const save = useCallback(() => {
    savePreChartFormData(apptId, formData);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  }, [apptId, formData]);

  return { formData, update, save, saved };
}

const jointOptions = ["Left Hip", "Right Hip", "Left Knee", "Right Knee"];
const mobilityOptions = ["None", "Single cane", "Bilateral canes", "Crutch(es)", "Walker", "Wheelchair"];
const imagingOptions = ["X-ray", "MRI", "CT", "Ultrasound"];
const triageBands: PreChartFormData["triageBand"][] = ["High", "Medium", "Low"];
const waitlistStatusOptions = ["Not yet listed", "Waitlisted", "Booked", "Other"];
const plannedDecisionOptions = [
  "Continue current management plan",
  "Adjust medications",
  "Order new investigations",
  "Refer to additional services",
  "Re-triage / reassess waitlist status",
  "Discuss surgical readiness",
  "Other",
];
const patientEducationOptions = [
  "Condition and disease progression",
  "Surgical options and risks",
  "Pre-habilitation exercises",
  "Weight management",
  "Medication use",
  "When to seek urgent care",
  "Other",
];

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border/70 bg-muted/40 p-4">
      <h2 className="text-sm font-semibold font-display tracking-tight mb-3">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function CheckboxGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 rounded-lg border border-border/70 bg-white/70 px-3 py-2 text-sm text-foreground hover:bg-primary/5 transition-colors">
          <Checkbox checked={selected.includes(option)} onCheckedChange={() => onToggle(option)} />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

function RadioGroup<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="min-w-0">
      <Label className="text-sm font-medium font-display">{label}</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-md px-3 py-1.5 text-sm border transition-all ${value === option ? "bg-primary text-white border-primary" : "bg-background text-foreground border-border hover:border-primary/70"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="min-w-0">
      <Label className="text-sm font-medium font-display">{label}</Label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </div>
  );
}

export function PreChartForm({
  apptId,
  patientName,
}: {
  apptId: string;
  patientName: string;
}) {
  const { formData, update, save, saved } = usePreChartFormData(apptId);

  const toggleArrayItem = useCallback((key: keyof PreChartFormData, value: string) => {
    const current = formData[key] as unknown as string[];
    if (!Array.isArray(current)) return;
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    update({ [key]: next } as Partial<PreChartFormData>);
  }, [formData, update]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/70 bg-white/80 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Pre-charting form for</p>
            <p className="text-lg font-semibold text-foreground">{patientName}</p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-foreground">
            <span>Status</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${saved ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
              {saved ? "Saved" : "Draft"}
            </span>
          </div>
        </div>
      </div>

      <FormSection title="Patient summary">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="min-w-0">
            <Label className="text-sm font-medium font-display">Appointment date</Label>
            <DatePicker
              value={formData.appointmentDate}
              onChange={(value) => update({ appointmentDate: value })}
              placeholder="Select appointment date"
              className="mt-2"
            />
          </div>
          <div className="min-w-0">
            <RadioGroup
              label="Appointment type"
              name="appointmentType"
              options={["Virtual", "In-person"]}
              value={formData.appointmentType}
              onChange={(value) => update({ appointmentType: value })}
            />
          </div>
          <div className="min-w-0">
            <TextField
              label="Appointment number in CareQ pathway"
              value={formData.appointmentNumber}
              onChange={(value) => update({ appointmentNumber: value })}
              placeholder="Initial, 3-month, etc."
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium font-display">Joint under review</Label>
            <CheckboxGroup
              options={jointOptions}
              selected={formData.jointUnderReview}
              onToggle={(value) => toggleArrayItem("jointUnderReview", value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="min-w-0">
              <RadioGroup
                label="Interpreter required?"
                name="interpreterRequired"
                options={["No", "Yes"]}
                value={formData.interpreterRequired}
                onChange={(value) => update({ interpreterRequired: value })}
              />
            </div>
            <div className="min-w-0">
              <TextField
                label="Interpreter language"
                value={formData.interpreterLanguage}
                onChange={(value) => update({ interpreterLanguage: value })}
                placeholder="If yes, language"
              />
            </div>
            <div className="min-w-0">
              <RadioGroup
                label="Support person attending?"
                name="supportPersonAttending"
                options={["No", "Yes"]}
                value={formData.supportPersonAttending}
                onChange={(value) => update({ supportPersonAttending: value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TextField
              label="Nurse completing pre-chart"
              value={formData.nurseName}
              onChange={(value) => update({ nurseName: value })}
              placeholder="Nurse name"
            />
            <div>
              <Label className="text-sm font-medium font-display">Nurse pre-chart date</Label>
              <DatePicker
                value={formData.nurseDateTime}
                onChange={(value) => update({ nurseDateTime: value })}
                placeholder="Select nurse pre-chart date"
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Vital signs & anthropometrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TextField label="Height (cm)" value={formData.heightCm} onChange={(value) => update({ heightCm: value })} />
          <TextField label="Weight (kg)" value={formData.weightKg} onChange={(value) => update({ weightKg: value })} />
          <TextField label="BMI" value={formData.bmi} onChange={(value) => update({ bmi: value })} />
          <TextField label="Mobility aid observed" value={formData.mobilityAid} onChange={(value) => update({ mobilityAid: value })} placeholder="None, cane, walker..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TextField label="BP systolic" value={formData.bpSystolic} onChange={(value) => update({ bpSystolic: value })} placeholder="mmHg" />
          <TextField label="BP diastolic" value={formData.bpDiastolic} onChange={(value) => update({ bpDiastolic: value })} placeholder="mmHg" />
          <TextField label="Heart rate" value={formData.heartRate} onChange={(value) => update({ heartRate: value })} placeholder="bpm" />
          <TextField label="Oxygen saturation" value={formData.oxygenSaturation} onChange={(value) => update({ oxygenSaturation: value })} placeholder="%" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Temperature (°C)" value={formData.temperature} onChange={(value) => update({ temperature: value })} />
          <TextField label="Pain score at rest (0–10)" value={formData.painRest} onChange={(value) => update({ painRest: value })} />
          <TextField label="Pain score with movement (0–10)" value={formData.painMovement} onChange={(value) => update({ painMovement: value })} />
        </div>
      </FormSection>

      <FormSection title="Medication reconciliation">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RadioGroup
            label="Medications reviewed against last visit record?"
            name="medicationsReviewed"
            options={["Yes", "No"]}
            value={formData.medicationsReviewed}
            onChange={(value) => update({ medicationsReviewed: value })}
          />
          <RadioGroup
            label="Patient currently on opioid analgesia?"
            name="opioidAnalgesia"
            options={["No", "Yes"]}
            value={formData.opioidAnalgesia}
            onChange={(value) => update({ opioidAnalgesia: value })}
          />
          <RadioGroup
            label="Allergy status"
            name="allergyStatus"
            options={["Confirmed unchanged", "Updated", "Not reviewed"]}
            value={formData.allergyStatus}
            onChange={(value) => update({ allergyStatus: value })}
          />
        </div>
        <Textarea
          value={formData.medicationChanges}
          onChange={(event) => update({ medicationChanges: event.target.value })}
          placeholder="Any changes since last visit? Describe medication additions, stops, or dose changes..."
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {formData.opioidAnalgesia === "Yes" && (
          <RadioGroup
            label="Opioid adequacy"
            name="opioidAdequacy"
            options={["Yes", "Partial", "No"]}
            value={formData.opioidAdequacy}
            onChange={(value) => update({ opioidAdequacy: value })}
          />
        )}
        <Textarea
          value={formData.allergyNotes}
          onChange={(event) => update({ allergyNotes: event.target.value })}
          placeholder="Allergy updates or new allergy details..."
          rows={2}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </FormSection>

      <FormSection title="Pre-appointment check-in review">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RadioGroup
            label="Patient completed pre-appointment check-in?"
            name="preCheckInCompleted"
            options={["Yes", "No"]}
            value={formData.preCheckInCompleted}
            onChange={(value) => update({ preCheckInCompleted: value })}
          />
          <RadioGroup
            label="Falls in past month?"
            name="fallsInPastMonth"
            options={["No", "Yes"]}
            value={formData.fallsInPastMonth}
            onChange={(value) => update({ fallsInPastMonth: value })}
          />
          <TextField label="Number of falls" value={formData.fallsNumber} onChange={(value) => update({ fallsNumber: value })} placeholder="If yes" />
        </div>
        <Textarea
          value={formData.symptomChange}
          onChange={(event) => update({ symptomChange: event.target.value })}
          placeholder="Summary of symptom change, flags, and patient-reported agenda..."
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <Textarea
          value={formData.patientAgenda}
          onChange={(event) => update({ patientAgenda: event.target.value })}
          placeholder="Patient's stated agenda for today's appointment..."
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </FormSection>

      <FormSection title="Chart review summary">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RadioGroup
            label="Imaging reviewed this visit?"
            name="imagingReviewed"
            options={["Yes", "No"]}
            value={formData.imagingReviewed}
            onChange={(value) => update({ imagingReviewed: value })}
          />
          <TextField label="Kellgren-Lawrence / OA grade" value={formData.klGrade} onChange={(value) => update({ klGrade: value })} placeholder="0–4" />
          <TextField label="Triage score" value={formData.triageScore} onChange={(value) => update({ triageScore: value })} placeholder="0–100" />
        </div>
        <div>
          <Label className="text-sm font-medium font-display">Imaging type reviewed</Label>
          <CheckboxGroup
            options={imagingOptions}
            selected={formData.imagingType}
            onToggle={(value) => toggleArrayItem("imagingType", value)}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RadioGroup
            label="Triage band"
            name="triageBand"
            options={triageBands}
            value={formData.triageBand}
            onChange={(value) => update({ triageBand: value })}
          />
          <RadioGroup
            label="Waitlist status"
            name="waitlistStatus"
            options={waitlistStatusOptions as any}
            value={formData.waitlistStatus as any}
            onChange={(value) => update({ waitlistStatus: value })}
          />
        </div>
        <Textarea
          value={formData.imagingFindings}
          onChange={(event) => update({ imagingFindings: event.target.value })}
          placeholder="Key imaging findings or radiographic summary..."
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <Textarea
          value={formData.outstandingInvestigations}
          onChange={(event) => update({ outstandingInvestigations: event.target.value })}
          placeholder="Outstanding investigations or referrals..."
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <Textarea
          value={formData.outstandingActions}
          onChange={(event) => update({ outstandingActions: event.target.value })}
          placeholder="Outstanding actions from last visit..."
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </FormSection>

      <FormSection title="Physician pre-chart notes">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TextField label="Physician completing pre-chart" value={formData.physicianName} onChange={(value) => update({ physicianName: value })} />
          <div>
            <Label className="text-sm font-medium font-display">Physician pre-chart date</Label>
            <DatePicker
              value={formData.physicianDateTime}
              onChange={(value) => update({ physicianDateTime: value })}
              placeholder="Select physician pre-chart date"
              className="mt-2"
            />
          </div>
        </div>
        <Textarea
          value={formData.keyIssues}
          onChange={(event) => update({ keyIssues: event.target.value })}
          placeholder="Key issues to address today..."
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <div>
          <Label className="text-sm font-medium font-display">Planned clinical decisions</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {plannedDecisionOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 rounded-lg border border-border/70 bg-white/70 px-3 py-2 text-sm">
                <Checkbox
                  checked={formData.plannedDecisions.includes(option)}
                  onCheckedChange={() => toggleArrayItem("plannedDecisions", option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {formData.plannedDecisions.includes("Other") && (
            <Textarea
              value={formData.plannedDecisionOther}
              onChange={(event) => update({ plannedDecisionOther: event.target.value })}
              placeholder="Other planned clinical decisions..."
              rows={2}
              className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          )}
        </div>
        <Textarea
          value={formData.escalationConcerns}
          onChange={(event) => update({ escalationConcerns: event.target.value })}
          placeholder="Escalation concerns or flags prior to appointment..."
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </FormSection>

      <FormSection title="Management plan">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RadioGroup
            label="Medications adjusted?"
            name="medicationsAdjusted"
            options={["No", "Yes"]}
            value={formData.medicationsAdjusted}
            onChange={(value) => update({ medicationsAdjusted: value })}
          />
          <TextField
            label="New referrals or investigations ordered"
            value={formData.newReferrals}
            onChange={(value) => update({ newReferrals: value })}
            placeholder="Physiotherapy, imaging, social work, etc."
          />
        </div>
        <Textarea
          value={formData.medicationAdjustments}
          onChange={(event) => update({ medicationAdjustments: event.target.value })}
          placeholder="Medication changes or prescription updates..."
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <Textarea
          value={formData.conservativeManagementPlan}
          onChange={(event) => update({ conservativeManagementPlan: event.target.value })}
          placeholder="Conservative management plan..."
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <div>
          <Label className="text-sm font-medium font-display">Patient education provided</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {patientEducationOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 rounded-lg border border-border/70 bg-white/70 px-3 py-2 text-sm">
                <Checkbox
                  checked={formData.patientEducation.includes(option)}
                  onCheckedChange={() => toggleArrayItem("patientEducation", option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {formData.patientEducation.includes("Other") && (
            <Textarea
              value={formData.patientEducationOther}
              onChange={(event) => update({ patientEducationOther: event.target.value })}
              placeholder="Other education topics..."
              rows={2}
              className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          )}
        </div>
      </FormSection>

      <div className="flex justify-end">
        <Button onClick={save} className="gap-2">
          {saved ? "Saved" : "Save pre-chart"}
        </Button>
      </div>
    </div>
  );
}
