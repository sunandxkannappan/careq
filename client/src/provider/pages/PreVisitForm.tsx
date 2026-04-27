import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft, ChevronRight, Check, CheckCircle2, Activity, Minus,
  TrendingDown, AlertTriangle, X, Video, MapPin, Users, Languages,
  Footprints, ArrowUp, ShoppingBag, Briefcase, Moon, Zap, Thermometer,
  Pill, Dumbbell, Shield, Syringe, Scale, Stethoscope, FlaskConical,
  Smartphone, Tablet, Laptop, Monitor, Volume2, Wifi, Lock,
  MessageSquare, ClipboardList, HeartPulse, Brain, RefreshCw,
  TrendingUp, Ban, Calendar, User,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PreVisitFormData {
  patientName: string; dob: string; date: string;
  jointAssessed: string; referringClinician: string; nhiMrn: string;
  a1: string; a2: string; a3: string; a4: string; a5: string; a6: string;
  b1: string; b2: string; b3: string; b4: string; b5: string; b6: string;
  c1: string; c2: string; c3: string; c4: string;
  d1Treatments: { physio: boolean; bracing: boolean; antiInflammatories: boolean; injections: boolean; weightLoss: boolean; exercise: boolean; acupuncture: boolean; otherTreatment: boolean };
  d2: string; d3: string; d4: string; d5Medications: string;
  appointmentDate: string; appointmentType: string; canAttend: string;
  needsInterpreter: string; interpreterLanguage: string; supportPerson: string;
  jointToday: string; symptomChange: string; painRest: string; painActivity: string;
  symptomIncreasePain: boolean; symptomSwelling: boolean; symptomGivingWay: boolean;
  symptomFall: boolean; symptomWalkingDifficulty: boolean; symptomNeuro: boolean;
  symptomFever: boolean; symptomNone: boolean; symptomDescription: string;
  medsChanged: string; medsChangedDetails: string; painMedicationType: string;
  opioidAdequate: string; newTreatments: string; newTreatmentsDetails: string;
  functionalChange: string; walkingAbility: string; fallsInPastMonth: string;
  fallsCount: string; mainIssue: string; questionsForTeam: string;
  otherCareTeamNotes: string; techChecked: string; deviceType: string;
  deviceTypeOther: string; privateSpace: string;
}

function getInitialData(): PreVisitFormData {
  return {
    patientName: "", dob: "", date: new Date().toISOString().split("T")[0],
    jointAssessed: "", referringClinician: "", nhiMrn: "",
    a1: "", a2: "", a3: "", a4: "", a5: "", a6: "",
    b1: "", b2: "", b3: "", b4: "", b5: "", b6: "",
    c1: "", c2: "", c3: "", c4: "",
    d1Treatments: { physio: false, bracing: false, antiInflammatories: false, injections: false, weightLoss: false, exercise: false, acupuncture: false, otherTreatment: false },
    d2: "", d3: "", d4: "", d5Medications: "",
    appointmentDate: new Date().toISOString().split("T")[0],
    appointmentType: "", canAttend: "", needsInterpreter: "", interpreterLanguage: "",
    supportPerson: "", jointToday: "", symptomChange: "", painRest: "", painActivity: "",
    symptomIncreasePain: false, symptomSwelling: false, symptomGivingWay: false,
    symptomFall: false, symptomWalkingDifficulty: false, symptomNeuro: false,
    symptomFever: false, symptomNone: false, symptomDescription: "",
    medsChanged: "", medsChangedDetails: "", painMedicationType: "", opioidAdequate: "",
    newTreatments: "", newTreatmentsDetails: "", functionalChange: "", walkingAbility: "",
    fallsInPastMonth: "", fallsCount: "", mainIssue: "", questionsForTeam: "",
    otherCareTeamNotes: "", techChecked: "", deviceType: "", deviceTypeOther: "", privateSpace: "",
  };
}

// ─── Question definitions ─────────────────────────────────────────────────────

type Icon = React.ElementType;
interface Opt { v: string; l: string; icon: Icon; cls?: string }
interface Q {
  id: string;
  section: string;
  label: string;
  source?: string;
  type: "radio" | "checkbox-group" | "scale" | "text" | "date" | "textarea" | "patient-info" | "treatments";
  opts?: Opt[];
  field?: keyof PreVisitFormData;
  showIf?: (d: PreVisitFormData) => boolean;
}

// Severity 5-option palette (low→high severity)
const S5 = (labels: string[], icons: Icon[]): Opt[] =>
  labels.map((l, i) => ({
    v: String(i), l,
    icon: icons[i],
    cls: [
      "border-green-200 bg-green-50 text-green-800",
      "border-blue-200 bg-blue-50 text-blue-800",
      "border-slate-200 bg-slate-50 text-slate-700",
      "border-amber-200 bg-amber-50 text-amber-800",
      "border-red-200 bg-red-50 text-red-800",
    ][i],
  }));

