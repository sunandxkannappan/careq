
import { useState, useCallback } from "react";
import { ProviderLayout } from "@/provider/components/ProviderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Trash2,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// ─── Types ──────────────────────────────────────────────────

interface AllergyEntry { allergy: string; reaction: string }
interface SurgeryEntry { what: string; when: string; location: string }
interface TestEntry { name: string; checked: boolean; date: string; location: string }
interface FamilyEntry { who: string; what: string }
interface SpecialistEntry { type: string; name: string; date: string; location: string }
interface MedicationEntry { name: string; dose: string; timeOfDay: string }

interface FormData {
  // Step 1 — Patient registration (Instrument 1)
  patientName: string;
  legalFirstName: string;
  legalLastName: string;
  preferredName: string;
  birthdate: string;
  sexAssignedAtBirth: "male" | "female" | "intersex" | "prefer-not-to-say" | "";
  genderIdentity: "man" | "woman" | "non-binary" | "prefer-not-to-say" | "self-describe" | "";
  genderIdentityOther: string;
  healthCareNumber: string;
  addressStreet: string;
  addressCity: string;
  addressProvince: string;
  addressPostalCode: string;
  primaryPhone: string;
  contactMethod: "phone" | "sms" | "email" | "portal" | "";
  email: string;
  preferredLanguage: "english" | "french" | "other" | "";
  preferredLanguageOther: string;
  interpreterRequired: "yes" | "no" | "";
  interpreterLanguage: string;

  // Step 1 continued — Emergency contact
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactIsSDM: "yes" | "no" | "";
  directiveStatus: "yes" | "no" | "in-progress" | "";

  // Step 1 continued — Referring clinician & care team
  referringPhysicianName: string;
  referringClinic: string;
  referringPhysicianPhone: string;
  referringPhysicianFax: string;
  referralDate: string;
  hasFamilyPhysician: "yes" | "no" | "";
  familyPhysicianName: string;
  familyPhysicianClinic: string;

  // Step 1 continued — Joint & condition information
  jointHip: boolean;
  jointKnee: boolean;
  jointOther: boolean;
  jointOtherText: string;
  symptomDuration: "<3months" | "3-6months" | "6-12months" | "1-2years" | "more-2years" | "";
  priorJointSurgery: "yes" | "no" | "";
  priorJointSurgeryDetails: string;
  imagingNo: boolean;
  imagingXray: boolean;
  imagingMRI: boolean;
  imagingCT: boolean;
  imagingUltrasound: boolean;
  imagingWhereWhen: string;
  side: string;
  previousInjuries: string;
  walkingAid: string;
  walkingDistance: string;
  painWakesSleep: string;
  limitedActivities: string;

  // Step 3 — Pain management
  triedPhysiotherapy: boolean;
  triedBracing: boolean;
  triedAntiInflammatories: boolean;
  antiInflammatoriesDetails: string;
  triedOtherPainMed: boolean;
  otherPainMedDetails: string;
  triedInjections: boolean;
  injectionsDetails: string;
  triedOther: boolean;
  otherDetails: string;

  // Step 4 — Allergies
  allergies: AllergyEntry[];
  metalAllergy: string;
  latexAllergy: string;

  // Step 5 — Past surgical history
  surgeries: SurgeryEntry[];

  imagingNo: boolean;
  imagingXray: boolean;
  imagingMRI: boolean;
  imagingCT: boolean;
  imagingUltrasound: boolean;
  imagingWhereWhen: string;

  // Step 6 — Previous tests
  tests: TestEntry[];

  // Step 7 — Social history
  tobaccoUse: string;
  tobaccoQuitDate: string;
  tobaccoYears: string;
  tobaccoAmountPerDay: string;
  tobaccoTypes: { cigarettes: boolean; cigars: boolean; vape: boolean; chew: boolean };
  alcoholUse: string;
  alcoholDrinksPerWeek: string;
  alcoholTypes: { beer: boolean; wine: boolean; liquor: boolean };
  drugUse: string;
  language: string;
  languageOther: string;
  personalDirective: string;
  medicalConditions: {
    diabetes: boolean;
    highBloodPressure: boolean;
    heartDisease: boolean;
    stroke: boolean;
    kidneyDisease: boolean;
    lungDisease: boolean;
    bloodClots: boolean;
    cancer: boolean;
    obesity: boolean;
    mentalHealth: boolean;
    rheumatoidArthritis: boolean;
    osteoporosis: boolean;
    none: boolean;
  };
  currentMedications: string;
  knownAllergies: string;
  smokingStatus: "no" | "yes" | "former" | "";
  smokingPacksPerDay: string;
  smokingQuitDate: string;
  alcoholRegular: "yes" | "no" | "";
  alcoholDrinksPerWeek: string;

  // Step 8 — Social & logistical
  livingLocation: "city" | "town" | "remote" | "";
  caregiverHelp: "yes" | "no" | "unsure" | "";
  transportationReliable: "yes" | "no" | "sometimes" | "";
  employmentStatus: "full-time" | "part-time" | "no" | "retired" | "prefer-not-to-say" | "";
  surgeryBarrier: "no" | "yes" | "";
  surgeryBarrierDetails: string;

  // Step 9 — Consent & privacy
  consentData: "yes" | "no" | "";
  consentElectronic: "yes" | "no" | "";
  consentShare: "yes" | "no" | "";
  signature: string;
  signatureDate: string;
  completedByName: string;
  completedByRelationship: string;

  // Step 8 — Family & anesthetic
  familyHistory: FamilyEntry[];
  anestheticGeneral: boolean;
  anestheticSpinal: boolean;
  anestheticLocal: boolean;
  anestheticComplications: boolean;
  anestheticNausea: boolean;

  // Step 9 — Specialist assessments
  specialists: SpecialistEntry[];

  // Step 10 — Support & fall risk
  supportName: string;
  supportRelationship: string;
  supportPhone: string;
  liveAlone: string;
  caregiverAfterSurgery: string;
  caregiverDuration: string;
  fallHistory: string;
  fallDates: string;
  fallInjuries: string;
  fallInjuryDetails: string;
  dizzyOnStanding: string;

  // Step 11 — Review of symptoms
  symptoms: Record<string, boolean>;
  symptomsO2AtHome: string;
  symptomsCpap: boolean;
  diabetesType: string;
  diabetesInsulin: string;
  cancerSelfDates: string;
  cancerTreatment: string;
  cortisoneWhen: string;
  cortisoneWhere: string;

  // Step 12 — Other questions & medications
  confusionAfterAnesthetic: string;
  heartBreathingWalking: string;
  heartBreathingStairs: string;
  antibioticResistant: string;
  communicableDisease: string;
  recentWeightLoss: string;
  weightLossAmount: string;
  decreasedAppetite: string;
  visionProblems: string;
  visionAids: string;
  hearingProblems: string;
  hearingAids: string;
  dentalFullDentures: boolean;
  dentalLastExam: string;
  dentalCaps: boolean;
  dentalBridgework: boolean;
  motionSickness: string;
  fluVaccine: string;
  fluVaccineWhen: string;
  pneumoniaVaccine: string;
  pneumoniaVaccineWhen: string;
  covidVaccine: string;
  covidVaccineWhen: string;
  medications: MedicationEntry[];
}

const INITIAL_TESTS: TestEntry[] = [
  { name: "Exercise stress test (treadmill)", checked: false, date: "", location: "" },
  { name: "Thallium (nuclear medicine)", checked: false, date: "", location: "" },
  { name: "Heart catheterization (angiogram)", checked: false, date: "", location: "" },
  { name: "ECHO (heart ultrasound)", checked: false, date: "", location: "" },
  { name: "Holter monitor", checked: false, date: "", location: "" },
  { name: "ECG", checked: false, date: "", location: "" },
  { name: "Pulmonary function", checked: false, date: "", location: "" },
  { name: "Chest x-ray", checked: false, date: "", location: "" },
  { name: "Sleep Study", checked: false, date: "", location: "" },
];

const DEFAULT_SPECIALISTS: SpecialistEntry[] = [
  { type: "Cardiologist", name: "", date: "", location: "" },
  { type: "Neurologist", name: "", date: "", location: "" },
  { type: "Pulmonologist", name: "", date: "", location: "" },
];

const STEPS = [
  "Instrument 1 — Patient Registration",
  "Joint Information",
  "Pain Management",
  "Allergies",
  "Surgical History",
  "Previous Tests",
  "Social History",
  "Family & Anesthetic",
  "Specialist Assessments",
  "Support & Fall Risk",
  "Review of Symptoms",
  "Other Questions & Medications",
];

