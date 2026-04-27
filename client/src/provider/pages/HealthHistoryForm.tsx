import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft, ChevronRight, Check, User, Phone, Mail, MessageSquare,
  Languages, Users, MapPin, Briefcase, Car, Home, Shield, HeartPulse,
  Activity, Pill, Syringe, Dumbbell, Ban, AlertTriangle, Stethoscope,
  Cigarette, Wine, Cannabis, ClipboardList, Brain, Bone, Leaf,
  BadgeCheck, Moon, Zap, Thermometer, Scale, Hospital, Building2,
  PersonStanding, Baby,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface FormData {
  // Patient registration
  legalFirstName: string;
  legalLastName: string;
  preferredName: string;
  birthdate: string;
  sexAssignedAtBirth: string;
  genderIdentity: string;
  genderIdentityOther: string;
  healthCareNumber: string;
  addressStreet: string;
  addressCity: string;
  addressProvince: string;
  addressPostalCode: string;
  primaryPhone: string;
  contactMethod: string;
  email: string;
  preferredLanguage: string;
  preferredLanguageOther: string;
  interpreterRequired: string;
  interpreterLanguage: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactIsSDM: string;
  directiveStatus: string;
  referringPhysicianName: string;
  referringClinic: string;
  referringPhysicianPhone: string;
  referralDate: string;
  hasFamilyPhysician: string;
  familyPhysicianName: string;
  familyPhysicianClinic: string;
  // Joint info
  jointHip: boolean;
  jointKnee: boolean;
  jointShoulder: boolean;
  jointOther: boolean;
  jointOtherText: string;
  side: string;
  symptomDuration: string;
  priorJointSurgery: string;
  priorJointSurgeryDetails: string;
  imagingXray: boolean;
  imagingMRI: boolean;
  imagingCT: boolean;
  imagingUltrasound: boolean;
  imagingNone: boolean;
  imagingWhereWhen: string;
  walkingAid: string;
  walkingDistance: string;
  painWakesSleep: string;
  // Pain management
  triedPhysiotherapy: string;
  triedBracing: string;
  triedAntiInflammatories: string;
  antiInflammatoriesDetails: string;
  triedInjections: string;
  injectionsDetails: string;
  triedWeightLoss: string;
  triedExercise: string;
  triedOther: string;
  otherDetails: string;
  // Allergies
  hasAllergies: string;
  allergiesText: string;
  metalAllergy: string;
  latexAllergy: string;
  // Surgical history
  hasSurgeries: string;
  surgeriesText: string;
  // Social history
  tobaccoUse: string;
  tobaccoDetails: string;
  alcoholUse: string;
  alcoholDrinksPerWeek: string;
  drugUse: string;
  // Medical conditions (checkbox group stored as comma-separated)
  medicalConditions: string;
  // Logistical
  livingLocation: string;
  caregiverHelp: string;
  transportationReliable: string;
  employmentStatus: string;
  surgeryBarrier: string;
  surgeryBarrierDetails: string;
  // Anesthetic & family
  anestheticTypes: string;
  anestheticComplications: string;
  familyAnestheticProblems: string;
  // Support & fall risk
  liveAlone: string;
  supportPersonName: string;
  caregiverAfterSurgery: string;
  fallHistory: string;
  dizzyOnStanding: string;
  // Review of symptoms (key ones)
  diabetes: string;
  highBloodPressure: string;
  heartDisease: string;
  lungDisease: string;
  kidneyDisease: string;
  sleepApnea: string;
  otherConditions: string;
  // Dental / vision / hearing
  dentalIssues: string;
  visionProblems: string;
  hearingProblems: string;
  // Vaccines
  fluVaccine: string;
  covidVaccine: string;
  // Medications & consent
  currentMedications: string;
  consentData: string;
  consentElectronic: string;
  consentShare: string;
  signature: string;
  completedByName: string;
}