const painIcons: Icon[] = [CheckCircle2, Activity, Minus, TrendingDown, AlertTriangle];
const diffIcons: Icon[] = [CheckCircle2, Minus, Activity, TrendingDown, Ban];
const freqIcons: Icon[] = [CheckCircle2, Minus, Activity, TrendingDown, AlertTriangle];

const ALL_QUESTIONS: Q[] = [
  // ── Patient Info (special group screen) ──────────────────────────────────
  { id: "patient-info", section: "Patient Information", label: "Let's start with some basic information.", type: "patient-info" },

  // ── Joint for today ──────────────────────────────────────────────────────
  { id: "jointToday", section: "Appointment", label: "Which joint are we focusing on today?", type: "radio", field: "jointToday",
    opts: [
      { v: "left-hip",   l: "Left Hip",   icon: Footprints, cls: "border-blue-200 bg-blue-50 text-blue-800" },
      { v: "right-hip",  l: "Right Hip",  icon: Footprints, cls: "border-blue-200 bg-blue-50 text-blue-800" },
      { v: "left-knee",  l: "Left Knee",  icon: Footprints, cls: "border-violet-200 bg-violet-50 text-violet-800" },
      { v: "right-knee", l: "Right Knee", icon: Footprints, cls: "border-violet-200 bg-violet-50 text-violet-800" },
    ],
  },
  { id: "appointmentType", section: "Appointment", label: "What type is your upcoming appointment?", type: "radio", field: "appointmentType",
    opts: [
      { v: "virtual",   l: "Virtual",   icon: Video,   cls: "border-blue-200 bg-blue-50 text-blue-800" },
      { v: "in-person", l: "In-person", icon: MapPin,  cls: "border-green-200 bg-green-50 text-green-800" },
    ],
  },
  { id: "canAttend", section: "Appointment", label: "Can you attend this appointment?", type: "radio", field: "canAttend",
    opts: [
      { v: "yes", l: "Yes, I'll be there",          icon: Check, cls: "border-green-200 bg-green-50 text-green-800" },
      { v: "no",  l: "No — I need to reschedule",   icon: X,     cls: "border-red-200 bg-red-50 text-red-700" },
    ],
  },
  { id: "needsInterpreter", section: "Appointment", label: "Do you require an interpreter?", type: "radio", field: "needsInterpreter",
    opts: [
      { v: "no",  l: "No",              icon: Check,     cls: "border-green-200 bg-green-50 text-green-800" },
      { v: "yes", l: "Yes — I do",      icon: Languages, cls: "border-amber-200 bg-amber-50 text-amber-800" },
    ],
  },
  { id: "interpreterLanguage", section: "Appointment", label: "What language do you need?", type: "text", field: "interpreterLanguage",
    showIf: d => d.needsInterpreter === "yes",
  },
  { id: "supportPerson", section: "Appointment", label: "Will a caregiver or support person be joining you?", type: "radio", field: "supportPerson",
    opts: [
      { v: "no",  l: "No",  icon: User,  cls: "border-slate-200 bg-slate-50 text-slate-700" },
      { v: "yes", l: "Yes", icon: Users, cls: "border-blue-200 bg-blue-50 text-blue-800" },
    ],
  },

  // ── Section A — Pain ─────────────────────────────────────────────────────
  { id: "a1", section: "A: Pain & Symptoms", source: "OHS Q1 / OKS Q1",
    label: "How would you describe the pain you usually have from your hip/knee?",
    type: "radio", field: "a1",
    opts: S5(["None (0)", "Very mild (1)", "Mild (2)", "Moderate (3)", "Severe (4)"], painIcons),
  },
  { id: "a2", section: "A: Pain & Symptoms", source: "WOMAC P2",
    label: "How much pain do you experience when walking or bearing weight on the joint?",
    type: "radio", field: "a2",
    opts: S5(["None (0)", "Mild (1)", "Moderate (2)", "Severe (3)", "Extreme (4)"], painIcons),
  },
  { id: "a3", section: "A: Pain & Symptoms", source: "WOMAC P4",
    label: "How much pain or discomfort do you have when sitting, lying, or resting?",
    type: "radio", field: "a3",
    opts: S5(["None (0)", "Mild (1)", "Moderate (2)", "Severe (3)", "Extreme (4)"], painIcons),
  },
  { id: "a4", section: "A: Pain & Symptoms", source: "OHS Q12",
    label: "How often have you been troubled by pain at night in bed (past month)?",
    type: "radio", field: "a4",
    opts: S5(["Not at all (0)", "1–2 nights (1)", "Some nights (2)", "Most nights (3)", "Every night (4)"], [CheckCircle2, Moon, Moon, Moon, AlertTriangle]),
  },
  { id: "a5", section: "A: Pain & Symptoms", source: "OHS Q10",
    label: "Have you had sudden, severe pain (shooting, stabbing, spasms) from this joint?",
    type: "radio", field: "a5",
    opts: S5(["No days (0)", "1–2 days/mo (1)", "1–2 days/wk (2)", "Most days (3)", "Every day (4)"], [CheckCircle2, Minus, Activity, TrendingDown, Zap]),
  },
  { id: "a6", section: "A: Pain & Symptoms", source: "WOMAC S1",
    label: "How severe is your joint stiffness after first waking in the morning?",
    type: "radio", field: "a6",
    opts: S5(["None (0)", "Mild (1)", "Moderate (2)", "Severe (3)", "Extreme (4)"], painIcons),
  },

  // ── Section B — Function ─────────────────────────────────────────────────
  { id: "b1", section: "B: Functional Impact", source: "OHS Q6",
    label: "How far are you able to walk before pain becomes severe?",
    type: "radio", field: "b1",
    opts: S5(["No limitation (0)", "> 30 min (1)", "16–30 min (2)", "6–15 min (3)", "< 5 min / housebound (4)"], [Footprints, Footprints, Footprints, Footprints, Ban]),
  },
  { id: "b2", section: "B: Functional Impact", source: "OHS Q7",
    label: "How much difficulty going up and down stairs?",
    type: "radio", field: "b2",
    opts: S5(["None (0)", "Slight (1)", "Moderate (2)", "Severe (3)", "Unable (4)"], diffIcons),
  },
  { id: "b3", section: "B: Functional Impact", source: "OHS Q8",
    label: "How much difficulty rising from a chair after sitting?",
    type: "radio", field: "b3",
    opts: S5(["None (0)", "Slight (1)", "Moderate (2)", "Severe (3)", "Unable (4)"], diffIcons),
  },
  { id: "b4", section: "B: Functional Impact", source: "OHS Q2",
    label: "Difficulty washing, drying, or managing footwear?",
    type: "radio", field: "b4",
    opts: S5(["No trouble (0)", "A little (1)", "Moderate (2)", "Extreme (3)", "Impossible (4)"], diffIcons),
  },
  { id: "b5", section: "B: Functional Impact", source: "OHS Q5",
    label: "Could you do shopping or community outings on your own?",
    type: "radio", field: "b5",
    opts: S5(["Yes, easily (0)", "Little difficulty (1)", "Moderate (2)", "Great difficulty (3)", "Impossible (4)"], [CheckCircle2, ShoppingBag, ShoppingBag, TrendingDown, Ban]),
  },
  { id: "b6", section: "B: Functional Impact", source: "OHS Q11",
    label: "How much has pain interfered with your usual work or housework?",
    type: "radio", field: "b6",
    opts: S5(["Not at all (0)", "A little (1)", "Moderately (2)", "Greatly (3)", "Totally (4)"], [CheckCircle2, Briefcase, Briefcase, TrendingDown, AlertTriangle]),
  },

  // ── Section C — Quality of Life ──────────────────────────────────────────
  { id: "c1", section: "C: Quality of Life", source: "EQ-5D VAS",
    label: "On a scale of 0–10, how would you rate your overall health today? (0 = worst, 10 = best)",
    type: "scale", field: "c1",
  },
  { id: "c2", section: "C: Quality of Life", source: "EQ-5D Dim 5",
    label: "How much has your joint problem affected your mood or emotional wellbeing?",
    type: "radio", field: "c2",
    opts: [
      { v: "0", l: "Not at all",  icon: CheckCircle2, cls: "border-green-200 bg-green-50 text-green-800" },
      { v: "1", l: "Slightly",    icon: Minus,        cls: "border-blue-200 bg-blue-50 text-blue-800" },
      { v: "2", l: "Moderately",  icon: Brain,        cls: "border-amber-200 bg-amber-50 text-amber-800" },
      { v: "3", l: "Severely",    icon: AlertTriangle, cls: "border-red-200 bg-red-50 text-red-800" },
    ],
  },
  { id: "c3", section: "C: Quality of Life", source: "FJS-12",
    label: "How often are you aware of your problem joint during daily activities?",
    type: "radio", field: "c3",
    opts: S5(["Never (0)", "Almost never (1)", "Sometimes (2)", "Most of the time (3)", "Constantly (4)"], freqIcons),
  },
  { id: "c4", section: "C: Quality of Life", source: "KOOS/HOOS QoL",
    label: "How much have you had to change or give up activities you enjoy?",
    type: "radio", field: "c4",
    opts: S5(["Not at all (0)", "Mildly (1)", "Moderately (2)", "Severely (3)", "Completely (4)"], [CheckCircle2, Activity, Minus, TrendingDown, Ban]),
  },

  // ── Section D — Management ───────────────────────────────────────────────
  { id: "d1", section: "D: Attempted Management", source: "HKPT Item 7",
    label: "Which treatments have you tried for this joint? (select all that apply)",
    type: "treatments",
  },
  { id: "d2", section: "D: Attempted Management", source: "HKPT",
    label: "How long have you been receiving non-surgical treatment?",
    type: "radio", field: "d2",
    opts: [
      { v: "0", l: "Haven't tried",  icon: X,           cls: "border-slate-200 bg-slate-50 text-slate-700" },
      { v: "1", l: "< 3 months",     icon: Activity,    cls: "border-blue-200 bg-blue-50 text-blue-800" },
      { v: "2", l: "3–6 months",     icon: Calendar,    cls: "border-blue-200 bg-blue-50 text-blue-800" },
      { v: "3", l: "6–12 months",    icon: Calendar,    cls: "border-amber-200 bg-amber-50 text-amber-800" },
      { v: "4", l: "> 12 months",    icon: AlertTriangle, cls: "border-red-200 bg-red-50 text-red-800" },
    ],
  },
  { id: "d3", section: "D: Attempted Management", source: "HKPT",
    label: "Overall, how much benefit have you gotten from treatments you've tried?",
    type: "radio", field: "d3",
    opts: [
      { v: "0", l: "Good relief — joint manageable",           icon: CheckCircle2, cls: "border-green-200 bg-green-50 text-green-800" },
      { v: "1", l: "Some relief — still significant limitation", icon: Activity,   cls: "border-blue-200 bg-blue-50 text-blue-800" },
      { v: "2", l: "Minimal relief — partially helped",         icon: Minus,      cls: "border-amber-200 bg-amber-50 text-amber-800" },
      { v: "4", l: "No relief — treatments not helpful",        icon: AlertTriangle, cls: "border-red-200 bg-red-50 text-red-800" },
    ],
  },
  { id: "d4", section: "D: Attempted Management", source: "WOMAC/HKPT",
    label: "How often do you take pain medication for this joint?",
    type: "radio", field: "d4",
    opts: S5(["Never (0)", "Occasionally (1)", "Several days/wk (2)", "Daily (3)", "Daily & inadequate (4)"], [CheckCircle2, Pill, Pill, Pill, AlertTriangle]),
  },
  { id: "d5Medications", section: "D: Attempted Management",
    label: "List any current medications you are taking for this joint:",
    type: "textarea", field: "d5Medications",
  },

  // ── Symptom Update ───────────────────────────────────────────────────────
  { id: "symptomChange", section: "Symptom Update",
    label: "Since your last appointment, how have your symptoms changed overall?",
    type: "radio", field: "symptomChange",
    opts: [
      { v: "significantly-improved", l: "Significantly improved", icon: TrendingUp,   cls: "border-green-200 bg-green-50 text-green-800" },
      { v: "slightly-improved",      l: "Slightly improved",      icon: TrendingUp,   cls: "border-blue-200 bg-blue-50 text-blue-800" },
      { v: "no-change",              l: "No change",              icon: Minus,        cls: "border-slate-200 bg-slate-50 text-slate-700" },
      { v: "slightly-worse",         l: "Slightly worse",         icon: TrendingDown, cls: "border-amber-200 bg-amber-50 text-amber-800" },
      { v: "significantly-worse",    l: "Significantly worse",    icon: AlertTriangle, cls: "border-red-200 bg-red-50 text-red-800" },
    ],
  },
  { id: "painRest", section: "Symptom Update",
    label: "Current pain level at rest (0 = no pain, 10 = worst imaginable)",
    type: "scale", field: "painRest",
  },
  { id: "painActivity", section: "Symptom Update",
    label: "Current pain level with activity (0 = no pain, 10 = worst imaginable)",
    type: "scale", field: "painActivity",
  },
  { id: "symptomFlags", section: "Symptom Update",
    label: "Have you had any of the following since your last appointment? (tick all that apply)",
    type: "checkbox-group",
  },
  { id: "symptomDescription", section: "Symptom Update",
    label: "If you ticked any of the above, please describe briefly:",
    type: "textarea", field: "symptomDescription",
  },

  // ── Medications ──────────────────────────────────────────────────────────
  { id: "medsChanged", section: "Medications",
    label: "Have there been any changes to your medications since your last appointment?",
    type: "radio", field: "medsChanged",
    opts: [
      { v: "no",  l: "No changes",         icon: Check,    cls: "border-green-200 bg-green-50 text-green-800" },
      { v: "yes", l: "Yes — changes made", icon: RefreshCw, cls: "border-amber-200 bg-amber-50 text-amber-800" },
    ],
  },
  { id: "medsChangedDetails", section: "Medications",
    label: "Please describe the medication changes:",
    type: "textarea", field: "medsChangedDetails",
    showIf: d => d.medsChanged === "yes",
  },
  { id: "painMedicationType", section: "Medications",
    label: "Are you currently taking pain medication for this joint?",
    type: "radio", field: "painMedicationType",
    opts: [
      { v: "none",                  l: "None",                      icon: Ban,         cls: "border-slate-200 bg-slate-50 text-slate-700" },
      { v: "otc",                   l: "Over-the-counter",          icon: Pill,        cls: "border-blue-200 bg-blue-50 text-blue-800" },
      { v: "prescription-non-opioid", l: "Prescription (non-opioid)", icon: Stethoscope, cls: "border-amber-200 bg-amber-50 text-amber-800" },
      { v: "prescription-opioid",   l: "Prescription opioid",       icon: AlertTriangle, cls: "border-red-200 bg-red-50 text-red-800" },
    ],
  },
  { id: "opioidAdequate", section: "Medications",
    label: "Is your opioid medication providing adequate pain control?",
    type: "radio", field: "opioidAdequate",
    showIf: d => d.painMedicationType === "prescription-opioid",
    opts: [
      { v: "yes",     l: "Yes, adequate",          icon: CheckCircle2,  cls: "border-green-200 bg-green-50 text-green-800" },
      { v: "partial", l: "Partial relief",          icon: Minus,         cls: "border-amber-200 bg-amber-50 text-amber-800" },
      { v: "no",      l: "No — inadequate control", icon: AlertTriangle, cls: "border-red-200 bg-red-50 text-red-800" },
    ],
  },
  { id: "newTreatments", section: "Medications",
    label: "Have you started any new treatments since your last visit?",
    type: "radio", field: "newTreatments",
    opts: [
      { v: "no",  l: "No",                icon: X,     cls: "border-slate-200 bg-slate-50 text-slate-700" },
      { v: "yes", l: "Yes — please share", icon: Check, cls: "border-blue-200 bg-blue-50 text-blue-800" },
    ],
  },
  { id: "newTreatmentsDetails", section: "Medications",
    label: "Describe the new treatment(s):",
    type: "textarea", field: "newTreatmentsDetails",
    showIf: d => d.newTreatments === "yes",
  },

  // ── Functional Status ────────────────────────────────────────────────────
  { id: "functionalChange", section: "Functional Status",
    label: "Compared to your last appointment, your ability to perform daily activities is:",
    type: "radio", field: "functionalChange",
    opts: [
      { v: "better", l: "Better",        icon: TrendingUp,   cls: "border-green-200 bg-green-50 text-green-800" },
      { v: "same",   l: "About the same", icon: Minus,       cls: "border-slate-200 bg-slate-50 text-slate-700" },
      { v: "worse",  l: "Worse",          icon: TrendingDown, cls: "border-red-200 bg-red-50 text-red-800" },
    ],
  },
  { id: "walkingAbility", section: "Functional Status",
    label: "Are you currently able to walk outside your home?",
    type: "radio", field: "walkingAbility",
    opts: [
      { v: "no-difficulty",  l: "Yes, without difficulty", icon: Footprints, cls: "border-green-200 bg-green-50 text-green-800" },
      { v: "with-difficulty", l: "Yes, with difficulty",   icon: Activity,   cls: "border-amber-200 bg-amber-50 text-amber-800" },
      { v: "housebound",      l: "No, housebound",         icon: Ban,        cls: "border-red-200 bg-red-50 text-red-800" },
    ],
  },
  { id: "fallsInPastMonth", section: "Functional Status",
    label: "Have you had any falls in the past month related to this joint?",
    type: "radio", field: "fallsInPastMonth",
    opts: [
      { v: "no",  l: "No",  icon: CheckCircle2, cls: "border-green-200 bg-green-50 text-green-800" },
      { v: "yes", l: "Yes", icon: AlertTriangle, cls: "border-red-200 bg-red-50 text-red-800" },
    ],
  },
  { id: "fallsCount", section: "Functional Status",
    label: "How many falls have you had?",
    type: "text", field: "fallsCount",
    showIf: d => d.fallsInPastMonth === "yes",
  },

  // ── Agenda ───────────────────────────────────────────────────────────────
  { id: "mainIssue", section: "Agenda",
    label: "What is the main thing you would like to address in today's appointment?",
    type: "textarea", field: "mainIssue",
  },
  { id: "questionsForTeam", section: "Agenda",
    label: "Do you have specific questions for your care team today?",
    type: "textarea", field: "questionsForTeam",
  },
  { id: "otherCareTeamNotes", section: "Agenda",
    label: "Is there anything else you would like your care team to know?",
    type: "textarea", field: "otherCareTeamNotes",
  },

  // ── Tech check ───────────────────────────────────────────────────────────
  { id: "techChecked", section: "Tech Check",
    label: "Have you tested your device, camera, and microphone for this appointment?",
    type: "radio", field: "techChecked",
    opts: [
      { v: "yes", l: "Yes, all working",          icon: Wifi,  cls: "border-green-200 bg-green-50 text-green-800" },
      { v: "no",  l: "No — I need help",          icon: X,     cls: "border-red-200 bg-red-50 text-red-800" },
      { v: "na",  l: "N/A — In-person visit",     icon: MapPin, cls: "border-slate-200 bg-slate-50 text-slate-700" },
    ],
  },
  { id: "deviceType", section: "Tech Check",
    label: "What device will you be using?",
    type: "radio", field: "deviceType",
    opts: [
      { v: "smartphone", l: "Smartphone", icon: Smartphone, cls: "border-blue-200 bg-blue-50 text-blue-800" },
      { v: "tablet",     l: "Tablet",     icon: Tablet,     cls: "border-blue-200 bg-blue-50 text-blue-800" },
      { v: "laptop",     l: "Laptop",     icon: Laptop,     cls: "border-blue-200 bg-blue-50 text-blue-800" },
      { v: "other",      l: "Other",      icon: Monitor,    cls: "border-slate-200 bg-slate-50 text-slate-700" },
    ],
  },
  { id: "privateSpace", section: "Tech Check",
    label: "Do you have a private, quiet space available for this appointment?",
    type: "radio", field: "privateSpace",
    opts: [
      { v: "yes", l: "Yes, private space ready",     icon: Lock, cls: "border-green-200 bg-green-50 text-green-800" },
      { v: "no",  l: "No — limited privacy",         icon: Volume2, cls: "border-amber-200 bg-amber-50 text-amber-800" },
    ],
  },
];