function getInitialFormData(): FormData {
  return {
    patientName: "", legalFirstName: "", legalLastName: "", preferredName: "", birthdate: "", sexAssignedAtBirth: "", genderIdentity: "", genderIdentityOther: "", healthCareNumber: "",
    addressStreet: "", addressCity: "", addressProvince: "", addressPostalCode: "", primaryPhone: "", contactMethod: "", email: "", preferredLanguage: "", preferredLanguageOther: "", interpreterRequired: "", interpreterLanguage: "",
    emergencyContactName: "", emergencyContactRelationship: "", emergencyContactPhone: "", emergencyContactIsSDM: "", directiveStatus: "",
    referringPhysicianName: "", referringClinic: "", referringPhysicianPhone: "", referringPhysicianFax: "", referralDate: "", hasFamilyPhysician: "", familyPhysicianName: "", familyPhysicianClinic: "",
    jointHip: false, jointKnee: false, jointOther: false, jointOtherText: "", symptomDuration: "", priorJointSurgery: "", priorJointSurgeryDetails: "", imagingNo: false, imagingXray: false, imagingMRI: false, imagingCT: false, imagingUltrasound: false, imagingWhereWhen: "",
    side: "", previousInjuries: "", walkingAid: "", walkingDistance: "", painWakesSleep: "", limitedActivities: "",
    triedPhysiotherapy: false, triedBracing: false,
    triedAntiInflammatories: false, antiInflammatoriesDetails: "",
    triedOtherPainMed: false, otherPainMedDetails: "",
    triedInjections: false, injectionsDetails: "",
    triedOther: false, otherDetails: "",
    allergies: [{ allergy: "", reaction: "" }],
    metalAllergy: "", latexAllergy: "",
    surgeries: [{ what: "", when: "", location: "" }],
    tests: [...INITIAL_TESTS],
    tobaccoUse: "", tobaccoQuitDate: "", tobaccoYears: "", tobaccoAmountPerDay: "",
    tobaccoTypes: { cigarettes: false, cigars: false, vape: false, chew: false },
    imagingNo: false, imagingXray: false, imagingMRI: false, imagingCT: false, imagingUltrasound: false, imagingWhereWhen: "",
    alcoholUse: "", alcoholDrinksPerWeek: "",
    alcoholTypes: { beer: false, wine: false, liquor: false },
    drugUse: "", language: "english", languageOther: "", personalDirective: "",
    medicalConditions: { diabetes: false, highBloodPressure: false, heartDisease: false, stroke: false, kidneyDisease: false, lungDisease: false, bloodClots: false, cancer: false, obesity: false, mentalHealth: false, rheumatoidArthritis: false, osteoporosis: false, none: false },
    currentMedications: "", knownAllergies: "", smokingStatus: "", smokingPacksPerDay: "", smokingQuitDate: "", alcoholRegular: "", alcoholDrinksPerWeek: "",
    livingLocation: "", caregiverHelp: "", transportationReliable: "", employmentStatus: "", surgeryBarrier: "", surgeryBarrierDetails: "",
    consentData: "", consentElectronic: "", consentShare: "", signature: "", signatureDate: "", completedByName: "", completedByRelationship: "",
    familyHistory: [{ who: "", what: "" }],
    anestheticGeneral: false, anestheticSpinal: false, anestheticLocal: false,
    anestheticComplications: false, anestheticNausea: false,
    specialists: [...DEFAULT_SPECIALISTS],
    supportName: "", supportRelationship: "", supportPhone: "",
    liveAlone: "", caregiverAfterSurgery: "", caregiverDuration: "",
    fallHistory: "", fallDates: "", fallInjuries: "", fallInjuryDetails: "", dizzyOnStanding: "",
    symptoms: {},
    symptomsO2AtHome: "", symptomsCpap: false,
    diabetesType: "", diabetesInsulin: "",
    cancerSelfDates: "", cancerTreatment: "",
    cortisoneWhen: "", cortisoneWhere: "",
    confusionAfterAnesthetic: "", heartBreathingWalking: "", heartBreathingStairs: "",
    antibioticResistant: "", communicableDisease: "",
    recentWeightLoss: "", weightLossAmount: "", decreasedAppetite: "",
    visionProblems: "", visionAids: "", hearingProblems: "", hearingAids: "",
    dentalFullDentures: false, dentalLastExam: "", dentalCaps: false, dentalBridgework: false,
    motionSickness: "",
    fluVaccine: "", fluVaccineWhen: "",
    pneumoniaVaccine: "", pneumoniaVaccineWhen: "",
    covidVaccine: "", covidVaccineWhen: "",
    medications: [{ name: "", dose: "", timeOfDay: "" }],
  };
}

// ─── Reusable sub-components (senior-friendly: large targets) ─────

function BigRadioOption({ value, label, selected, onSelect }: {
  value: string; label: string; selected: boolean; onSelect: (v: string) => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => onSelect(value)}
          className={cn(
            "w-full min-w-0 flex items-center gap-3 px-4 py-3.5 rounded-lg border-2 transition-all text-left min-h-[52px]",
            "text-[15px] font-medium",
            selected
              ? "border-primary bg-primary/5 text-primary"
              : "border-border bg-white text-foreground hover:border-primary/30 hover:bg-muted/30"
          )}
        >
          <div className={cn(
            "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors",
            selected ? "border-primary bg-primary" : "border-muted-foreground/40"
          )}>
            {selected && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <span className="min-w-0 overflow-hidden line-clamp-2">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-center bg-primary text-white border-primary">{label}</TooltipContent>
    </Tooltip>
  );
}

function BigCheckbox({ checked, onCheckedChange, label, id }: {
  checked: boolean; onCheckedChange: (v: boolean) => void; label: string; id: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => onCheckedChange(!checked)}
          className={cn(
            "w-full min-w-0 flex items-center gap-3 px-4 py-3.5 rounded-lg border-2 transition-all text-left min-h-[52px]",
            "text-[15px] font-medium",
            checked
              ? "border-primary bg-primary/5 text-primary"
              : "border-border bg-white text-foreground hover:border-primary/30 hover:bg-muted/30"
          )}
        >
          <div className={cn(
            "w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors",
            checked ? "border-primary bg-primary" : "border-muted-foreground/40"
          )}>
            {checked && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className="min-w-0 overflow-hidden line-clamp-2">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-center bg-primary text-white border-primary">{label}</TooltipContent>
    </Tooltip>
  );
}

function YesNoToggle({ value, onChange, label }: {
  value: string; onChange: (v: string) => void; label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-muted-foreground mr-1">{label}</span>}
      <button
        type="button"
        onClick={() => onChange("no")}
        className={cn(
          "px-5 py-2.5 rounded-l-lg border-2 border-r-0 text-[15px] font-medium transition-all min-h-[44px]",
          value === "no"
            ? "border-primary bg-primary/5 text-primary"
            : "border-border text-muted-foreground hover:bg-muted/30"
        )}
      >No</button>
      <button
        type="button"
        onClick={() => onChange("yes")}
        className={cn(
          "px-5 py-2.5 rounded-r-lg border-2 text-[15px] font-medium transition-all min-h-[44px]",
          value === "yes"
            ? "border-primary bg-primary/5 text-primary"
            : "border-border text-muted-foreground hover:bg-muted/30"
        )}
      >Yes</button>
    </div>
  );
}

function FormField({ label, required, children, hint }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[15px] font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {hint && <p className="text-sm text-muted-foreground -mt-1">{hint}</p>}
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold font-display tracking-tight text-foreground">
      {children}
    </h3>
  );
}

function BigInput({ ...props }: React.ComponentProps<typeof Input>) {
  return <Input {...props} className={cn("h-12 text-[15px] px-4", props.className)} />;
}

function BigTextarea({ ...props }: React.ComponentProps<typeof Textarea>) {
  return <Textarea {...props} className={cn("text-[15px] px-4 py-3 min-h-[100px]", props.className)} />;
}

// ─── Step components ───────────────────────────────────────