function getInitialData(): FormData {
  return {
    legalFirstName: "", legalLastName: "", preferredName: "", birthdate: "",
    sexAssignedAtBirth: "", genderIdentity: "", genderIdentityOther: "",
    healthCareNumber: "", addressStreet: "", addressCity: "", addressProvince: "",
    addressPostalCode: "", primaryPhone: "", contactMethod: "", email: "",
    preferredLanguage: "", preferredLanguageOther: "", interpreterRequired: "",
    interpreterLanguage: "", emergencyContactName: "", emergencyContactRelationship: "",
    emergencyContactPhone: "", emergencyContactIsSDM: "", directiveStatus: "",
    referringPhysicianName: "", referringClinic: "", referringPhysicianPhone: "",
    referralDate: "", hasFamilyPhysician: "", familyPhysicianName: "",
    familyPhysicianClinic: "",
    jointHip: false, jointKnee: false, jointShoulder: false, jointOther: false,
    jointOtherText: "", side: "", symptomDuration: "", priorJointSurgery: "",
    priorJointSurgeryDetails: "", imagingXray: false, imagingMRI: false,
    imagingCT: false, imagingUltrasound: false, imagingNone: false,
    imagingWhereWhen: "", walkingAid: "", walkingDistance: "", painWakesSleep: "",
    triedPhysiotherapy: "", triedBracing: "", triedAntiInflammatories: "",
    antiInflammatoriesDetails: "", triedInjections: "", injectionsDetails: "",
    triedWeightLoss: "", triedExercise: "", triedOther: "", otherDetails: "",
    hasAllergies: "", allergiesText: "", metalAllergy: "", latexAllergy: "",
    hasSurgeries: "", surgeriesText: "",
    tobaccoUse: "", tobaccoDetails: "", alcoholUse: "", alcoholDrinksPerWeek: "",
    drugUse: "", medicalConditions: "", livingLocation: "", caregiverHelp: "",
    transportationReliable: "", employmentStatus: "", surgeryBarrier: "",
    surgeryBarrierDetails: "", anestheticTypes: "", anestheticComplications: "",
    familyAnestheticProblems: "", liveAlone: "", supportPersonName: "",
    caregiverAfterSurgery: "", fallHistory: "", dizzyOnStanding: "",
    diabetes: "", highBloodPressure: "", heartDisease: "", lungDisease: "",
    kidneyDisease: "", sleepApnea: "", otherConditions: "",
    dentalIssues: "", visionProblems: "", hearingProblems: "",
    fluVaccine: "", covidVaccine: "", currentMedications: "",
    consentData: "", consentElectronic: "", consentShare: "",
    signature: "", completedByName: "",
  };
}

// ─── Icon maps ───────────────────────────────────────────────────────────────

const OPTION_ICON: Record<string, any> = {
  // Sex / gender
  "Male": User, "Female": User, "Intersex": Users,
  "Man": User, "Woman": User, "Non-binary": Users, "Self-describe": MessageSquare,
  // Contact
  "Phone": Phone, "SMS / Text": MessageSquare, "Email": Mail, "Patient Portal": Home,
  // Language
  "English": Languages, "French": Languages,
  // Joints
  "Hip": PersonStanding, "Knee": PersonStanding, "Shoulder": PersonStanding,
  "Other": ClipboardList,
  // Side
  "Left": ChevronLeft, "Right": ChevronRight, "Both": Users,
  // Duration
  "Less than 3 months": Zap, "3–6 months": Activity, "6–12 months": Activity,
  "1–2 years": Activity, "More than 2 years": AlertTriangle,
  // Walking aid
  "None": BadgeCheck, "Cane": PersonStanding, "Walker": PersonStanding,
  "Wheelchair": PersonStanding,
  // Treatments
  "Physiotherapy": Dumbbell, "Bracing": Shield, "Anti-inflammatories": Pill,
  "Cortisone injections": Syringe, "Weight loss program": Scale,
  "Exercise program": Dumbbell, "Acupuncture": Zap,
  // Lifestyle
  "Cigarettes / Tobacco": Cigarette, "Cannabis": Cannabis, "Alcohol": Wine,
  "Never": Ban, "Former user": Leaf, "Current user": AlertTriangle,
  // Employment
  "Full-time": Briefcase, "Part-time": Briefcase, "Not working": Home,
  "Retired": Leaf, "Prefer not to say": Shield,
  // Living
  "City": Building2, "Town": MapPin, "Rural / Remote": Home,
  // Anesthetic types
  "General (put to sleep)": Moon, "Spinal": Stethoscope, "Local / Regional": Syringe,
  // Medical conditions
  "Diabetes": Thermometer, "High blood pressure": HeartPulse, "Heart disease": HeartPulse,
  "Lung disease": Activity, "Kidney disease": Activity, "Sleep apnea": Moon,
  "Stroke": Brain, "Cancer": Stethoscope, "Obesity": Scale,
  "Mental health condition": Brain, "Rheumatoid arthritis": Bone,
  "Osteoporosis": Bone, "None of these": BadgeCheck,
  // Consent
  "I agree": BadgeCheck, "I do not agree": Ban,
  // Transport
  "Always": Car,
  // Caregiver / yes-no
  "Yes": Check, "No": Ban, "Sometimes": Activity, "Unsure": AlertTriangle,
  "Yes, I have one": Users, "No, I need help": AlertTriangle,
};

const OPTION_COLOR: Record<string, string> = {
  "Yes": "border-green-300 bg-green-50 text-green-700",
  "Yes, I have one": "border-green-300 bg-green-50 text-green-700",
  "I agree": "border-green-300 bg-green-50 text-green-700",
  "Always": "border-green-300 bg-green-50 text-green-700",
  "None": "border-green-300 bg-green-50 text-green-700",
  "None of these": "border-green-300 bg-green-50 text-green-700",
  "No": "border-slate-200 bg-slate-50 text-slate-600",
  "I do not agree": "border-red-200 bg-red-50 text-red-600",
  "Sometimes": "border-amber-200 bg-amber-50 text-amber-700",
  "Unsure": "border-amber-200 bg-amber-50 text-amber-700",
  "No, I need help": "border-amber-200 bg-amber-50 text-amber-700",
  "Current user": "border-red-200 bg-red-50 text-red-600",
  "More than 2 years": "border-red-200 bg-red-50 text-red-600",
};