// ─── Pictorial Option Card ────────────────────────────────────────────────────

function OptionCard({ opt, selected, onClick }: { opt: Opt; selected: boolean; onClick: () => void }) {
  const Icon = opt.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-150 text-center min-h-[96px] cursor-pointer select-none",
        selected
          ? "border-primary bg-primary/5 text-primary shadow-md ring-2 ring-primary/20"
          : (opt.cls ?? "border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:bg-blue-50/20")
      )}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
          <Check size={11} />
        </span>
      )}
      <Icon size={24} className={selected ? "text-primary" : undefined} />
      <span className="text-[12px] font-bold leading-snug">{opt.l}</span>
    </button>
  );
}

// ─── Pain Scale ──────────────────────────────────────────────────────────────

function PainScale({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const scoreColor = (v: number) =>
    v <= 2 ? "bg-green-500 text-white border-green-500"
    : v <= 4 ? "bg-lime-500 text-white border-lime-500"
    : v <= 6 ? "bg-amber-500 text-white border-amber-500"
    : v <= 8 ? "bg-orange-500 text-white border-orange-500"
    : "bg-red-500 text-white border-red-500";
  const label = (v: number) => v === 0 ? "No pain" : v <= 3 ? "Mild" : v <= 5 ? "Moderate" : v <= 7 ? "Severe" : v <= 9 ? "Very severe" : "Worst possible";

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-1">
        <span>0 — No pain</span><span>10 — Worst possible</span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: 11 }, (_, i) => (
          <button key={i} type="button" onClick={() => onChange(String(i))}
            className={cn(
              "w-11 h-11 rounded-full border-2 font-black text-[14px] transition-all",
              value === String(i) ? scoreColor(i) + " scale-110 shadow-lg" : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
            )}
          >{i}</button>
        ))}
      </div>
      {value !== "" && (
        <p className={cn("text-center text-[13px] font-bold",
          Number(value) <= 3 ? "text-green-600" : Number(value) <= 6 ? "text-amber-600" : "text-red-600"
        )}>{label(Number(value))} — {value}/10</p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PreVisitForm() {
  const [qIdx, setQIdx] = useState(0);
  const [formData, setFormData] = useState<PreVisitFormData>(getInitialData);
  const [submitted, setSubmitted] = useState(false);

  const update = useCallback((patch: Partial<PreVisitFormData>) => {
    setFormData(prev => ({ ...prev, ...patch }));
  }, []);

  const questions = useMemo(
    () => ALL_QUESTIONS.filter(q => !q.showIf || q.showIf(formData)),
    [formData]
  );

  const currentQ = questions[qIdx];
  const progress = ((qIdx + 1) / questions.length) * 100;

  const goNext = () => {
    if (qIdx < questions.length - 1) setQIdx(i => i + 1);
    else setSubmitted(true);
  };
  const goPrev = () => { if (qIdx > 0) setQIdx(i => i - 1); };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-5">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold font-display text-slate-900">Pre-Visit Form Submitted</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">Thank you, {formData.patientName || "patient"}. Your responses have been recorded for your care team.</p>
        </div>
        <button onClick={() => { setSubmitted(false); setQIdx(0); }}
          className="text-sm font-semibold text-primary hover:underline">
          Review responses
        </button>
      </div>
    );
  }

  const renderQuestion = (q: Q) => {
    // ── Patient Info group ──────────────────────────────────────────────────
    if (q.type === "patient-info") {
      return (
        <div className="space-y-4 w-full max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Patient Name</label>
              <input value={formData.patientName} onChange={e => update({ patientName: e.target.value })}
                placeholder="Full name" className="w-full border-b-2 border-slate-200 focus:border-primary outline-none py-2 text-[15px] bg-transparent" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Date of Birth</label>
              <DatePicker value={formData.dob} onChange={v => update({ dob: v })} placeholder="Select DOB" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Assessment Date</label>
              <DatePicker value={formData.date} onChange={v => update({ date: v })} placeholder="Select date" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">NHI / MRN</label>
              <input value={formData.nhiMrn} onChange={e => update({ nhiMrn: e.target.value })}
                placeholder="Patient ID" className="w-full border-b-2 border-slate-200 focus:border-primary outline-none py-2 text-[15px] bg-transparent" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Referring Clinician</label>
            <input value={formData.referringClinician} onChange={e => update({ referringClinician: e.target.value })}
              placeholder="Dr. ..." className="w-full border-b-2 border-slate-200 focus:border-primary outline-none py-2 text-[15px] bg-transparent" />
          </div>
        </div>
      );
    }

    // ── Treatments checkbox group ───────────────────────────────────────────
    if (q.type === "treatments") {
      const tx = formData.d1Treatments;
      const items: { key: keyof typeof tx; l: string; icon: Icon }[] = [
        { key: "physio",            l: "Physiotherapy",       icon: Dumbbell },
        { key: "bracing",           l: "Bracing",             icon: Shield },
        { key: "antiInflammatories", l: "Anti-inflammatories", icon: Pill },
        { key: "injections",        l: "Injections",          icon: FlaskConical },
        { key: "weightLoss",        l: "Weight loss",         icon: Scale },
        { key: "exercise",          l: "Exercise program",    icon: Activity },
        { key: "acupuncture",       l: "Acupuncture",         icon: Stethoscope },
        { key: "otherTreatment",    l: "Other",               icon: ClipboardList },
      ];
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mx-auto">
          {items.map(item => {
            const checked = tx[item.key];
            const Icon = item.icon;
            return (
              <button key={item.key} type="button"
                onClick={() => update({ d1Treatments: { ...tx, [item.key]: !checked } })}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 min-h-[90px] transition-all",
                  checked ? "border-primary bg-primary/5 text-primary shadow-md ring-2 ring-primary/20" : "border-slate-200 bg-white text-slate-600 hover:border-primary/30"
                )}
              >
                {checked && <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center"><Check size={9} /></span>}
                <Icon size={22} className={checked ? "text-primary" : undefined} />
                <span className="text-[11px] font-bold text-center leading-snug">{item.l}</span>
              </button>
            );
          })}
        </div>
      );
    }

    // ── Red flag symptoms checkbox group ───────────────────────────────────
    if (q.type === "checkbox-group") {
      const flags: { field: keyof PreVisitFormData; l: string; icon: Icon }[] = [
        { field: "symptomIncreasePain",    l: "Sudden increase in pain",         icon: AlertTriangle },
        { field: "symptomSwelling",        l: "New swelling or redness",         icon: HeartPulse },
        { field: "symptomGivingWay",       l: "Joint giving way or locking",     icon: Zap },
        { field: "symptomFall",            l: "Fall related to the joint",       icon: Activity },
        { field: "symptomWalkingDifficulty", l: "New difficulty walking",        icon: Footprints },
        { field: "symptomNeuro",           l: "Numbness / tingling / weakness",  icon: Brain },
        { field: "symptomFever",           l: "Fever or chills",                 icon: Thermometer },
        { field: "symptomNone",            l: "None of the above",               icon: CheckCircle2 },
      ];
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mx-auto">
          {flags.map(f => {
            const checked = formData[f.field] as boolean;
            const Icon = f.icon;
            return (
              <button key={f.field} type="button"
                onClick={() => update({ [f.field]: !checked } as any)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 min-h-[80px] transition-all text-center",
                  checked ? "border-primary bg-primary/5 text-primary shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-primary/30",
                  f.field === "symptomNone" ? (checked ? "" : "border-green-200 bg-green-50 text-green-700") : ""
                )}
              >
                <Icon size={20} />
                <span className="text-[11px] font-bold leading-snug">{f.l}</span>
              </button>
            );
          })}
        </div>
      );
    }

    // ── Pain scale ─────────────────────────────────────────────────────────
    if (q.type === "scale") {
      const val = String(formData[q.field!] ?? "");
      return <PainScale value={val} onChange={v => update({ [q.field!]: v } as any)} />;
    }

    // ── Radio options ──────────────────────────────────────────────────────
    if (q.type === "radio" && q.opts) {
      const val = formData[q.field!];
      const cols = q.opts.length <= 2 ? "grid-cols-2" : q.opts.length <= 4 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";
      return (
        <div className={cn("grid gap-3 w-full max-w-2xl mx-auto", cols)}>
          {q.opts.map(opt => (
            <OptionCard key={opt.v} opt={opt} selected={val === opt.v}
              onClick={() => update({ [q.field!]: opt.v } as any)} />
          ))}
        </div>
      );
    }

    // ── Text / date ────────────────────────────────────────────────────────
    if (q.type === "text" || q.type === "date") {
      const val = String(formData[q.field!] ?? "");
      if (q.type === "date") {
        return <div className="w-full max-w-xs mx-auto"><DatePicker value={val} onChange={v => update({ [q.field!]: v } as any)} placeholder="Select date" /></div>;
      }
      return (
        <input autoFocus value={val} onChange={e => update({ [q.field!]: e.target.value } as any)}
          onKeyDown={e => e.key === "Enter" && goNext()}
          placeholder="Type your answer..."
          className="w-full max-w-lg mx-auto block bg-transparent border-0 border-b-2 border-slate-300 focus:border-primary outline-none text-2xl font-bold text-slate-800 placeholder:text-slate-300 py-3 text-center transition-colors"
        />
      );
    }

    // ── Textarea ───────────────────────────────────────────────────────────
    if (q.type === "textarea") {
      const val = String(formData[q.field!] ?? "");
      return (
        <textarea autoFocus value={val} onChange={e => update({ [q.field!]: e.target.value } as any)}
          placeholder="Type your answer..." rows={4}
          className="w-full max-w-lg mx-auto block bg-slate-50 border border-slate-200 rounded-2xl outline-none text-[14px] text-slate-700 placeholder:text-slate-400 px-5 py-4 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
        />
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 200px)" }}>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-primary transition-all duration-500 ease-out rounded-full" style={{ width: `${progress}%` }} />
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between mb-6 text-[12px]">
        <span className="font-bold text-slate-400 uppercase tracking-wide">{currentQ.section}</span>
        <div className="flex items-center gap-2">
          {currentQ.source && <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">{currentQ.source}</span>}
          <span className="font-bold text-slate-400">{qIdx + 1} / {questions.length}</span>
        </div>
      </div>

      {/* Question + answer */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-4">
        <h2 className="text-[22px] font-black text-slate-900 leading-snug tracking-tight text-center max-w-2xl">
          {currentQ.label}
        </h2>
        {renderQuestion(currentQ)}
        {currentQ.type === "text" && (
          <p className="text-[11px] text-slate-400">Press Enter to continue</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 mt-auto">
        <button onClick={goPrev} disabled={qIdx === 0}
          className="flex items-center gap-2 text-[13px] font-bold text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-20 group">
          <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Mini dots */}
        <div className="flex items-center gap-1.5">
          {questions.slice(Math.max(0, qIdx - 4), qIdx + 5).map((_, i) => {
            const idx = Math.max(0, qIdx - 4) + i;
            return (
              <div key={idx} className={cn("rounded-full transition-all",
                idx === qIdx ? "w-6 h-2 bg-primary" : idx < qIdx ? "w-2 h-2 bg-primary/40" : "w-2 h-2 bg-slate-200"
              )} />
            );
          })}
        </div>

        {qIdx === questions.length - 1 ? (
          <button onClick={goNext}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-[12px] font-black shadow-md hover:brightness-110 transition-all">
            <Check size={13} /> Submit
          </button>
        ) : (
          <button onClick={goNext}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-[12px] font-black shadow-md hover:brightness-110 transition-all group">
            OK <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