function Step1({ d, u }: { d: FormData; u: (p: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          Instrument 1 is completed once at registration. Please fill out all sections to help your care team onboard you safely.
        </p>
      </div>

      <div className="space-y-6">
        <SectionHeading>Part 1 — Personal Information</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Legal First Name" required>
            <BigInput value={d.legalFirstName} onChange={e => u({ legalFirstName: e.target.value })} placeholder="First name" />
          </FormField>
          <FormField label="Legal Last Name" required>
            <BigInput value={d.legalLastName} onChange={e => u({ legalLastName: e.target.value })} placeholder="Last name" />
          </FormField>
        </div>
        <FormField label="Preferred Name (if different)">
          <BigInput value={d.preferredName} onChange={e => u({ preferredName: e.target.value })} placeholder="Nickname or preferred name" />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Date of Birth" required>
            <DatePicker value={d.birthdate} onChange={v => u({ birthdate: v })} placeholder="Select date of birth" />
          </FormField>
          <FormField label="Alberta Personal Health Number (PHN)" required>
            <BigInput value={d.healthCareNumber} onChange={e => u({ healthCareNumber: e.target.value })} placeholder="PHN" />
          </FormField>
        </div>

        <FormField label="Sex assigned at birth">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "intersex", label: "Intersex" },
              { value: "prefer-not-to-say", label: "Prefer not to say" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.sexAssignedAtBirth === option.value}
                onSelect={v => u({ sexAssignedAtBirth: v })}
              />
            ))}
          </div>
        </FormField>

        <FormField label="Gender identity">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "man", label: "Man" },
              { value: "woman", label: "Woman" },
              { value: "non-binary", label: "Non-binary" },
              { value: "prefer-not-to-say", label: "Prefer not to say" },
              { value: "self-describe", label: "Prefer to self-describe" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.genderIdentity === option.value}
                onSelect={v => u({ genderIdentity: v })}
              />
            ))}
          </div>
          {d.genderIdentity === "self-describe" && (
            <BigInput value={d.genderIdentityOther} onChange={e => u({ genderIdentityOther: e.target.value })} placeholder="Self-described gender identity" className="mt-3" />
          )}
        </FormField>
      </div>

      <Separator />

      <div className="space-y-6">
        <SectionHeading>Part 2 — Contact Information</SectionHeading>
        <FormField label="Home Address">
          <BigInput value={d.addressStreet} onChange={e => u({ addressStreet: e.target.value })} placeholder="Street address" />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="City">
            <BigInput value={d.addressCity} onChange={e => u({ addressCity: e.target.value })} placeholder="City" />
          </FormField>
          <FormField label="Province">
            <BigInput value={d.addressProvince} onChange={e => u({ addressProvince: e.target.value })} placeholder="Province" />
          </FormField>
          <FormField label="Postal Code">
            <BigInput value={d.addressPostalCode} onChange={e => u({ addressPostalCode: e.target.value })} placeholder="Postal code" />
          </FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Primary Phone">
            <BigInput type="tel" value={d.primaryPhone} onChange={e => u({ primaryPhone: e.target.value })} placeholder="Phone number" />
          </FormField>
          <FormField label="Email Address">
            <BigInput type="email" value={d.email} onChange={e => u({ email: e.target.value })} placeholder="Email address" />
          </FormField>
        </div>
        <FormField label="Preferred contact method">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { value: "phone", label: "Phone call" },
              { value: "sms", label: "SMS/Text" },
              { value: "email", label: "Email" },
              { value: "portal", label: "Portal notification" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.contactMethod === option.value}
                onSelect={v => u({ contactMethod: v })}
              />
            ))}
          </div>
        </FormField>
        <FormField label="Preferred language">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "english", label: "English" },
              { value: "french", label: "French" },
              { value: "other", label: "Other" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.preferredLanguage === option.value}
                onSelect={v => u({ preferredLanguage: v })}
              />
            ))}
          </div>
          {d.preferredLanguage === "other" && (
            <BigInput value={d.preferredLanguageOther} onChange={e => u({ preferredLanguageOther: e.target.value })} placeholder="Preferred language" className="mt-3" />
          )}
        </FormField>
        <FormField label="Interpreter required">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.interpreterRequired === option.value}
                onSelect={v => u({ interpreterRequired: v })}
              />
            ))}
          </div>
          {d.interpreterRequired === "yes" && (
            <BigInput value={d.interpreterLanguage} onChange={e => u({ interpreterLanguage: e.target.value })} placeholder="Interpreter language" className="mt-3" />
          )}
        </FormField>
      </div>

      <Separator />

      <div className="space-y-6">
        <SectionHeading>Part 3 — Emergency Contact & Substitute Decision Maker</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Emergency Contact Name">
            <BigInput value={d.emergencyContactName} onChange={e => u({ emergencyContactName: e.target.value })} placeholder="Contact name" />
          </FormField>
          <FormField label="Relationship">
            <BigInput value={d.emergencyContactRelationship} onChange={e => u({ emergencyContactRelationship: e.target.value })} placeholder="Relationship" />
          </FormField>
          <FormField label="Phone">
            <BigInput value={d.emergencyContactPhone} onChange={e => u({ emergencyContactPhone: e.target.value })} placeholder="Contact phone" />
          </FormField>
        </div>
        <FormField label="Is this person also your Substitute Decision Maker (SDM)?">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.emergencyContactIsSDM === option.value}
                onSelect={v => u({ emergencyContactIsSDM: v })}
              />
            ))}
          </div>
        </FormField>
        <FormField label="Do you have a Personal Directive or Enduring Power of Attorney on file?">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
              { value: "in-progress", label: "In progress" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.directiveStatus === option.value}
                onSelect={v => u({ directiveStatus: v })}
              />
            ))}
          </div>
        </FormField>
      </div>

      <Separator />

      <div className="space-y-6">
        <SectionHeading>Part 4 — Referring Clinician & Care Team</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Referring Physician Name">
            <BigInput value={d.referringPhysicianName} onChange={e => u({ referringPhysicianName: e.target.value })} placeholder="Physician name" />
          </FormField>
          <FormField label="Referring Clinic / Practice">
            <BigInput value={d.referringClinic} onChange={e => u({ referringClinic: e.target.value })} placeholder="Clinic or practice" />
          </FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Physician Phone">
            <BigInput value={d.referringPhysicianPhone} onChange={e => u({ referringPhysicianPhone: e.target.value })} placeholder="Phone" />
          </FormField>
          <FormField label="Physician Fax">
            <BigInput value={d.referringPhysicianFax} onChange={e => u({ referringPhysicianFax: e.target.value })} placeholder="Fax" />
          </FormField>
          <FormField label="Date of Referral">
            <DatePicker value={d.referralDate} onChange={v => u({ referralDate: v })} placeholder="Referral date" />
          </FormField>
        </div>
        <FormField label="Do you have a family physician / primary care provider?">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.hasFamilyPhysician === option.value}
                onSelect={v => u({ hasFamilyPhysician: v })}
              />
            ))}
          </div>
          {d.hasFamilyPhysician === "yes" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <FormField label="Family Physician Name">
                <BigInput value={d.familyPhysicianName} onChange={e => u({ familyPhysicianName: e.target.value })} placeholder="Provider name" />
              </FormField>
              <FormField label="Family Physician Clinic">
                <BigInput value={d.familyPhysicianClinic} onChange={e => u({ familyPhysicianClinic: e.target.value })} placeholder="Clinic name" />
              </FormField>
            </div>
          )}
        </FormField>
      </div>

      <Separator />

      <div className="space-y-6">
        <SectionHeading>Part 5 — Joint & Condition Information</SectionHeading>
        <FormField label="Which joint(s) are you being referred for?">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <BigCheckbox id="hip" checked={d.jointHip} onCheckedChange={v => u({ jointHip: v })} label="Left Hip" />
            <BigCheckbox id="knee" checked={d.jointKnee} onCheckedChange={v => u({ jointKnee: v })} label="Right Hip" />
            <BigCheckbox id="other" checked={d.jointOther} onCheckedChange={v => u({ jointOther: v })} label="Other" />
          </div>
          {d.jointOther && (
            <BigInput value={d.jointOtherText} onChange={e => u({ jointOtherText: e.target.value })} placeholder="Please specify" className="mt-3" />
          )}
        </FormField>

        <FormField label="How long have you had symptoms in this joint?">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "<3months", label: "Less than 3 months" },
              { value: "3-6months", label: "3–6 months" },
              { value: "6-12months", label: "6–12 months" },
              { value: "1-2years", label: "1–2 years" },
              { value: "more-2years", label: "More than 2 years" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.symptomDuration === option.value}
                onSelect={v => u({ symptomDuration: v })}
              />
            ))}
          </div>
        </FormField>

        <FormField label="Have you ever had surgery on this joint before?">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes — please describe" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.priorJointSurgery === option.value}
                onSelect={v => u({ priorJointSurgery: v })}
              />
            ))}
          </div>
          {d.priorJointSurgery === "yes" && (
            <BigTextarea value={d.priorJointSurgeryDetails} onChange={e => u({ priorJointSurgeryDetails: e.target.value })} placeholder="Describe previous joint surgery" className="mt-3" />
          )}
        </FormField>

        <FormField label="Have you had imaging done for this joint?">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <BigCheckbox id="imaging-no" checked={d.imagingNo} onCheckedChange={v => u({ imagingNo: v, imagingXray: v ? false : d.imagingXray, imagingMRI: v ? false : d.imagingMRI, imagingCT: v ? false : d.imagingCT, imagingUltrasound: v ? false : d.imagingUltrasound })} label="No" />
            <BigCheckbox id="imaging-xray" checked={d.imagingXray} onCheckedChange={v => u({ imagingXray: v, imagingNo: v ? false : d.imagingNo })} label="X-ray" />
            <BigCheckbox id="imaging-mri" checked={d.imagingMRI} onCheckedChange={v => u({ imagingMRI: v, imagingNo: v ? false : d.imagingNo })} label="MRI" />
            <BigCheckbox id="imaging-ct" checked={d.imagingCT} onCheckedChange={v => u({ imagingCT: v, imagingNo: v ? false : d.imagingNo })} label="CT Scan" />
            <BigCheckbox id="imaging-ultrasound" checked={d.imagingUltrasound} onCheckedChange={v => u({ imagingUltrasound: v, imagingNo: v ? false : d.imagingNo })} label="Ultrasound" />
          </div>
          {(d.imagingXray || d.imagingMRI || d.imagingCT || d.imagingUltrasound) && (
            <BigTextarea value={d.imagingWhereWhen} onChange={e => u({ imagingWhereWhen: e.target.value })} placeholder="If yes, where and when?" className="mt-3" />
          )}
        </FormField>
      </div>

      <Separator />

      <div className="space-y-6">
        <SectionHeading>Part 6 — General Medical History</SectionHeading>
        <p className="text-sm text-muted-foreground">Select all conditions that apply.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: "diabetes", label: "Diabetes (Type 1 or 2)" },
            { key: "highBloodPressure", label: "High blood pressure" },
            { key: "heartDisease", label: "Heart disease or previous heart attack" },
            { key: "stroke", label: "Stroke or TIA" },
            { key: "kidneyDisease", label: "Chronic kidney disease" },
            { key: "lungDisease", label: "Chronic lung disease (COPD, asthma)" },
            { key: "bloodClots", label: "Blood clots (DVT or PE)" },
            { key: "cancer", label: "Active cancer or history of cancer" },
            { key: "obesity", label: "Obesity (BMI > 35)" },
            { key: "mentalHealth", label: "Depression or anxiety disorder" },
            { key: "rheumatoidArthritis", label: "Rheumatoid arthritis or inflammatory arthritis" },
            { key: "osteoporosis", label: "Osteoporosis" },
            { key: "none", label: "None of the above" },
          ].map(option => (
            <BigCheckbox
              key={option.key}
              id={option.key}
              checked={d.medicalConditions[option.key as keyof typeof d.medicalConditions]}
              onCheckedChange={v => u({ medicalConditions: { ...d.medicalConditions, [option.key]: v } })}
              label={option.label}
            />
          ))}
        </div>
        <FormField label="Current medications">
          <BigTextarea value={d.currentMedications} onChange={e => u({ currentMedications: e.target.value })} placeholder="List medications or attach medication list" />
        </FormField>
        <FormField label="Known allergies">
          <BigInput value={d.knownAllergies} onChange={e => u({ knownAllergies: e.target.value })} placeholder="Allergies" />
        </FormField>
        <FormField label="Do you currently smoke?">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes — packs/day" },
              { value: "former", label: "Former smoker" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.smokingStatus === option.value}
                onSelect={v => u({ smokingStatus: v })}
              />
            ))}
          </div>
          {d.smokingStatus === "yes" && (
            <BigInput value={d.smokingPacksPerDay} onChange={e => u({ smokingPacksPerDay: e.target.value })} placeholder="Packs per day" className="mt-3" />
          )}
          {d.smokingStatus === "former" && (
            <BigInput value={d.smokingQuitDate} onChange={e => u({ smokingQuitDate: e.target.value })} placeholder="Quit date" className="mt-3" />
          )}
        </FormField>
        <FormField label="Do you consume alcohol regularly?">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.alcoholRegular === option.value}
                onSelect={v => u({ alcoholRegular: v })}
              />
            ))}
          </div>
          {d.alcoholRegular === "yes" && (
            <BigInput value={d.alcoholDrinksPerWeek} onChange={e => u({ alcoholDrinksPerWeek: e.target.value })} placeholder="Drinks per week" className="mt-3" />
          )}
        </FormField>
      </div>

      <Separator />

      <div className="space-y-6">
        <SectionHeading>Part 7 — Social & Logistical Context</SectionHeading>
        <FormField label="Where do you live?">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "city", label: "Within a city or large town" },
              { value: "town", label: "Small town or rural community" },
              { value: "remote", label: "Remote / very rural" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.livingLocation === option.value}
                onSelect={v => u({ livingLocation: v })}
              />
            ))}
          </div>
        </FormField>
        <FormField label="Do you live alone?">
          <YesNoToggle value={d.liveAlone} onChange={v => u({ liveAlone: v })} />
        </FormField>
        <FormField label="Do you have someone who could help you recover at home after surgery?">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
              { value: "unsure", label: "Unsure" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.caregiverHelp === option.value}
                onSelect={v => u({ caregiverHelp: v })}
              />
            ))}
          </div>
        </FormField>
        <FormField label="Do you have reliable transportation to attend appointments?">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
              { value: "sometimes", label: "Sometimes" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.transportationReliable === option.value}
                onSelect={v => u({ transportationReliable: v })}
              />
            ))}
          </div>
        </FormField>
        <FormField label="Are you currently employed?">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "full-time", label: "Yes, full time" },
              { value: "part-time", label: "Yes, part time" },
              { value: "no", label: "No" },
              { value: "retired", label: "Retired" },
              { value: "prefer-not-to-say", label: "Prefer not to say" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.employmentStatus === option.value}
                onSelect={v => u({ employmentStatus: v })}
              />
            ))}
          </div>
        </FormField>
        <FormField label="Is there anything that might prevent you from having surgery in the next 6 months?">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes — please describe" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.surgeryBarrier === option.value}
                onSelect={v => u({ surgeryBarrier: v })}
              />
            ))}
          </div>
          {d.surgeryBarrier === "yes" && (
            <BigTextarea value={d.surgeryBarrierDetails} onChange={e => u({ surgeryBarrierDetails: e.target.value })} placeholder="Describe any barriers" className="mt-3" />
          )}
        </FormField>
      </div>

      <Separator />

      <div className="space-y-6">
        <SectionHeading>Part 8 — Consent & Privacy</SectionHeading>
        <FormField label="I consent to CareQ collecting, storing, and using my health information for care coordination and waitlist management.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { value: "yes", label: "I agree" },
              { value: "no", label: "I do not agree" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.consentData === option.value}
                onSelect={v => u({ consentData: v })}
              />
            ))}
          </div>
        </FormField>
        <FormField label="I consent to receiving electronic communications from CareQ.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { value: "yes", label: "I agree" },
              { value: "no", label: "I do not agree" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.consentElectronic === option.value}
                onSelect={v => u({ consentElectronic: v })}
              />
            ))}
          </div>
        </FormField>
        <FormField label="I consent to my information being shared with my referring physician and surgical care team.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { value: "yes", label: "I agree" },
              { value: "no", label: "I do not agree" },
            ].map(option => (
              <BigRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                selected={d.consentShare === option.value}
                onSelect={v => u({ consentShare: v })}
              />
            ))}
          </div>
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Signature">
            <BigInput value={d.signature} onChange={e => u({ signature: e.target.value })} placeholder="Your full name" />
          </FormField>
          <FormField label="Date">
            <DatePicker value={d.signatureDate} onChange={v => u({ signatureDate: v })} placeholder="Signature date" />
          </FormField>
        </div>
        <FormField label="If completed on behalf of patient by SDM or caregiver, please indicate name and relationship">
          <BigTextarea value={d.completedByName} onChange={e => u({ completedByName: e.target.value })} placeholder="Name and relationship" />
          <BigInput value={d.completedByRelationship} onChange={e => u({ completedByRelationship: e.target.value })} placeholder="Relationship" className="mt-3" />
        </FormField>
      </div>
    </div>
  );
}