// ─── Question definition ─────────────────────────────────────────────────────

type QType = "patient-info" | "emergency-contact" | "referring" | "joint-select"
  | "imaging-select" | "radio" | "checkbox-group" | "text" | "textarea"
  | "medications-text" | "conditions-select" | "consent-group";

interface Q {
  id: string;
  section: string;
  label: string;
  sublabel?: string;
  type: QType;
  opts?: string[];
  field?: keyof FormData;
  showIf?: (d: FormData) => boolean;
}

const ALL_QUESTIONS: Q[] = [
  // ── Patient Registration ─────────────────────────────────────────────────
  {
    id: "patient-info", section: "Patient Registration", type: "patient-info",
    label: "Let's start with your basic information",
    sublabel: "Legal name, date of birth, and health care number",
  },
  {
    id: "contactMethod", section: "Patient Registration", type: "radio",
    label: "How would you prefer us to contact you?",
    opts: ["Phone", "SMS / Text", "Email", "Patient Portal"],
    field: "contactMethod",
  },
  {
    id: "preferredLanguage", section: "Patient Registration", type: "radio",
    label: "What is your preferred language?",
    opts: ["English", "French", "Other"],
    field: "preferredLanguage",
  },
  {
    id: "interpreterRequired", section: "Patient Registration", type: "radio",
    label: "Do you require an interpreter?",
    opts: ["Yes", "No"],
    field: "interpreterRequired",
    showIf: (d) => d.preferredLanguage !== "" && d.preferredLanguage !== "English",
  },
  {
    id: "emergency-contact", section: "Patient Registration", type: "emergency-contact",
    label: "Emergency contact & advance directive",
    sublabel: "Who should we contact in an emergency?",
  },
  {
    id: "referring", section: "Patient Registration", type: "referring",
    label: "Referring physician & family doctor",
    sublabel: "Clinic and contact information",
  },
  {
    id: "hasFamilyPhysician", section: "Patient Registration", type: "radio",
    label: "Do you have a family physician?",
    opts: ["Yes", "No"],
    field: "hasFamilyPhysician",
  },

  // ── Joint Information ─────────────────────────────────────────────────────
  {
    id: "joint-select", section: "Joint Information", type: "joint-select",
    label: "Which joint(s) are you having problems with?",
    sublabel: "Select all that apply",
  },
  {
    id: "side", section: "Joint Information", type: "radio",
    label: "Which side is affected?",
    opts: ["Left", "Right", "Both"],
    field: "side",
  },
  {
    id: "symptomDuration", section: "Joint Information", type: "radio",
    label: "How long have you had these symptoms?",
    opts: ["Less than 3 months", "3–6 months", "6–12 months", "1–2 years", "More than 2 years"],
    field: "symptomDuration",
  },
  {
    id: "priorJointSurgery", section: "Joint Information", type: "radio",
    label: "Have you had any prior surgery on this joint?",
    opts: ["Yes", "No"],
    field: "priorJointSurgery",
  },
  {
    id: "imaging-select", section: "Joint Information", type: "imaging-select",
    label: "Do you have any imaging available?",
    sublabel: "Select all types you have had done",
  },
  {
    id: "walkingAid", section: "Joint Information", type: "radio",
    label: "Do you use a walking aid?",
    opts: ["None", "Cane", "Walker", "Wheelchair"],
    field: "walkingAid",
  },
  {
    id: "painWakesSleep", section: "Joint Information", type: "radio",
    label: "Does your pain wake you from sleep?",
    opts: ["Yes", "No", "Sometimes"],
    field: "painWakesSleep",
  },

  // ── Pain Management ───────────────────────────────────────────────────────
  {
    id: "triedPhysiotherapy", section: "Pain Management", type: "radio",
    label: "Have you tried physiotherapy for this condition?",
    opts: ["Yes", "No"],
    field: "triedPhysiotherapy",
  },
  {
    id: "triedBracing", section: "Pain Management", type: "radio",
    label: "Have you tried bracing or orthotics?",
    opts: ["Yes", "No"],
    field: "triedBracing",
  },
  {
    id: "triedAntiInflammatories", section: "Pain Management", type: "radio",
    label: "Have you taken anti-inflammatory medications?",
    sublabel: "e.g. ibuprofen, naproxen, diclofenac",
    opts: ["Yes", "No"],
    field: "triedAntiInflammatories",
  },
  {
    id: "triedInjections", section: "Pain Management", type: "radio",
    label: "Have you received cortisone or other injections?",
    opts: ["Yes", "No"],
    field: "triedInjections",
  },
  {
    id: "triedWeightLoss", section: "Pain Management", type: "radio",
    label: "Have you tried a weight loss program?",
    opts: ["Yes", "No"],
    field: "triedWeightLoss",
  },
  {
    id: "triedExercise", section: "Pain Management", type: "radio",
    label: "Have you followed a structured exercise program?",
    opts: ["Yes", "No"],
    field: "triedExercise",
  },

  // ── Medical History ───────────────────────────────────────────────────────
  {
    id: "conditions-select", section: "Medical History", type: "conditions-select",
    label: "Do you have any of the following medical conditions?",
    sublabel: "Select all that apply",
  },
  {
    id: "diabetes", section: "Medical History", type: "radio",
    label: "Is your diabetes managed with insulin?",
    opts: ["Yes, insulin", "No, diet / pills only"],
    field: "diabetes",
    showIf: (d) => d.medicalConditions.includes("Diabetes"),
  },
  {
    id: "sleepApnea", section: "Medical History", type: "radio",
    label: "Do you use a CPAP machine for your sleep apnea?",
    opts: ["Yes", "No"],
    field: "sleepApnea",
    showIf: (d) => d.medicalConditions.includes("Sleep apnea"),
  },

  // ── Allergies ────────────────────────────────────────────────────────────
  {
    id: "hasAllergies", section: "Allergies & Safety", type: "radio",
    label: "Do you have any known allergies?",
    sublabel: "Medications, environmental, food",
    opts: ["Yes", "No"],
    field: "hasAllergies",
  },
  {
    id: "allergiesText", section: "Allergies & Safety", type: "textarea",
    label: "Please describe your allergies and reactions",
    field: "allergiesText",
    showIf: (d) => d.hasAllergies === "Yes",
  },
  {
    id: "metalAllergy", section: "Allergies & Safety", type: "radio",
    label: "Do you have an allergy to metal (e.g. nickel)?",
    sublabel: "Important for implant selection",
    opts: ["Yes", "No", "Unsure"],
    field: "metalAllergy",
  },
  {
    id: "latexAllergy", section: "Allergies & Safety", type: "radio",
    label: "Do you have a latex allergy?",
    opts: ["Yes", "No", "Unsure"],
    field: "latexAllergy",
  },

  // ── Surgical History ─────────────────────────────────────────────────────
  {
    id: "hasSurgeries", section: "Surgical History", type: "radio",
    label: "Have you had any previous surgeries?",
    opts: ["Yes", "No"],
    field: "hasSurgeries",
  },
  {
    id: "surgeriesText", section: "Surgical History", type: "textarea",
    label: "Please describe your previous surgeries",
    sublabel: "Include what, when, and where",
    field: "surgeriesText",
    showIf: (d) => d.hasSurgeries === "Yes",
  },

  // ── Anesthetic history ───────────────────────────────────────────────────
  {
    id: "anestheticTypes", section: "Anesthetic History", type: "radio",
    label: "Have you ever had anesthesia before?",
    opts: ["Yes", "No"],
    field: "anestheticTypes",
  },
  {
    id: "anestheticComplications", section: "Anesthetic History", type: "radio",
    label: "Did you experience any complications with anesthesia?",
    sublabel: "e.g. severe nausea, allergic reaction, awareness",
    opts: ["Yes", "No"],
    field: "anestheticComplications",
    showIf: (d) => d.anestheticTypes === "Yes",
  },
  {
    id: "familyAnestheticProblems", section: "Anesthetic History", type: "radio",
    label: "Has anyone in your family had problems with anesthesia?",
    opts: ["Yes", "No"],
    field: "familyAnestheticProblems",
  },

  // ── Social History ────────────────────────────────────────────────────────
  {
    id: "tobaccoUse", section: "Social History", type: "radio",
    label: "What is your tobacco / smoking status?",
    opts: ["Never", "Former user", "Current user"],
    field: "tobaccoUse",
  },
  {
    id: "alcoholUse", section: "Social History", type: "radio",
    label: "Do you regularly consume alcohol?",
    opts: ["Yes", "No"],
    field: "alcoholUse",
  },
  {
    id: "alcoholDrinksPerWeek", section: "Social History", type: "radio",
    label: "Approximately how many drinks per week?",
    opts: ["1–3", "4–7", "8–14", "15+"],
    field: "alcoholDrinksPerWeek",
    showIf: (d) => d.alcoholUse === "Yes",
  },
  {
    id: "drugUse", section: "Social History", type: "radio",
    label: "Do you use recreational drugs or cannabis?",
    opts: ["Yes", "No", "Prefer not to say"],
    field: "drugUse",
  },
  {
    id: "employmentStatus", section: "Social History", type: "radio",
    label: "What is your current employment status?",
    opts: ["Full-time", "Part-time", "Not working", "Retired", "Prefer not to say"],
    field: "employmentStatus",
  },
  {
    id: "livingLocation", section: "Social History", type: "radio",
    label: "Where do you currently live?",
    opts: ["City", "Town", "Rural / Remote"],
    field: "livingLocation",
  },

  // ── Support & Fall Risk ──────────────────────────────────────────────────
  {
    id: "liveAlone", section: "Support & Recovery", type: "radio",
    label: "Do you currently live alone?",
    opts: ["Yes", "No"],
    field: "liveAlone",
  },
  {
    id: "caregiverAfterSurgery", section: "Support & Recovery", type: "radio",
    label: "Will you have someone to care for you after surgery?",
    opts: ["Yes, I have one", "No, I need help"],
    field: "caregiverAfterSurgery",
  },
  {
    id: "transportationReliable", section: "Support & Recovery", type: "radio",
    label: "Do you have reliable transportation to appointments?",
    opts: ["Always", "Sometimes", "No"],
    field: "transportationReliable",
  },
  {
    id: "fallHistory", section: "Support & Recovery", type: "radio",
    label: "Have you fallen in the past 12 months?",
    opts: ["Yes", "No"],
    field: "fallHistory",
  },
  {
    id: "dizzyOnStanding", section: "Support & Recovery", type: "radio",
    label: "Do you feel dizzy or lightheaded when you stand up?",
    opts: ["Yes", "No", "Sometimes"],
    field: "dizzyOnStanding",
  },
  {
    id: "surgeryBarrier", section: "Support & Recovery", type: "radio",
    label: "Are there any barriers that may prevent you from having surgery?",
    sublabel: "Financial, transportation, housing, childcare, etc.",
    opts: ["Yes", "No"],
    field: "surgeryBarrier",
  },

  // ── Health Screenings ─────────────────────────────────────────────────────
  {
    id: "visionProblems", section: "Health Screenings", type: "radio",
    label: "Do you have problems with your vision?",
    opts: ["Yes", "No"],
    field: "visionProblems",
  },
  {
    id: "hearingProblems", section: "Health Screenings", type: "radio",
    label: "Do you have problems with your hearing?",
    opts: ["Yes", "No"],
    field: "hearingProblems",
  },
  {
    id: "dentalIssues", section: "Health Screenings", type: "radio",
    label: "Do you have any dental concerns or loose teeth?",
    sublabel: "Relevant for anesthesia (breathing tubes)",
    opts: ["Yes", "No"],
    field: "dentalIssues",
  },
  {
    id: "fluVaccine", section: "Health Screenings", type: "radio",
    label: "Did you receive a flu vaccine this season?",
    opts: ["Yes", "No"],
    field: "fluVaccine",
  },
  {
    id: "covidVaccine", section: "Health Screenings", type: "radio",
    label: "Are you up to date with your COVID-19 vaccinations?",
    opts: ["Yes", "No"],
    field: "covidVaccine",
  },

  // ── Medications ──────────────────────────────────────────────────────────
  {
    id: "currentMedications", section: "Medications", type: "medications-text",
    label: "Please list all current medications",
    sublabel: "Include name, dose, and when you take them",
    field: "currentMedications",
  },

  // ── Consent ──────────────────────────────────────────────────────────────
  {
    id: "consent-group", section: "Consent & Privacy", type: "consent-group",
    label: "Review and consent",
    sublabel: "Please review the following consent statements",
  },
];