function Step2({ d, u }: { d: FormData; u: (p: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      <FormField label="Which joint(s) are you coming to see us for?">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <BigCheckbox id="hip" checked={d.jointHip} onCheckedChange={v => u({ jointHip: v })} label="Hip" />
          <BigCheckbox id="knee" checked={d.jointKnee} onCheckedChange={v => u({ jointKnee: v })} label="Knee" />
          <BigCheckbox id="other" checked={d.jointOther} onCheckedChange={v => u({ jointOther: v })} label="Other" />
        </div>
        {d.jointOther && (
          <BigInput value={d.jointOtherText} onChange={e => u({ jointOtherText: e.target.value })} placeholder="Please specify..." className="mt-3" />
        )}
      </FormField>

      <FormField label="Which side bothers you more?">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {["Right", "Left", "Both"].map(v => (
            <BigRadioOption key={v} value={v.toLowerCase()} label={v} selected={d.side === v.toLowerCase()} onSelect={v => u({ side: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="Have you had any previous injuries to the affected joint(s)?">
        <BigTextarea value={d.previousInjuries} onChange={e => u({ previousInjuries: e.target.value })} placeholder="Please describe any previous injuries..." />
      </FormField>

      <FormField label="Which walking aids do you currently use?">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["None", "Cane/Stick", "Walker", "Wheelchair"].map(v => (
            <BigRadioOption key={v} value={v.toLowerCase()} label={v} selected={d.walkingAid === v.toLowerCase()} onSelect={v => u({ walkingAid: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="How long can you walk without stopping?">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <BigRadioOption value="<2blocks" label="Less than 2 blocks (about 5 min)" selected={d.walkingDistance === "<2blocks"} onSelect={v => u({ walkingDistance: v })} />
          <BigRadioOption value="2-5blocks" label="2 to 5 blocks (5-10 min)" selected={d.walkingDistance === "2-5blocks"} onSelect={v => u({ walkingDistance: v })} />
          <BigRadioOption value="0.5-1km" label="Half to 1 km (10-20 min)" selected={d.walkingDistance === "0.5-1km"} onSelect={v => u({ walkingDistance: v })} />
          <BigRadioOption value=">2km" label="More than 2 km (30+ min)" selected={d.walkingDistance === ">2km"} onSelect={v => u({ walkingDistance: v })} />
        </div>
      </FormField>

      <FormField label="Does your joint pain wake you from sleep?">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Never", "Occasionally", "Often", "Almost always"].map(v => (
            <BigRadioOption key={v} value={v.toLowerCase()} label={v} selected={d.painWakesSleep === v.toLowerCase()} onSelect={v => u({ painWakesSleep: v })} />
          ))}
        </div>
      </FormField>

      <FormField label="What activities does your hip/knee keep you from doing?" hint="e.g. Recreation, stairs, kneeling">
        <BigTextarea value={d.limitedActivities} onChange={e => u({ limitedActivities: e.target.value })} placeholder="List activities you have difficulty with..." />
      </FormField>
    </div>
  );
}

function Step3({ d, u }: { d: FormData; u: (p: Partial<FormData>) => void }) {
  return (
    <div className="space-y-6">
      <p className="text-[15px] text-muted-foreground">Select what you have tried for managing your hip/knee pain:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <BigCheckbox id="physio" checked={d.triedPhysiotherapy} onCheckedChange={v => u({ triedPhysiotherapy: v })} label="Physiotherapy" />
        <BigCheckbox id="bracing" checked={d.triedBracing} onCheckedChange={v => u({ triedBracing: v })} label="Bracing" />
      </div>

      <div className="space-y-4">
        <BigCheckbox id="anti" checked={d.triedAntiInflammatories} onCheckedChange={v => u({ triedAntiInflammatories: v })} label="Anti-inflammatories" />
        {d.triedAntiInflammatories && (
          <BigInput value={d.antiInflammatoriesDetails} onChange={e => u({ antiInflammatoriesDetails: e.target.value })} placeholder="Which ones? e.g. Ibuprofen, Naproxen..." />
        )}
      </div>

      <div className="space-y-4">
        <BigCheckbox id="otherpain" checked={d.triedOtherPainMed} onCheckedChange={v => u({ triedOtherPainMed: v })} label="Other Pain Medication" />
        {d.triedOtherPainMed && (
          <BigInput value={d.otherPainMedDetails} onChange={e => u({ otherPainMedDetails: e.target.value })} placeholder="Which medications?" />
        )}
      </div>

      <div className="space-y-4">
        <BigCheckbox id="injections" checked={d.triedInjections} onCheckedChange={v => u({ triedInjections: v })} label="Injections" />
        {d.triedInjections && (
          <BigInput value={d.injectionsDetails} onChange={e => u({ injectionsDetails: e.target.value })} placeholder="What type of injections?" />
        )}
      </div>

      <div className="space-y-4">
        <BigCheckbox id="otherTreat" checked={d.triedOther} onCheckedChange={v => u({ triedOther: v })} label="Other treatments" />
        {d.triedOther && (
          <BigInput value={d.otherDetails} onChange={e => u({ otherDetails: e.target.value })} placeholder="Please describe..." />
        )}
      </div>
    </div>
  );
}

function Step4({ d, u }: { d: FormData; u: (p: Partial<FormData>) => void }) {
  const updateAllergy = (i: number, field: keyof AllergyEntry, val: string) => {
    const next = [...d.allergies];
    next[i] = { ...next[i], [field]: val };
    u({ allergies: next });
  };
  const addAllergy = () => u({ allergies: [...d.allergies, { allergy: "", reaction: "" }] });
  const removeAllergy = (i: number) => {
    if (d.allergies.length <= 1) return;
    u({ allergies: d.allergies.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-6">
      <p className="text-[15px] text-muted-foreground">Please be specific with your allergic reactions.</p>

      <div className="space-y-4">
        {d.allergies.map((a, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-muted-foreground mb-1.5 block">Allergy</Label>
                <BigInput value={a.allergy} onChange={e => updateAllergy(i, "allergy", e.target.value)} placeholder="e.g. Penicillin" />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-1.5 block">Reaction</Label>
                <BigInput value={a.reaction} onChange={e => updateAllergy(i, "reaction", e.target.value)} placeholder="e.g. Hives, swelling" />
              </div>
            </div>
            {d.allergies.length > 1 && (
              <button type="button" onClick={() => removeAllergy(i)} className="mt-7 p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addAllergy} className="h-11 text-[15px]">
          <Plus className="w-4 h-4 mr-2" /> Add Another Allergy
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Do you have a metal allergy?">
          <YesNoToggle value={d.metalAllergy} onChange={v => u({ metalAllergy: v })} />
        </FormField>
        <FormField label="Do you have a latex allergy?">
          <YesNoToggle value={d.latexAllergy} onChange={v => u({ latexAllergy: v })} />
        </FormField>
      </div>
    </div>
  );
}

function Step5({ d, u }: { d: FormData; u: (p: Partial<FormData>) => void }) {
  const updateSurgery = (i: number, field: keyof SurgeryEntry, val: string) => {
    const next = [...d.surgeries];
    next[i] = { ...next[i], [field]: val };
    u({ surgeries: next });
  };
  const addSurgery = () => u({ surgeries: [...d.surgeries, { what: "", when: "", location: "" }] });
  const removeSurgery = (i: number) => {
    if (d.surgeries.length <= 1) return;
    u({ surgeries: d.surgeries.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-6">
      <p className="text-[15px] text-muted-foreground">If you are unsure about a date or location, please estimate.</p>

      <div className="space-y-4">
        {d.surgeries.map((s, i) => (
          <div key={i} className="bg-muted/30 rounded-xl border border-border/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Surgery {i + 1}</span>
              {d.surgeries.length > 1 && (
                <button type="button" onClick={() => removeSurgery(i)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <BigInput value={s.what} onChange={e => updateSurgery(i, "what", e.target.value)} placeholder="What surgery?" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <BigInput type="text" value={s.when} onChange={e => updateSurgery(i, "when", e.target.value)} placeholder="When? (approx. year)" />
              <BigInput value={s.location} onChange={e => updateSurgery(i, "location", e.target.value)} placeholder="Location / Surgeon name" />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addSurgery} className="h-11 text-[15px]">
          <Plus className="w-4 h-4 mr-2" /> Add Another Surgery
        </Button>
      </div>
    </div>
  );
}

function Step6({ d, u }: { d: FormData; u: (p: Partial<FormData>) => void }) {
  const toggleTest = (i: number) => {
    const next = [...d.tests];
    next[i] = { ...next[i], checked: !next[i].checked };
    u({ tests: next });
  };
  const updateTest = (i: number, field: "date" | "location", val: string) => {
    const next = [...d.tests];
    next[i] = { ...next[i], [field]: val };
    u({ tests: next });
  };

  return (
    <div className="space-y-4">
      <p className="text-[15px] text-muted-foreground">Check any tests you have had. If unsure about a date, please estimate.</p>

      {d.tests.map((t, i) => (
        <div key={i} className={cn(
          "rounded-xl border-2 transition-all",
          t.checked ? "border-primary/30 bg-primary/[0.02]" : "border-border bg-white"
        )}>
          <button
            type="button"
            onClick={() => toggleTest(i)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
          >
            <div className={cn(
              "w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors",
              t.checked ? "border-primary bg-primary" : "border-muted-foreground/40"
            )}>
              {t.checked && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-[15px] font-medium">{t.name}</span>
          </button>
          {t.checked && (
            <div className="px-4 pb-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-muted-foreground mb-1.5 block">Date (approximate)</Label>
                <BigInput type="text" value={t.date} onChange={e => updateTest(i, "date", e.target.value)} placeholder="e.g. 2023 or Jan 2024" />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-1.5 block">Location</Label>
                <BigInput value={t.location} onChange={e => updateTest(i, "location", e.target.value)} placeholder="Hospital or clinic name" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Step7({ d, u }: { d: FormData; u: (p: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      {/* Tobacco */}
      <div className="space-y-4">
        <SectionHeading>Tobacco Use</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <BigRadioOption value="never" label="Never used" selected={d.tobaccoUse === "never"} onSelect={v => u({ tobaccoUse: v })} />
          <BigRadioOption value="quit" label="I quit" selected={d.tobaccoUse === "quit"} onSelect={v => u({ tobaccoUse: v })} />
          <BigRadioOption value="yes" label="Currently use" selected={d.tobaccoUse === "yes"} onSelect={v => u({ tobaccoUse: v })} />
        </div>

        {d.tobaccoUse === "quit" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            <FormField label="When did you quit?">
              <BigInput value={d.tobaccoQuitDate} onChange={e => u({ tobaccoQuitDate: e.target.value })} placeholder="e.g. 2019" />
            </FormField>
            <FormField label="How many years did you use?">
              <BigInput value={d.tobaccoYears} onChange={e => u({ tobaccoYears: e.target.value })} placeholder="e.g. 10" />
            </FormField>
            <FormField label="Amount per day?">
              <BigInput value={d.tobaccoAmountPerDay} onChange={e => u({ tobaccoAmountPerDay: e.target.value })} placeholder="e.g. 5" />
            </FormField>
          </div>
        )}

        {d.tobaccoUse === "yes" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <BigCheckbox id="cig" checked={d.tobaccoTypes.cigarettes} onCheckedChange={v => u({ tobaccoTypes: { ...d.tobaccoTypes, cigarettes: v } })} label="Cigarettes" />
              <BigCheckbox id="cigar" checked={d.tobaccoTypes.cigars} onCheckedChange={v => u({ tobaccoTypes: { ...d.tobaccoTypes, cigars: v } })} label="Cigars" />
              <BigCheckbox id="vape" checked={d.tobaccoTypes.vape} onCheckedChange={v => u({ tobaccoTypes: { ...d.tobaccoTypes, vape: v } })} label="Vape" />
              <BigCheckbox id="chew" checked={d.tobaccoTypes.chew} onCheckedChange={v => u({ tobaccoTypes: { ...d.tobaccoTypes, chew: v } })} label="Chew/Spit" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="How many years?">
                <BigInput value={d.tobaccoYears} onChange={e => u({ tobaccoYears: e.target.value })} placeholder="e.g. 10" />
              </FormField>
              <FormField label="Amount per day?">
                <BigInput value={d.tobaccoAmountPerDay} onChange={e => u({ tobaccoAmountPerDay: e.target.value })} placeholder="e.g. 5" />
              </FormField>
            </div>
          </>
        )}
      </div>

      <Separator />

      {/* Alcohol */}
      <div className="space-y-4">
        <SectionHeading>Alcohol Use</SectionHeading>
        <FormField label="Do you drink alcohol?">
          <YesNoToggle value={d.alcoholUse} onChange={v => u({ alcoholUse: v })} />
        </FormField>
        {d.alcoholUse === "yes" && (
          <>
            <FormField label="Number of drinks per week">
              <BigInput type="number" value={d.alcoholDrinksPerWeek} onChange={e => u({ alcoholDrinksPerWeek: e.target.value })} placeholder="e.g. 5" />
            </FormField>
            <div className="grid grid-cols-3 gap-3">
              <BigCheckbox id="beer" checked={d.alcoholTypes.beer} onCheckedChange={v => u({ alcoholTypes: { ...d.alcoholTypes, beer: v } })} label="Beer" />
              <BigCheckbox id="wine" checked={d.alcoholTypes.wine} onCheckedChange={v => u({ alcoholTypes: { ...d.alcoholTypes, wine: v } })} label="Wine" />
              <BigCheckbox id="liquor" checked={d.alcoholTypes.liquor} onCheckedChange={v => u({ alcoholTypes: { ...d.alcoholTypes, liquor: v } })} label="Liquor" />
            </div>
          </>
        )}
      </div>

      <Separator />

      {/* Drug Use */}
      <div className="space-y-4">
        <SectionHeading>Drug Use</SectionHeading>
        <FormField label="Have you used marijuana or recreational drugs in the last two years?">
          <YesNoToggle value={d.drugUse} onChange={v => u({ drugUse: v })} />
        </FormField>
      </div>

      <Separator />

      {/* Language */}
      <div className="space-y-4">
        <SectionHeading>Language Spoken</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <BigRadioOption value="english" label="English" selected={d.language === "english"} onSelect={v => u({ language: v })} />
          <BigRadioOption value="other" label="Other" selected={d.language === "other"} onSelect={v => u({ language: v })} />
        </div>
        {d.language === "other" && (
          <BigInput value={d.languageOther} onChange={e => u({ languageOther: e.target.value })} placeholder="Which language?" />
        )}
      </div>

      <Separator />

      {/* Personal Directive */}
      <div className="space-y-4">
        <SectionHeading>Personal Directive</SectionHeading>
        <FormField label="Do you have a personal directive?">
          <YesNoToggle value={d.personalDirective} onChange={v => u({ personalDirective: v })} />
        </FormField>
        {d.personalDirective === "yes" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-800">
              Please bring a copy of your personal directive to your next appointment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Step8({ d, u }: { d: FormData; u: (p: Partial<FormData>) => void }) {
  const updateFamily = (i: number, field: keyof FamilyEntry, val: string) => {
    const next = [...d.familyHistory];
    next[i] = { ...next[i], [field]: val };
    u({ familyHistory: next });
  };
  const addFamily = () => u({ familyHistory: [...d.familyHistory, { who: "", what: "" }] });
  const removeFamily = (i: number) => {
    if (d.familyHistory.length <= 1) return;
    u({ familyHistory: d.familyHistory.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-8">
      {/* Family Medical History */}
      <div className="space-y-4">
        <SectionHeading>Family Medical History</SectionHeading>
        <p className="text-[15px] text-muted-foreground">Parents or siblings — e.g. cancer, stroke, heart disease, diabetes</p>

        {d.familyHistory.map((f, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <BigInput value={f.who} onChange={e => updateFamily(i, "who", e.target.value)} placeholder="Who? (e.g. Mother)" />
              <BigInput value={f.what} onChange={e => updateFamily(i, "what", e.target.value)} placeholder="What condition?" />
            </div>
            {d.familyHistory.length > 1 && (
              <button type="button" onClick={() => removeFamily(i)} className="mt-1 p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addFamily} className="h-11 text-[15px]">
          <Plus className="w-4 h-4 mr-2" /> Add Another Entry
        </Button>
      </div>

      <Separator />

      {/* Anesthetic History */}
      <div className="space-y-4">
        <SectionHeading>Anesthetic History</SectionHeading>
        <p className="text-[15px] text-muted-foreground">Check all that apply:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <BigCheckbox id="aGen" checked={d.anestheticGeneral} onCheckedChange={v => u({ anestheticGeneral: v })} label="Previous General Anesthetic" />
          <BigCheckbox id="aComp" checked={d.anestheticComplications} onCheckedChange={v => u({ anestheticComplications: v })} label="Complications from anesthetic (self or family)" />
          <BigCheckbox id="aSpinal" checked={d.anestheticSpinal} onCheckedChange={v => u({ anestheticSpinal: v })} label="Previous Spinal Anesthetic" />
          <BigCheckbox id="aNausea" checked={d.anestheticNausea} onCheckedChange={v => u({ anestheticNausea: v })} label="Nausea/vomiting after surgery" />
          <BigCheckbox id="aLocal" checked={d.anestheticLocal} onCheckedChange={v => u({ anestheticLocal: v })} label="Previous Local Anesthetic" />
        </div>
      </div>
    </div>
  );
}

function Step9({ d, u }: { d: FormData; u: (p: Partial<FormData>) => void }) {
  const updateSpec = (i: number, field: keyof SpecialistEntry, val: string) => {
    const next = [...d.specialists];
    next[i] = { ...next[i], [field]: val };
    u({ specialists: next });
  };
  const addSpec = () => u({ specialists: [...d.specialists, { type: "", name: "", date: "", location: "" }] });
  const removeSpec = (i: number) => {
    if (d.specialists.length <= 1) return;
    u({ specialists: d.specialists.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-6">
      <p className="text-[15px] text-muted-foreground">Specialist assessments in the last 5 years. Only fill in specialists you have seen.</p>

      {d.specialists.map((s, i) => (
        <div key={i} className="bg-muted/30 rounded-xl border border-border/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {s.type || `Specialist ${i + 1}`}
            </span>
            {d.specialists.length > 1 && i >= 3 && (
              <button type="button" onClick={() => removeSpec(i)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          {i >= 3 && (
            <BigInput value={s.type} onChange={e => updateSpec(i, "type", e.target.value)} placeholder="Specialist type" />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <BigInput value={s.name} onChange={e => updateSpec(i, "name", e.target.value)} placeholder="Doctor name" />
            <BigInput type="text" value={s.date} onChange={e => updateSpec(i, "date", e.target.value)} placeholder="Date (YYYY-MM-DD)" />
            <BigInput value={s.location} onChange={e => updateSpec(i, "location", e.target.value)} placeholder="Location" />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addSpec} className="h-11 text-[15px]">
        <Plus className="w-4 h-4 mr-2" /> Add Another Specialist
      </Button>
    </div>
  );
}

function Step10({ d, u }: { d: FormData; u: (p: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      {/* Support After Surgery */}
      <div className="space-y-4">
        <SectionHeading>Support After Surgery</SectionHeading>
        <p className="text-[15px] text-muted-foreground">Who will help you during preparation and recovery?</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Contact Name">
            <BigInput value={d.supportName} onChange={e => u({ supportName: e.target.value })} placeholder="e.g. Jane Smith" />
          </FormField>
          <FormField label="Relationship">
            <BigInput value={d.supportRelationship} onChange={e => u({ supportRelationship: e.target.value })} placeholder="e.g. Spouse, Daughter" />
          </FormField>
          <FormField label="Phone Number">
            <BigInput type="tel" value={d.supportPhone} onChange={e => u({ supportPhone: e.target.value })} placeholder="e.g. 403-555-1234" />
          </FormField>
        </div>

        <FormField label="Do you live alone?">
          <YesNoToggle value={d.liveAlone} onChange={v => u({ liveAlone: v })} />
        </FormField>

        <FormField label="Who will be your caregiver after surgery?">
          <BigInput value={d.caregiverAfterSurgery} onChange={e => u({ caregiverAfterSurgery: e.target.value })} placeholder="Name of caregiver" />
        </FormField>

        <FormField label="How long will the caregiver stay after surgery?">
          <BigInput value={d.caregiverDuration} onChange={e => u({ caregiverDuration: e.target.value })} placeholder="e.g. 2 weeks" />
        </FormField>
      </div>

      <Separator />

      {/* Fall Risk */}
      <div className="space-y-4">
        <SectionHeading>Fall Risk Assessment</SectionHeading>

        <FormField label="Do you have a history of falls?">
          <YesNoToggle value={d.fallHistory} onChange={v => u({ fallHistory: v })} />
        </FormField>

        {d.fallHistory === "yes" && (
          <>
            <FormField label="When did you fall?">
              <BigInput value={d.fallDates} onChange={e => u({ fallDates: e.target.value })} placeholder="Approximate date(s)" />
            </FormField>

            <FormField label="Did you have any injuries as a result of a fall?">
              <YesNoToggle value={d.fallInjuries} onChange={v => u({ fallInjuries: v })} />
            </FormField>

            {d.fallInjuries === "yes" && (
              <FormField label="Injury details">
                <BigInput value={d.fallInjuryDetails} onChange={e => u({ fallInjuryDetails: e.target.value })} placeholder="Describe injuries" />
              </FormField>
            )}
          </>
        )}

        <FormField label="Do you get dizzy or light-headed when you stand up or walk?">
          <YesNoToggle value={d.dizzyOnStanding} onChange={v => u({ dizzyOnStanding: v })} />
        </FormField>
      </div>
    </div>
  );
}

const SYMPTOM_GROUPS = [
  {
    title: "Neurological (Head)",
    items: [
      "Problems moving or feeling any part of your body",
      "Stroke", "Convulsions/Seizures", "Parkinson's", "Multiple Sclerosis",
      "Polio", "Fainting/Blackouts", "Fibromyalgia", "Memory Loss", "Dementia",
    ],
  },
  {
    title: "Respiratory (Lungs)",
    items: [
      "Asthma", "Frequent Bronchitis", "Emphysema", "Pneumonia",
      "Chronic obstructive", "Pulmonary disease (COPD)", "Shortness of breath",
      "Tuberculosis", "Sleep Apnea", "Snores at night",
      "Stop breathing at night", "Tired from poor sleep",
    ],
  },
  {
    title: "Kidney / Urinary",
    items: [
      "Kidney Problems", "Prostate Problems", "Previous catheterization",
      "Postmenopausal", "Seen a Urologist", "Frequent bladder infection",
      "Difficulty controlling urine", "Incontinence", "Waking up to urinate",
    ],
  },
  {
    title: "Liver / Endocrine",
    items: [
      "Hepatitis", "Liver Problems", "Steroid use (Cortisone/Prednisone)", "Diabetes",
    ],
  },
  {
    title: "Mental Health",
    items: ["Depression", "Bipolar", "PTSD", "Schizophrenia", "ADHD"],
  },
  {
    title: "Cardio / Vascular (Heart)",
    items: [
      "Atrial Fibrillation", "Pacemaker", "Low blood pressure", "High blood pressure",
      "Heart Attack", "Chest Pain", "Blood clot to lung or leg", "Vascular disease",
    ],
  },
  {
    title: "Blood",
    items: [
      "HIV/AIDS", "Reaction to blood transfusion", "Blood disorder",
      "Low blood count/Anemia", "Jehovah Witness",
    ],
  },
  {
    title: "Gastrointestinal (Stomach)",
    items: [
      "Stomach Problems", "Acid reflux/Heartburn", "Constipation", "Diarrhea",
      "Irritable bowel", "Recent weight gain/loss", "Crohn's", "Colitis",
    ],
  },
  {
    title: "Skin",
    items: ["Open sores or rashes", "Piercing", "Tattoos"],
  },
  {
    title: "Cancer",
    items: ["Cancer (self)", "Cancer (family)"],
  },
  {
    title: "Musculoskeletal",
    items: [
      "Back Pain", "Osteoarthritis", "Osteoporosis (thin bones)",
      "Rheumatoid", "Inflammatory Arthritis", "Jaw/Neck Problems",
      "Cortisone injection", "Chronic pain", "Joint Infection",
    ],
  },
];

function Step11({ d, u }: { d: FormData; u: (p: Partial<FormData>) => void }) {
  const toggleSymptom = (key: string) => {
    u({ symptoms: { ...d.symptoms, [key]: !d.symptoms[key] } });
  };

  return (
    <div className="space-y-6">
      <p className="text-[15px] text-muted-foreground">Check any symptoms you have currently or have had in the past.</p>

      {SYMPTOM_GROUPS.map(group => (
        <div key={group.title} className="space-y-3">
          <h4 className="text-base font-semibold font-display tracking-tight text-foreground">{group.title}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {group.items.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => toggleSymptom(item)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg border transition-all text-left",
                  "text-[14px]",
                  d.symptoms[item]
                    ? "border-primary/40 bg-primary/5 text-primary font-medium"
                    : "border-border bg-white text-foreground hover:border-primary/20 hover:bg-muted/30"
                )}
              >
                <div className={cn(
                  "w-4.5 h-4.5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors",
                  "w-[18px] h-[18px]",
                  d.symptoms[item] ? "border-primary bg-primary" : "border-muted-foreground/30"
                )}>
                  {d.symptoms[item] && <Check className="w-3 h-3 text-white" />}
                </div>
                {item}
              </button>
            ))}
          </div>

          {/* Conditional follow-ups within this group */}
          {group.title === "Respiratory (Lungs)" && d.symptoms["Chronic obstructive"] && (
            <div className="ml-4">
              <FormField label="Do you use O2 at home?">
                <YesNoToggle value={d.symptomsO2AtHome} onChange={v => u({ symptomsO2AtHome: v })} />
              </FormField>
            </div>
          )}

          {group.title === "Liver / Endocrine" && d.symptoms["Diabetes"] && (
            <div className="ml-4 space-y-3">
              <FormField label="Diabetes type">
                <div className="flex gap-3">
                  <BigRadioOption value="type1" label="Type 1" selected={d.diabetesType === "type1"} onSelect={v => u({ diabetesType: v })} />
                  <BigRadioOption value="type2" label="Type 2" selected={d.diabetesType === "type2"} onSelect={v => u({ diabetesType: v })} />
                </div>
              </FormField>
              <FormField label="Do you take insulin?">
                <YesNoToggle value={d.diabetesInsulin} onChange={v => u({ diabetesInsulin: v })} />
              </FormField>
            </div>
          )}

          {group.title === "Cancer" && d.symptoms["Cancer (self)"] && (
            <div className="ml-4 space-y-3">
              <FormField label="Date(s)">
                <BigInput value={d.cancerSelfDates} onChange={e => u({ cancerSelfDates: e.target.value })} placeholder="When?" />
              </FormField>
              <FormField label="Treatment">
                <BigInput value={d.cancerTreatment} onChange={e => u({ cancerTreatment: e.target.value })} placeholder="What treatment?" />
              </FormField>
            </div>
          )}

          {group.title === "Musculoskeletal" && d.symptoms["Cortisone injection"] && (
            <div className="ml-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="When?">
                <BigInput value={d.cortisoneWhen} onChange={e => u({ cortisoneWhen: e.target.value })} placeholder="Approximate date" />
              </FormField>
              <FormField label="Where?">
                <BigInput value={d.cortisoneWhere} onChange={e => u({ cortisoneWhere: e.target.value })} placeholder="Which joint/area?" />
              </FormField>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Step12({ d, u }: { d: FormData; u: (p: Partial<FormData>) => void }) {
  const updateMed = (i: number, field: keyof MedicationEntry, val: string) => {
    const next = [...d.medications];
    next[i] = { ...next[i], [field]: val };
    u({ medications: next });
  };
  const addMed = () => u({ medications: [...d.medications, { name: "", dose: "", timeOfDay: "" }] });
  const removeMed = (i: number) => {
    if (d.medications.length <= 1) return;
    u({ medications: d.medications.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-8">
      {/* Other Questions */}
      <div className="space-y-4">
        <SectionHeading>Other Questions</SectionHeading>

        <div className="space-y-4">
          {[
            { label: "Have you ever become confused or had memory problems after an anesthetic?", key: "confusionAfterAnesthetic" as const },
            { label: "Do you experience heart or breathing problems after walking 4 blocks on level ground?", key: "heartBreathingWalking" as const },
            { label: "Do you experience heart or breathing problems after climbing 2 flights of stairs?", key: "heartBreathingStairs" as const },
            { label: "Have you been treated for an antibiotic resistant infection?", key: "antibioticResistant" as const },
            { label: "Have you had recent contact with any communicable disease?", key: "communicableDisease" as const },
          ].map(q => (
            <div key={q.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-border/50">
              <span className="text-[15px] text-foreground flex-1">{q.label}</span>
              <YesNoToggle value={d[q.key]} onChange={v => u({ [q.key]: v })} />
            </div>
          ))}
        </div>

        {/* Weight loss */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-border/50">
          <span className="text-[15px] text-foreground flex-1">Have you experienced recent weight loss without trying?</span>
          <YesNoToggle value={d.recentWeightLoss} onChange={v => u({ recentWeightLoss: v })} />
        </div>
        {d.recentWeightLoss === "yes" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-4">
            <FormField label="How much (lbs)?">
              <BigInput value={d.weightLossAmount} onChange={e => u({ weightLossAmount: e.target.value })} placeholder="e.g. 10" />
            </FormField>
            <FormField label="Decreased appetite?">
              <YesNoToggle value={d.decreasedAppetite} onChange={v => u({ decreasedAppetite: v })} />
            </FormField>
          </div>
        )}

        {/* Vision */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-border/50">
          <span className="text-[15px] text-foreground flex-1">Do you have vision problems?</span>
          <YesNoToggle value={d.visionProblems} onChange={v => u({ visionProblems: v })} />
        </div>
        {d.visionProblems === "yes" && (
          <FormField label="Vision aids used">
            <BigInput value={d.visionAids} onChange={e => u({ visionAids: e.target.value })} placeholder="e.g. Glasses, contacts" className="ml-4" />
          </FormField>
        )}

        {/* Hearing */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-border/50">
          <span className="text-[15px] text-foreground flex-1">Do you have hearing problems?</span>
          <YesNoToggle value={d.hearingProblems} onChange={v => u({ hearingProblems: v })} />
        </div>
        {d.hearingProblems === "yes" && (
          <FormField label="Hearing aids used">
            <BigInput value={d.hearingAids} onChange={e => u({ hearingAids: e.target.value })} placeholder="e.g. Hearing aid (left ear)" className="ml-4" />
          </FormField>
        )}

        {/* Dental */}
        <div className="py-3 border-b border-border/50 space-y-3">
          <span className="text-[15px] text-foreground font-medium">Dental History</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <BigCheckbox id="dentures" checked={d.dentalFullDentures} onCheckedChange={v => u({ dentalFullDentures: v })} label="Full Dentures" />
            <BigCheckbox id="caps" checked={d.dentalCaps} onCheckedChange={v => u({ dentalCaps: v })} label="Caps/Crowns" />
            <BigCheckbox id="bridge" checked={d.dentalBridgework} onCheckedChange={v => u({ dentalBridgework: v })} label="Bridgework" />
          </div>
          {!d.dentalFullDentures && (
            <FormField label="Date of last dental exam">
              <BigInput value={d.dentalLastExam} onChange={e => u({ dentalLastExam: e.target.value })} placeholder="e.g. March 2025" />
            </FormField>
          )}
        </div>

        {/* Motion sickness */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-border/50">
          <span className="text-[15px] text-foreground flex-1">Have you ever experienced motion sickness?</span>
          <YesNoToggle value={d.motionSickness} onChange={v => u({ motionSickness: v })} />
        </div>

        {/* Vaccines */}
        {[
          { label: "Did you get your flu vaccine this year?", key: "fluVaccine" as const, whenKey: "fluVaccineWhen" as const },
          { label: "Have you ever had a pneumonia vaccine?", key: "pneumoniaVaccine" as const, whenKey: "pneumoniaVaccineWhen" as const },
          { label: "Did you get your COVID-19 vaccine this year?", key: "covidVaccine" as const, whenKey: "covidVaccineWhen" as const },
        ].map(v => (
          <div key={v.key}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-border/50">
              <span className="text-[15px] text-foreground flex-1">{v.label}</span>
              <YesNoToggle value={d[v.key]} onChange={val => u({ [v.key]: val })} />
            </div>
            {d[v.key] === "yes" && (
              <FormField label="When?">
                <BigInput value={d[v.whenKey]} onChange={e => u({ [v.whenKey]: e.target.value })} placeholder="Approximate date" className="ml-4 mt-2" />
              </FormField>
            )}
          </div>
        ))}
      </div>

      <Separator />

      {/* Medications */}
      <div className="space-y-4">
        <SectionHeading>Medications</SectionHeading>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-800">
            Please list all medications, vitamins, and supplements you take. Also bring them to your appointment in their original containers.
          </p>
        </div>

        {d.medications.map((m, i) => (
          <div key={i} className="bg-muted/30 rounded-xl border border-border/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Medication {i + 1}</span>
              {d.medications.length > 1 && (
                <button type="button" onClick={() => removeMed(i)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <BigInput value={m.name} onChange={e => updateMed(i, "name", e.target.value)} placeholder="Medication name" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <BigInput value={m.dose} onChange={e => updateMed(i, "dose", e.target.value)} placeholder="Dose (e.g. 500mg)" />
              <BigInput value={m.timeOfDay} onChange={e => updateMed(i, "timeOfDay", e.target.value)} placeholder="Time of day (e.g. Morning)" />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addMed} className="h-11 text-[15px]">
          <Plus className="w-4 h-4 mr-2" /> Add Another Medication
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────

// ─── Layout-free content (used inside FormsHub) ────────────

export function HealthHistoryFormContent() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(getInitialFormData);
  const [submitted, setSubmitted] = useState(false);

  const update = useCallback((partial: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...partial }));
  }, []);

  const totalSteps = STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const goNext = () => { if (step < totalSteps - 1) setStep(s => s + 1); window.scrollTo(0, 0); };
  const goPrev = () => { if (step > 0) setStep(s => s - 1); window.scrollTo(0, 0); };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-enter">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground mb-3">
          Form Submitted
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-md mb-8">
          Your health history form has been submitted successfully. Your surgical team will review it before your appointment.
        </p>
        <Button onClick={() => { setSubmitted(false); setStep(0); setFormData(getInitialFormData()); }} variant="outline" className="h-12 px-6 text-[15px]">
          Fill Out Another Form
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-enter">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {step + 1} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-primary">
            {STEPS[step]}
          </span>
        </div>
        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 px-1">
          {STEPS.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setStep(i); window.scrollTo(0, 0); }}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                i === step
                  ? "bg-primary scale-125"
                  : i < step
                  ? "bg-primary/40"
                  : "bg-muted-foreground/20"
              )}
              title={s}
            />
          ))}
        </div>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-display">{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 0 && <Step1 d={formData} u={update} />}
          {step === 1 && <Step2 d={formData} u={update} />}
          {step === 2 && <Step3 d={formData} u={update} />}
          {step === 3 && <Step4 d={formData} u={update} />}
          {step === 4 && <Step5 d={formData} u={update} />}
          {step === 5 && <Step6 d={formData} u={update} />}
          {step === 6 && <Step7 d={formData} u={update} />}
          {step === 7 && <Step8 d={formData} u={update} />}
          {step === 8 && <Step9 d={formData} u={update} />}
          {step === 9 && <Step10 d={formData} u={update} />}
          {step === 10 && <Step11 d={formData} u={update} />}
          {step === 11 && <Step12 d={formData} u={update} />}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-6 pb-8">
        <Button type="button" variant="outline" onClick={goPrev} disabled={step === 0} className="h-12 px-6 text-[15px] gap-2">
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>
        {step < totalSteps - 1 ? (
          <Button type="button" onClick={goNext} className="h-12 px-8 text-[15px] gap-2">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} className="h-12 px-8 text-[15px] gap-2 bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4" /> Submit Form
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Standalone page (kept for direct route access) ─────────

export default function HealthHistoryForm() {
  return (
    <ProviderLayout>
      <div className="animate-enter">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Health History Form
              </h1>
              <p className="text-sm text-muted-foreground">Alberta Hip & Knee Clinic</p>
            </div>
          </div>
        </div>
        <HealthHistoryFormContent />
      </div>
    </ProviderLayout>
  );
}