// ─── OptionCard ──────────────────────────────────────────────────────────────

function OptionCard({
  option, selected, onClick, readOnly,
}: {
  option: string; selected: boolean; onClick: () => void; readOnly: boolean;
}) {
  const Icon = OPTION_ICON[option] || Check;
  const colorCls = selected
    ? "border-[#1f64ad] bg-[#1f64ad]/5 text-[#1f64ad] shadow-md ring-2 ring-[#1f64ad]/20"
    : (OPTION_COLOR[option] ?? "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50");

  return (
    <button
      type="button"
      onClick={() => !readOnly && onClick()}
      disabled={readOnly}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 min-h-[90px] transition-all w-full",
        colorCls
      )}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1f64ad] flex items-center justify-center">
          <Check size={11} className="text-white" />
        </span>
      )}
      <Icon size={22} />
      <span className="text-[12px] font-bold leading-tight text-center">{option}</span>
    </button>
  );
}

// ─── CheckboxCard (multi-select) ─────────────────────────────────────────────

function CheckboxCard({
  option, selected, onClick,
}: {
  option: string; selected: boolean; onClick: () => void;
}) {
  const Icon = OPTION_ICON[option] || Check;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 min-h-[90px] transition-all w-full",
        selected
          ? "border-[#1f64ad] bg-[#1f64ad]/5 text-[#1f64ad] shadow-md ring-2 ring-[#1f64ad]/20"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1f64ad] flex items-center justify-center">
          <Check size={11} className="text-white" />
        </span>
      )}
      <Icon size={22} />
      <span className="text-[12px] font-bold leading-tight text-center">{option}</span>
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function HealthHistoryFormContent() {
  const [formData, setFormData] = useState<FormData>(getInitialData());
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof FormData, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const questions = useMemo(
    () => ALL_QUESTIONS.filter((q) => !q.showIf || q.showIf(formData)),
    [formData]
  );

  const total = questions.length;
  const q = questions[currentStep];
  const progress = ((currentStep + 1) / total) * 100;

  const canAdvance = () => {
    if (!q) return false;
    switch (q.type) {
      case "patient-info": return formData.legalFirstName.trim() !== "" && formData.legalLastName.trim() !== "" && formData.birthdate !== "";
      case "emergency-contact": return formData.emergencyContactName.trim() !== "";
      case "referring": return true;
      case "joint-select": return formData.jointHip || formData.jointKnee || formData.jointShoulder || formData.jointOther;
      case "imaging-select": return formData.imagingXray || formData.imagingMRI || formData.imagingCT || formData.imagingUltrasound || formData.imagingNone;
      case "conditions-select": return formData.medicalConditions !== "";
      case "medications-text": return true;
      case "consent-group": return formData.consentData !== "" && formData.consentElectronic !== "" && formData.consentShare !== "";
      case "radio": return q.field ? (formData[q.field] as string) !== "" : true;
      case "textarea": return (formData[q.field!] as string).trim() !== "";
      default: return true;
    }
  };

  const goNext = () => {
    if (currentStep < total - 1) setCurrentStep((s) => s + 1);
    else setSubmitted(true);
  };
  const goBack = () => setCurrentStep((s) => Math.max(0, s - 1));

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-display text-slate-900">History Submitted</h2>
          <p className="text-slate-500 text-sm">Thank you. Your health history has been recorded.</p>
        </div>
        <button
          onClick={() => { setFormData(getInitialData()); setCurrentStep(0); setSubmitted(false); }}
          className="px-6 py-2.5 rounded-lg bg-[#1f64ad] text-white text-sm font-semibold"
        >
          Start Over
        </button>
      </div>
    );
  }

  // ── Section label ──────────────────────────────────────────────────────────
  const sections = Array.from(new Set(ALL_QUESTIONS.map((q) => q.section)));
  const sectionIdx = sections.indexOf(q?.section ?? "");
  const sectionNum = sectionIdx + 1;

  // ── Render question body ───────────────────────────────────────────────────
  const renderBody = () => {
    if (!q) return null;

    // Patient info group
    if (q.type === "patient-info") {
      return (
        <div className="space-y-4 w-full max-w-lg">
          <div className="grid grid-cols-2 gap-3">
            {(["legalFirstName", "legalLastName"] as const).map((f, i) => (
              <div key={f} className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  {i === 0 ? "Legal First Name *" : "Legal Last Name *"}
                </label>
                <input
                  type="text"
                  value={formData[f]}
                  onChange={(e) => set(f, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[#1f64ad]/20 focus:border-[#1f64ad]"
                />
              </div>
            ))}
          </div>
          {([
            ["preferredName", "Preferred Name"],
            ["healthCareNumber", "Health Care Number *"],
            ["birthdate", "Date of Birth *"],
            ["primaryPhone", "Primary Phone"],
            ["email", "Email Address"],
            ["addressStreet", "Street Address"],
          ] as [keyof FormData, string][]).map(([f, label]) => (
            <div key={f} className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
              <input
                type={f === "birthdate" ? "date" : f === "email" ? "email" : "text"}
                value={formData[f] as string}
                onChange={(e) => set(f, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[#1f64ad]/20 focus:border-[#1f64ad]"
              />
            </div>
          ))}
          <div className="grid grid-cols-3 gap-3">
            {(["addressCity", "addressProvince", "addressPostalCode"] as const).map((f, i) => (
              <div key={f} className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  {["City", "Province", "Postal Code"][i]}
                </label>
                <input
                  type="text"
                  value={formData[f]}
                  onChange={(e) => set(f, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[#1f64ad]/20 focus:border-[#1f64ad]"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Emergency contact group
    if (q.type === "emergency-contact") {
      return (
        <div className="space-y-4 w-full max-w-lg">
          {([
            ["emergencyContactName", "Contact Name *"],
            ["emergencyContactRelationship", "Relationship to You"],
            ["emergencyContactPhone", "Phone Number"],
          ] as [keyof FormData, string][]).map(([f, label]) => (
            <div key={f} className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
              <input
                type="text"
                value={formData[f] as string}
                onChange={(e) => set(f, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[#1f64ad]/20 focus:border-[#1f64ad]"
              />
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Is this person your Substitute Decision Maker?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Yes", "No"].map((opt) => (
                <OptionCard
                  key={opt} option={opt}
                  selected={formData.emergencyContactIsSDM === opt}
                  onClick={() => set("emergencyContactIsSDM", opt)}
                  readOnly={false}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Do you have an advance directive / personal directive?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Yes", "No", "In progress"].map((opt) => (
                <OptionCard
                  key={opt} option={opt}
                  selected={formData.directiveStatus === opt}
                  onClick={() => set("directiveStatus", opt)}
                  readOnly={false}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Referring physician group
    if (q.type === "referring") {
      return (
        <div className="space-y-4 w-full max-w-lg">
          {([
            ["referringPhysicianName", "Referring Physician Name"],
            ["referringClinic", "Clinic"],
            ["referringPhysicianPhone", "Phone"],
            ["referralDate", "Referral Date"],
          ] as [keyof FormData, string][]).map(([f, label]) => (
            <div key={f} className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
              <input
                type={f === "referralDate" ? "date" : "text"}
                value={formData[f] as string}
                onChange={(e) => set(f, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[#1f64ad]/20 focus:border-[#1f64ad]"
              />
            </div>
          ))}
          {formData.hasFamilyPhysician === "Yes" && (
            <div className="grid grid-cols-2 gap-3">
              {(["familyPhysicianName", "familyPhysicianClinic"] as const).map((f, i) => (
                <div key={f} className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    {["Family Physician Name", "Family Physician Clinic"][i]}
                  </label>
                  <input
                    type="text" value={formData[f]}
                    onChange={(e) => set(f, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[#1f64ad]/20 focus:border-[#1f64ad]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Joint selection (multi-select)
    if (q.type === "joint-select") {
      const joints = ["Hip", "Knee", "Shoulder", "Other"];
      const jointFields: (keyof FormData)[] = ["jointHip", "jointKnee", "jointShoulder", "jointOther"];
      return (
        <div className="space-y-4 w-full max-w-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {joints.map((joint, i) => (
              <CheckboxCard
                key={joint} option={joint}
                selected={formData[jointFields[i]] as boolean}
                onClick={() => set(jointFields[i], !formData[jointFields[i]])}
              />
            ))}
          </div>
          {formData.jointOther && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Please specify</label>
              <input
                type="text" value={formData.jointOtherText}
                onChange={(e) => set("jointOtherText", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[#1f64ad]/20 focus:border-[#1f64ad]"
              />
            </div>
          )}
        </div>
      );
    }

    // Imaging selection (multi-select)
    if (q.type === "imaging-select") {
      const imagingOpts = [
        { label: "X-ray", field: "imagingXray" as keyof FormData },
        { label: "MRI", field: "imagingMRI" as keyof FormData },
        { label: "CT Scan", field: "imagingCT" as keyof FormData },
        { label: "Ultrasound", field: "imagingUltrasound" as keyof FormData },
        { label: "None available", field: "imagingNone" as keyof FormData },
      ];
      return (
        <div className="space-y-4 w-full max-w-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {imagingOpts.map(({ label, field }) => (
              <CheckboxCard
                key={label} option={label}
                selected={formData[field] as boolean}
                onClick={() => {
                  if (label === "None available") {
                    set("imagingNone", !formData.imagingNone);
                    if (!formData.imagingNone) {
                      set("imagingXray", false);
                      set("imagingMRI", false);
                      set("imagingCT", false);
                      set("imagingUltrasound", false);
                    }
                  } else {
                    set(field, !formData[field]);
                    set("imagingNone", false);
                  }
                }}
              />
            ))}
          </div>
          {(formData.imagingXray || formData.imagingMRI || formData.imagingCT || formData.imagingUltrasound) && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Where and when was imaging done?</label>
              <input
                type="text" value={formData.imagingWhereWhen}
                onChange={(e) => set("imagingWhereWhen", e.target.value)}
                placeholder="e.g. City Radiology Centre, Jan 2024"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[#1f64ad]/20 focus:border-[#1f64ad]"
              />
            </div>
          )}
        </div>
      );
    }

    // Medical conditions (multi-select)
    if (q.type === "conditions-select") {
      const conditions = [
        "Diabetes", "High blood pressure", "Heart disease", "Lung disease",
        "Kidney disease", "Sleep apnea", "Stroke", "Cancer",
        "Mental health condition", "Rheumatoid arthritis", "Osteoporosis",
        "None of these",
      ];
      const selected = formData.medicalConditions
        ? formData.medicalConditions.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const toggle = (c: string) => {
        if (c === "None of these") {
          set("medicalConditions", selected.includes("None of these") ? "" : "None of these");
        } else {
          const next = selected.includes(c)
            ? selected.filter((x) => x !== c)
            : [...selected.filter((x) => x !== "None of these"), c];
          set("medicalConditions", next.join(", "));
        }
      };
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg">
          {conditions.map((c) => (
            <CheckboxCard key={c} option={c} selected={selected.includes(c)} onClick={() => toggle(c)} />
          ))}
        </div>
      );
    }

    // Medications text (special large textarea)
    if (q.type === "medications-text") {
      return (
        <div className="space-y-3 w-full max-w-lg">
          <textarea
            value={formData.currentMedications}
            onChange={(e) => set("currentMedications", e.target.value)}
            rows={8}
            placeholder={"e.g.\nMetformin 500mg — twice daily\nRamipril 5mg — morning\nAtorvastatin 20mg — evening"}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-[#1f64ad]/20 focus:border-[#1f64ad] resize-none font-mono"
          />
          <p className="text-[11px] text-slate-400">Include vitamins, supplements, and over-the-counter medications</p>
        </div>
      );
    }

    // Consent group
    if (q.type === "consent-group") {
      const consents: { field: keyof FormData; text: string }[] = [
        { field: "consentData", text: "I consent to collection and use of my health information for the purpose of my care." },
        { field: "consentElectronic", text: "I consent to electronic communication of my health information with my care team." },
        { field: "consentShare", text: "I consent to my information being shared with relevant specialists involved in my care." },
      ];
      return (
        <div className="space-y-5 w-full max-w-lg">
          {consents.map(({ field, text }) => (
            <div key={field} className="space-y-2">
              <p className="text-[13px] text-slate-700 leading-relaxed">{text}</p>
              <div className="grid grid-cols-2 gap-3">
                {["I agree", "I do not agree"].map((opt) => (
                  <OptionCard
                    key={opt} option={opt}
                    selected={formData[field] === opt}
                    onClick={() => set(field, opt)}
                    readOnly={false}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Patient or Representative Signature</label>
            <input
              type="text" value={formData.signature}
              onChange={(e) => set("signature", e.target.value)}
              placeholder="Type full name as signature"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-[#1f64ad]/20 focus:border-[#1f64ad]"
            />
          </div>
        </div>
      );
    }

    // Radio
    if (q.type === "radio" && q.opts) {
      const cols = q.opts.length <= 2 ? "grid-cols-2" : q.opts.length <= 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4";
      return (
        <div className={cn("grid gap-3 w-full max-w-lg", cols)}>
          {q.opts.map((opt) => (
            <OptionCard
              key={opt} option={opt}
              selected={q.field ? formData[q.field] === opt : false}
              onClick={() => q.field && set(q.field, opt)}
              readOnly={false}
            />
          ))}
        </div>
      );
    }

    // Textarea
    if (q.type === "textarea" && q.field) {
      return (
        <textarea
          value={formData[q.field] as string}
          onChange={(e) => q.field && set(q.field, e.target.value)}
          rows={5}
          placeholder={q.sublabel || "Type your answer here..."}
          className="w-full max-w-lg bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-[#1f64ad]/20 focus:border-[#1f64ad] resize-none"
        />
      );
    }

    return null;
  };

  // ── Mini dot navigator ────────────────────────────────────────────────────
  const dotsToShow = Math.min(total, 15);
  const dotStart = Math.max(0, Math.min(currentStep - Math.floor(dotsToShow / 2), total - dotsToShow));

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      {/* Progress bar */}
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-[#1f64ad] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Section + counter */}
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#1f64ad]/80 bg-[#1f64ad]/8 px-2 py-0.5 rounded-full">
            {sectionNum}/{sections.length} · {q?.section}
          </span>
        </div>
        <span className="text-[12px] text-slate-400 font-medium">
          {currentStep + 1} / {total}
        </span>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 max-w-2xl mx-auto w-full">
        <div className="w-full space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight leading-snug">
              {q?.label}
            </h2>
            {q?.sublabel && (
              <p className="text-[13px] text-slate-500">{q.sublabel}</p>
            )}
          </div>
          {renderBody()}
        </div>
      </div>

      {/* Nav */}
      <div className="mt-10 flex items-center justify-between px-4 max-w-2xl mx-auto w-full">
        <button
          onClick={goBack}
          disabled={currentStep === 0}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
            currentStep === 0
              ? "opacity-30 cursor-not-allowed text-slate-400"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          <ChevronLeft size={16} />
          Back
        </button>

        {/* Dot progress */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: dotsToShow }).map((_, i) => {
            const stepIdx = dotStart + i;
            return (
              <button
                key={stepIdx}
                onClick={() => setCurrentStep(stepIdx)}
                className={cn(
                  "rounded-full transition-all",
                  stepIdx === currentStep
                    ? "w-5 h-2 bg-[#1f64ad]"
                    : stepIdx < currentStep
                    ? "w-2 h-2 bg-[#1f64ad]/40"
                    : "w-2 h-2 bg-slate-200"
                )}
              />
            );
          })}
        </div>

        <button
          onClick={goNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all bg-[#1f64ad] text-white shadow-md hover:bg-[#1a54a0]"
        >
          {currentStep === total - 1 ? "Submit" : "OK"}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
