// Shared mock data for the CareQ Provider Portal

export interface Patient {
  id: string;
  name: string;
  dob: string;
  phn: string;
  phone: string;
  email: string;
  condition: string;
  surgeon: string;
  triageScore: number;
  waitTime: string;
  referralDate: string;
  status: "Active" | "Pre-surgery" | "Post-surgery" | "Discharged";
  preVisitFormStatus: "Complete" | "Partial" | "Not started";
  patientConfirmed: boolean;
  preChartStatus: "Complete" | "In progress" | "Not started";
  chartReviewStatus: "Approved" | "Pending" | "Not started";
  medications: string[];
  allergies: string[];
  medicalHistory: string[];
  lastAppointment?: string;
  nextAppointment?: string;
  notes?: string;
}

export interface ChartingActivity {
  id: string;
  patientId: string;
  patientName: string;
  type: "Pre-chart" | "Chart review" | "Appointment charting" | "E-advice" | "E-consult" | "Escalation";
  status: "Outstanding" | "In progress" | "Complete";
  assignedTo: string;
  dueDate: string;
  condition: string;
  appointmentDate?: string;
}

export interface WaitlistJourneySummary {
  monthsOnWaitlist: number;
  virtualVisitsCompleted: number;
  investigationsCompleted: string[];
  carePlanItems: string[];
  keyChanges: string[];
  triggeredBy: string;
  triggerRole: "waitlist-gp" | "virtual-gp";
  isEarlyEscalation?: boolean;
  escalationReason?: string;
}

export interface ReviewActivity {
  id: string;
  patientId: string;
  patientName: string;
  type: "E-consult" | "Escalation consult" | "Investigation" | "Care coordination";
  status: "Outstanding" | "In progress" | "Complete" | "Awaiting surgeon";
  priority: "Urgent" | "High" | "Medium" | "Low";
  assignedTo: string;
  createdDate: string;
  description: string;
  surgeonName?: string;
  waitlistSummary?: WaitlistJourneySummary;
}

// ─── eConsult Dashboard Types ─────────────────────────────

export type TreatmentResponse = 'improvement' | 'partial' | 'none' | 'worsening';

export interface MetricDataPoint {
  date: string;
  value: number;
  note?: string;
}

export interface SymptomDataPoint {
  date: string;
  score: number;
  note?: string;
}

export interface TreatmentAttempt {
  id: string;
  name: string;
  category: 'medication' | 'therapy' | 'procedure' | 'lifestyle' | 'investigation';
  startDate: string;
  endDate?: string;
  response: TreatmentResponse;
  responseNote: string;
  prescribedBy?: string;
}

export interface PatientImage {
  id: string;
  url: string;
  date: string;
  label: string;
  type: 'clinical-photo' | 'imaging' | 'diagram';
}

export interface EConsultPatient {
  patientId: string;
  consultReason: string;
  programStartDate: string;
  lastUpdated: string;
  programDurationMonths: number;
  bmiHistory: MetricDataPoint[];
  weightHistory: MetricDataPoint[];
  symptomScores: SymptomDataPoint[];
  treatments: TreatmentAttempt[];
  conditions: { name: string; diagnosedDate: string; status: 'active' | 'resolved' | 'managed'; system?: string }[];
  images: PatientImage[];
  assessmentNotes: string;
  planItems: string[];
  clinicianNotes?: string;
}

export interface BillingActivity {
  id: string;
  date: string;
  patientName: string;
  serviceType: string;
  billingCode: string;
  amount: number;
  status: "Submitted" | "Pending" | "Paid" | "Rejected" | "Requires info";
  familyPresent?: boolean;
  timeTaken?: number;
  complexity?: "Low" | "Medium" | "High";
}

export interface EarningsSummary {
  period: string;
  total: number;
  submitted: number;
  paid: number;
  pending: number;
}

// ─── Patients ──────────────────────────────────────────────

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "p1",
    name: "David Chen",
    dob: "1985-03-14",
    phn: "9876 543 210",
    phone: "(403) 555-0142",
    email: "david.chen@email.com",
    condition: "Right knee ACL tear",
    surgeon: "Dr. Patel",
    triageScore: 55,
    waitTime: "4 months",
    referralDate: "2025-11-15",
    status: "Active",
    preVisitFormStatus: "Complete",
    patientConfirmed: true,
    preChartStatus: "Complete",
    chartReviewStatus: "Approved",
    medications: ["Naproxen 500mg BID", "Acetaminophen PRN"],
    allergies: ["Penicillin"],
    medicalHistory: ["ACL injury (2025)", "Appendectomy (2018)"],
    lastAppointment: "2026-03-02",
    nextAppointment: "2026-03-09",
  },
  {
    id: "p2",
    name: "Helen Tremblay",
    dob: "1972-08-22",
    phn: "1234 567 890",
    phone: "(780) 555-0198",
    email: "helen.tremblay@email.com",
    condition: "Left hip osteoarthritis",
    surgeon: "Dr. Nguyen",
    triageScore: 78,
    waitTime: "6 months",
    referralDate: "2025-09-20",
    status: "Pre-surgery",
    preVisitFormStatus: "Complete",
    patientConfirmed: true,
    preChartStatus: "Complete",
    chartReviewStatus: "Pending",
    medications: ["Celebrex 200mg daily", "Vitamin D 1000 IU"],
    allergies: [],
    medicalHistory: ["Osteoarthritis (2024)", "Hypertension (2019)", "Type 2 Diabetes (2020)"],
    lastAppointment: "2026-03-05",
    nextAppointment: "2026-03-10",
  },
  {
    id: "p3",
    name: "Sandra Obi",
    dob: "1990-01-30",
    phn: "5678 901 234",
    phone: "(587) 555-0167",
    email: "sandra.obi@email.com",
    condition: "Lumbar disc herniation L4-L5",
    surgeon: "Dr. Morrison",
    triageScore: 92,
    waitTime: "7 months",
    referralDate: "2025-08-10",
    status: "Pre-surgery",
    preVisitFormStatus: "Partial",
    patientConfirmed: false,
    preChartStatus: "In progress",
    chartReviewStatus: "Not started",
    medications: ["Gabapentin 300mg TID", "Morphine 15mg PRN"],
    allergies: ["Sulfa drugs", "Latex"],
    medicalHistory: ["Disc herniation (2025)", "Previous L5-S1 discectomy (2022)"],
    lastAppointment: "2026-02-28",
    nextAppointment: "2026-03-09",
  },
  {
    id: "p4",
    name: "Thomas Blais",
    dob: "1968-11-05",
    phn: "3456 789 012",
    phone: "(403) 555-0231",
    email: "thomas.blais@email.com",
    condition: "Right rotator cuff tear",
    surgeon: "Dr. Patel",
    triageScore: 48,
    waitTime: "3 months",
    referralDate: "2025-12-01",
    status: "Active",
    preVisitFormStatus: "Complete",
    patientConfirmed: true,
    preChartStatus: "Not started",
    chartReviewStatus: "Not started",
    medications: ["Ibuprofen 400mg TID"],
    allergies: [],
    medicalHistory: ["Rotator cuff tear (2025)", "GERD (2017)"],
    nextAppointment: "2026-03-11",
  },
  {
    id: "p5",
    name: "Fatima Al-Rashid",
    dob: "1995-06-18",
    phn: "7890 123 456",
    phone: "(780) 555-0145",
    email: "fatima.alrashid@email.com",
    condition: "Bilateral carpal tunnel syndrome",
    surgeon: "Dr. Singh",
    triageScore: 32,
    waitTime: "2 months",
    referralDate: "2026-01-05",
    status: "Active",
    preVisitFormStatus: "Not started",
    patientConfirmed: false,
    preChartStatus: "Not started",
    chartReviewStatus: "Not started",
    medications: ["Wrist splints PRN"],
    allergies: ["Codeine"],
    medicalHistory: ["Carpal tunnel (2025)"],
    nextAppointment: "2026-03-14",
  },
  {
    id: "p6",
    name: "Robert Singh",
    dob: "1955-04-09",
    phn: "2345 678 901",
    phone: "(587) 555-0189",
    email: "robert.singh@email.com",
    condition: "Right total knee replacement (revision)",
    surgeon: "Dr. Nguyen",
    triageScore: 88,
    waitTime: "8 months",
    referralDate: "2025-07-15",
    status: "Pre-surgery",
    preVisitFormStatus: "Complete",
    patientConfirmed: true,
    preChartStatus: "Complete",
    chartReviewStatus: "Approved",
    medications: ["Metformin 500mg BID", "Lisinopril 10mg", "ASA 81mg"],
    allergies: ["NSAIDs"],
    medicalHistory: ["Right TKR (2020)", "Diabetes (2015)", "Hypertension (2012)", "CABG (2018)"],
    lastAppointment: "2026-03-07",
    nextAppointment: "2026-03-12",
  },
  {
    id: "p7",
    name: "Omar Hassan",
    dob: "1988-09-25",
    phn: "6789 012 345",
    phone: "(403) 555-0176",
    email: "omar.hassan@email.com",
    condition: "Left ankle fracture (post-op)",
    surgeon: "Dr. Morrison",
    triageScore: 28,
    waitTime: "",
    referralDate: "2025-12-20",
    status: "Post-surgery",
    preVisitFormStatus: "Complete",
    patientConfirmed: true,
    preChartStatus: "Complete",
    chartReviewStatus: "Approved",
    medications: ["Acetaminophen 500mg PRN", "Calcium supplement"],
    allergies: [],
    medicalHistory: ["Ankle ORIF (2026-01)", "No other PMHx"],
    lastAppointment: "2026-03-06",
    nextAppointment: "2026-03-20",
  },
  {
    id: "p8",
    name: "Brenda MacPherson",
    dob: "1960-02-14",
    phn: "8901 234 567",
    phone: "(780) 555-0213",
    email: "brenda.macpherson@email.com",
    condition: "Cervical stenosis C5-C6",
    surgeon: "Dr. Patel",
    triageScore: 72,
    waitTime: "5 months",
    referralDate: "2025-10-10",
    status: "Active",
    preVisitFormStatus: "Complete",
    patientConfirmed: true,
    preChartStatus: "In progress",
    chartReviewStatus: "Not started",
    medications: ["Pregabalin 75mg BID", "Omeprazole 20mg"],
    allergies: ["Morphine"],
    medicalHistory: ["Cervical stenosis (2025)", "GERD (2019)", "Osteoporosis (2022)"],
    lastAppointment: "2026-02-25",
    nextAppointment: "2026-03-11",
  },
  {
    id: "p9",
    name: "Carlos Mendez",
    dob: "1978-07-03",
    phn: "0123 456 789",
    phone: "(587) 555-0154",
    email: "carlos.mendez@email.com",
    condition: "Right shoulder labral tear",
    surgeon: "Dr. Singh",
    triageScore: 25,
    waitTime: "1 month",
    referralDate: "2026-02-01",
    status: "Active",
    preVisitFormStatus: "Not started",
    patientConfirmed: false,
    preChartStatus: "Not started",
    chartReviewStatus: "Not started",
    medications: [],
    allergies: [],
    medicalHistory: ["Labral tear (2026)"],
    nextAppointment: "2026-03-18",
  },
  {
    id: "p10",
    name: "Margaret Liu",
    dob: "1945-12-20",
    phn: "4567 890 123",
    phone: "(403) 555-0199",
    email: "margaret.liu@email.com",
    condition: "Left hip fracture (post-op)",
    surgeon: "Dr. Nguyen",
    triageScore: 80,
    waitTime: "",
    referralDate: "2025-11-01",
    status: "Post-surgery",
    preVisitFormStatus: "Complete",
    patientConfirmed: true,
    preChartStatus: "Complete",
    chartReviewStatus: "Approved",
    medications: ["Warfarin 5mg", "Calcium + Vit D", "Alendronate 70mg weekly"],
    allergies: ["Aspirin"],
    medicalHistory: ["Hip ORIF (2025-12)", "Atrial fibrillation (2020)", "Osteoporosis (2018)", "Falls risk"],
    lastAppointment: "2026-03-04",
    nextAppointment: "2026-03-15",
  },
];

// ─── Charting Activities ───────────────────────────────────

export const MOCK_CHARTING: ChartingActivity[] = [
  {
    id: "ch1",
    patientId: "p3",
    patientName: "Sandra Obi",
    type: "Pre-chart",
    status: "In progress",
    assignedTo: "Nurse Williams",
    dueDate: "2026-03-09",
    condition: "Lumbar disc herniation L4-L5",
    appointmentDate: "2026-03-09",
  },
  {
    id: "ch2",
    patientId: "p4",
    patientName: "Thomas Blais",
    type: "Pre-chart",
    status: "Outstanding",
    assignedTo: "MOA Johnson",
    dueDate: "2026-03-11",
    condition: "Right rotator cuff tear",
    appointmentDate: "2026-03-11",
  },
  {
    id: "ch3",
    patientId: "p8",
    patientName: "Brenda MacPherson",
    type: "Pre-chart",
    status: "In progress",
    assignedTo: "Nurse Williams",
    dueDate: "2026-03-11",
    condition: "Cervical stenosis C5-C6",
    appointmentDate: "2026-03-11",
  },
  {
    id: "ch4",
    patientId: "p5",
    patientName: "Fatima Al-Rashid",
    type: "Pre-chart",
    status: "Outstanding",
    assignedTo: "MOA Johnson",
    dueDate: "2026-03-14",
    condition: "Bilateral carpal tunnel syndrome",
    appointmentDate: "2026-03-14",
  },
  {
    id: "ch5",
    patientId: "p2",
    patientName: "Helen Tremblay",
    type: "Chart review",
    status: "Outstanding",
    assignedTo: "Dr. Reynolds",
    dueDate: "2026-03-10",
    condition: "Left hip osteoarthritis",
    appointmentDate: "2026-03-10",
  },
  {
    id: "ch6",
    patientId: "p3",
    patientName: "Sandra Obi",
    type: "Chart review",
    status: "Outstanding",
    assignedTo: "Dr. Reynolds",
    dueDate: "2026-03-09",
    condition: "Lumbar disc herniation L4-L5",
  },
  {
    id: "ch7",
    patientId: "p1",
    patientName: "David Chen",
    type: "Appointment charting",
    status: "Outstanding",
    assignedTo: "Dr. Reynolds",
    dueDate: "2026-03-09",
    condition: "Right knee ACL tear",
    appointmentDate: "2026-03-09",
  },
  {
    id: "ch8",
    patientId: "p6",
    patientName: "Robert Singh",
    type: "Appointment charting",
    status: "In progress",
    assignedTo: "Dr. Reynolds",
    dueDate: "2026-03-12",
    condition: "Right total knee replacement (revision)",
    appointmentDate: "2026-03-12",
  },
  {
    id: "ch9",
    patientId: "p7",
    patientName: "Omar Hassan",
    type: "E-advice",
    status: "Outstanding",
    assignedTo: "Dr. Reynolds",
    dueDate: "2026-03-10",
    condition: "Left ankle fracture (post-op)",
  },
  {
    id: "ch10",
    patientId: "p1",
    patientName: "David Chen",
    type: "Pre-chart",
    status: "Complete",
    assignedTo: "Nurse Williams",
    dueDate: "2026-03-02",
    condition: "Right knee ACL tear",
    appointmentDate: "2026-03-02",
  },
  {
    id: "ch11",
    patientId: "p1",
    patientName: "David Chen",
    type: "Chart review",
    status: "Complete",
    assignedTo: "Dr. Reynolds",
    dueDate: "2026-03-02",
    condition: "Right knee ACL tear",
  },
  {
    id: "ch12",
    patientId: "p6",
    patientName: "Robert Singh",
    type: "Pre-chart",
    status: "Complete",
    assignedTo: "Nurse Williams",
    dueDate: "2026-03-07",
    condition: "Right total knee replacement (revision)",
    appointmentDate: "2026-03-07",
  },
  {
    id: "ch13",
    patientId: "p10",
    patientName: "Margaret Liu",
    type: "Appointment charting",
    status: "Complete",
    assignedTo: "Dr. Reynolds",
    dueDate: "2026-03-04",
    condition: "Left hip fracture (post-op)",
    appointmentDate: "2026-03-04",
  },
  {
    id: "ch14",
    patientId: "p6",
    patientName: "Robert Singh",
    type: "E-consult",
    status: "Outstanding",
    assignedTo: "Dr. Reynolds",
    dueDate: "2026-03-10",
    condition: "Right total knee replacement (revision)",
  },
  {
    id: "ch15",
    patientId: "p2",
    patientName: "Helen Tremblay",
    type: "E-consult",
    status: "In progress",
    assignedTo: "Dr. Reynolds",
    dueDate: "2026-03-11",
    condition: "Left hip osteoarthritis",
  },
  {
    id: "ch16",
    patientId: "p3",
    patientName: "Sandra Obi",
    type: "Escalation",
    status: "Outstanding",
    assignedTo: "Dr. Reynolds",
    dueDate: "2026-03-09",
    condition: "Lumbar disc herniation L4-L5",
  },
  {
    id: "ch17",
    patientId: "p8",
    patientName: "Brenda MacPherson",
    type: "Escalation",
    status: "Outstanding",
    assignedTo: "Dr. Reynolds",
    dueDate: "2026-03-11",
    condition: "Cervical stenosis C5-C6",
  },
];

// ─── Review Activities ─────────────────────────────────────

export const MOCK_REVIEWS: ReviewActivity[] = [
  {
    id: "r1",
    patientId: "p6",
    patientName: "Robert Singh",
    type: "E-consult",
    status: "Awaiting surgeon",
    priority: "High",
    assignedTo: "Dr. Nguyen",
    createdDate: "2026-03-07",
    description: "Waitlist review complete — 8 months of conservative management, patient ready for surgical assessment",
    surgeonName: "Dr. Nguyen",
    waitlistSummary: {
      monthsOnWaitlist: 8,
      virtualVisitsCompleted: 6,
      investigationsCompleted: ["X-ray right knee (Sept 2025)", "MRI right knee (Dec 2025)", "Pre-op blood work (Feb 2026)"],
      carePlanItems: ["Weight management program", "Physiotherapy (12 sessions)", "Pain management — NSAIDs titrated"],
      keyChanges: ["ROM decreased from 120° to 95° over 8 months", "Pain score increased 4/10 → 7/10", "BMI reduced from 31.2 to 28.5 (target met)", "Failed conservative management — physiotherapy plateau at 6 months"],
      triggeredBy: "Dr. Reynolds",
      triggerRole: "waitlist-gp",
    },
  },
  {
    id: "r2",
    patientId: "p3",
    patientName: "Sandra Obi",
    type: "Escalation consult",
    status: "Outstanding",
    priority: "Urgent",
    assignedTo: "Dr. Morrison",
    createdDate: "2026-03-08",
    description: "Early escalation — new neurological deficit detected during routine virtual visit, not at natural waitlist endpoint",
    surgeonName: "Dr. Morrison",
    waitlistSummary: {
      monthsOnWaitlist: 3,
      virtualVisitsCompleted: 2,
      investigationsCompleted: ["MRI lumbar spine (Jan 2026)"],
      carePlanItems: ["Physiotherapy (4 sessions)", "Gabapentin titration", "Activity modification"],
      keyChanges: ["New left foot drop detected at virtual visit (Mar 8)", "Radiculopathy worsened L4-L5", "Failed gabapentin trial — no symptom relief", "Urgent MRI shows progressive disc herniation"],
      triggeredBy: "Dr. Reynolds",
      triggerRole: "virtual-gp",
      isEarlyEscalation: true,
      escalationReason: "New neurological deficit (foot drop) — patient only 3 months into waitlist, requires urgent surgical review before natural endpoint",
    },
  },
  {
    id: "r3",
    patientId: "p1",
    patientName: "David Chen",
    type: "Investigation",
    status: "Outstanding",
    priority: "High",
    assignedTo: "Nurse Williams",
    createdDate: "2026-03-08",
    description: "MRI right knee pending — pre-surgical imaging required",
  },
  {
    id: "r4",
    patientId: "p2",
    patientName: "Helen Tremblay",
    type: "Investigation",
    status: "Outstanding",
    priority: "Medium",
    assignedTo: "Nurse Williams",
    createdDate: "2026-03-06",
    description: "Pre-op blood work: CBC, BMP, coagulation panel, HbA1c",
  },
  {
    id: "r5",
    patientId: "p8",
    patientName: "Brenda MacPherson",
    type: "Investigation",
    status: "In progress",
    priority: "High",
    assignedTo: "Nurse Williams",
    createdDate: "2026-03-05",
    description: "Cervical spine MRI with contrast — pending approval",
  },
  {
    id: "r6",
    patientId: "p10",
    patientName: "Margaret Liu",
    type: "Care coordination",
    status: "Outstanding",
    priority: "Medium",
    assignedTo: "Nurse Williams",
    createdDate: "2026-03-07",
    description: "Coordinate with family re: post-op physiotherapy schedule and home care support",
  },
  {
    id: "r7",
    patientId: "p7",
    patientName: "Omar Hassan",
    type: "Care coordination",
    status: "In progress",
    priority: "Low",
    assignedTo: "Nurse Williams",
    createdDate: "2026-03-04",
    description: "Follow up on weight-bearing status and physiotherapy progress",
  },
  {
    id: "r8",
    patientId: "p2",
    patientName: "Helen Tremblay",
    type: "E-consult",
    status: "Complete",
    priority: "High",
    assignedTo: "Dr. Nguyen",
    createdDate: "2026-02-28",
    description: "Waitlist review complete — 11 months managed, surgeon accepted for THR",
    surgeonName: "Dr. Nguyen",
    waitlistSummary: {
      monthsOnWaitlist: 11,
      virtualVisitsCompleted: 8,
      investigationsCompleted: ["X-ray left hip (May 2025)", "CT pelvis (Oct 2025)", "Pre-op blood work (Feb 2026)", "Cardiac clearance (Feb 2026)"],
      carePlanItems: ["Aquatic therapy (16 sessions)", "Weight-bearing exercise program", "Pain management — acetaminophen + tramadol PRN"],
      keyChanges: ["Harris Hip Score declined 58 → 42", "Mobility aid required (walker) since Nov 2025", "Pre-op optimization complete — HbA1c 6.2%", "Accepted for left THR by Dr. Nguyen"],
      triggeredBy: "Dr. Reynolds",
      triggerRole: "waitlist-gp",
    },
  },
  {
    id: "r9",
    patientId: "p1",
    patientName: "David Chen",
    type: "E-consult",
    status: "Complete",
    priority: "Medium",
    assignedTo: "Dr. Patel",
    createdDate: "2026-02-20",
    description: "Waitlist review complete — 6 months managed, surgeon accepted for ACL reconstruction",
    surgeonName: "Dr. Patel",
    waitlistSummary: {
      monthsOnWaitlist: 6,
      virtualVisitsCompleted: 4,
      investigationsCompleted: ["MRI right knee (Sept 2025)", "X-ray right knee (Nov 2025)"],
      carePlanItems: ["Pre-hab physiotherapy (10 sessions)", "Knee bracing", "Activity modification"],
      keyChanges: ["Knee instability persists despite bracing", "Completed pre-hab — quad strength at 80% contralateral", "No meniscal involvement on repeat imaging", "Accepted for ACL reconstruction by Dr. Patel"],
      triggeredBy: "Dr. Reynolds",
      triggerRole: "waitlist-gp",
    },
  },
  {
    id: "r10",
    patientId: "p6",
    patientName: "Robert Singh",
    type: "Investigation",
    status: "Complete",
    priority: "High",
    assignedTo: "Nurse Williams",
    createdDate: "2026-03-01",
    description: "Pre-op imaging and blood work — all results received and reviewed",
  },
];

// ─── Billing Activities ────────────────────────────────────

export const MOCK_BILLING: BillingActivity[] = [
  {
    id: "b1",
    date: "2026-03-09",
    patientName: "David Chen",
    serviceType: "Virtual consultation",
    billingCode: "03.04A",
    amount: 77.28,
    status: "Pending",
    familyPresent: false,
    timeTaken: 20,
    complexity: "Medium",
  },
  {
    id: "b2",
    date: "2026-03-09",
    patientName: "Sandra Obi",
    serviceType: "Virtual consultation",
    billingCode: "03.04A",
    amount: 77.28,
    status: "Pending",
    familyPresent: true,
    timeTaken: 35,
    complexity: "High",
  },
  {
    id: "b3",
    date: "2026-03-07",
    patientName: "Robert Singh",
    serviceType: "Virtual consultation",
    billingCode: "03.04A",
    amount: 77.28,
    status: "Submitted",
    familyPresent: false,
    timeTaken: 25,
    complexity: "Medium",
  },
  {
    id: "b4",
    date: "2026-03-06",
    patientName: "Omar Hassan",
    serviceType: "Follow-up consultation",
    billingCode: "03.04B",
    amount: 38.64,
    status: "Submitted",
    familyPresent: false,
    timeTaken: 15,
    complexity: "Low",
  },
  {
    id: "b5",
    date: "2026-03-05",
    patientName: "Helen Tremblay",
    serviceType: "Virtual consultation",
    billingCode: "03.04A",
    amount: 77.28,
    status: "Paid",
    familyPresent: true,
    timeTaken: 30,
    complexity: "High",
  },
  {
    id: "b6",
    date: "2026-03-04",
    patientName: "Margaret Liu",
    serviceType: "Follow-up consultation",
    billingCode: "03.04B",
    amount: 38.64,
    status: "Paid",
    familyPresent: false,
    timeTaken: 15,
    complexity: "Low",
  },
  {
    id: "b7",
    date: "2026-03-03",
    patientName: "Brenda MacPherson",
    serviceType: "Virtual consultation",
    billingCode: "03.04A",
    amount: 77.28,
    status: "Paid",
    familyPresent: false,
    timeTaken: 20,
    complexity: "Medium",
  },
  {
    id: "b8",
    date: "2026-03-02",
    patientName: "David Chen",
    serviceType: "E-consult",
    billingCode: "03.04J",
    amount: 57.96,
    status: "Paid",
    timeTaken: 15,
    complexity: "Medium",
  },
  {
    id: "b9",
    date: "2026-02-28",
    patientName: "Helen Tremblay",
    serviceType: "E-consult",
    billingCode: "03.04J",
    amount: 57.96,
    status: "Paid",
    timeTaken: 20,
    complexity: "High",
  },
  {
    id: "b10",
    date: "2026-02-27",
    patientName: "Thomas Blais",
    serviceType: "Virtual consultation",
    billingCode: "03.04A",
    amount: 77.28,
    status: "Rejected",
    familyPresent: false,
    timeTaken: 20,
    complexity: "Medium",
  },
  {
    id: "b11",
    date: "2026-02-25",
    patientName: "Brenda MacPherson",
    serviceType: "Virtual consultation",
    billingCode: "03.04A",
    amount: 77.28,
    status: "Requires info",
    familyPresent: false,
    timeTaken: 25,
    complexity: "Medium",
  },
  {
    id: "b12",
    date: "2026-02-24",
    patientName: "Fatima Al-Rashid",
    serviceType: "Virtual consultation",
    billingCode: "03.04A",
    amount: 77.28,
    status: "Paid",
    familyPresent: false,
    timeTaken: 20,
    complexity: "Low",
  },
];

export const MOCK_EARNINGS: EarningsSummary[] = [
  { period: "Mar 3–9, 2026",  total: 541.96, submitted: 154.56, paid: 0,      pending: 154.56 },
  { period: "Feb 24–Mar 2",   total: 290.48, submitted: 77.28,  paid: 135.24, pending: 77.96  },
  { period: "Feb 17–23",      total: 425.04, submitted: 0,      paid: 425.04, pending: 0      },
  { period: "Feb 10–16",      total: 348.76, submitted: 0,      paid: 348.76, pending: 0      },
  { period: "Feb 3–9",        total: 502.32, submitted: 0,      paid: 502.32, pending: 0      },
  { period: "Jan 27–Feb 2",   total: 386.40, submitted: 0,      paid: 386.40, pending: 0      },
];

// ─── eConsult Dashboard Data ──────────────────────────────

export const MOCK_ECONSULT_PATIENTS: EConsultPatient[] = [
  {
    patientId: "p6",
    consultReason: "Right total knee replacement (revision) — Failed conservative management over 8 months. Patient reports worsening pain and functional decline despite multimodal approach.",
    programStartDate: "2025-07-15",
    lastUpdated: "2026-03-10",
    programDurationMonths: 8,
    bmiHistory: [
      { date: "2025-07", value: 31.2 },
      { date: "2025-09", value: 30.5 },
      { date: "2025-11", value: 29.8 },
      { date: "2026-01", value: 29.1 },
      { date: "2026-03", value: 28.5, note: "Weight mgmt program effective" },
    ],
    weightHistory: [
      { date: "2025-07", value: 98.2 },
      { date: "2025-09", value: 96.0 },
      { date: "2025-11", value: 93.8 },
      { date: "2026-01", value: 91.5 },
      { date: "2026-03", value: 89.7 },
    ],
    symptomScores: [
      { date: "2025-07", score: 4, note: "Baseline at referral" },
      { date: "2025-08", score: 4 },
      { date: "2025-09", score: 5, note: "Increased activity with physio" },
      { date: "2025-10", score: 5 },
      { date: "2025-11", score: 6, note: "Cortisone wore off, pain escalating" },
      { date: "2025-12", score: 6 },
      { date: "2026-01", score: 7, note: "Now using cane regularly" },
      { date: "2026-02", score: 7 },
      { date: "2026-03", score: 7, note: "Functional decline — difficulty with stairs" },
    ],
    treatments: [
      {
        id: "t1",
        name: "Physiotherapy (12 sessions)",
        category: "therapy",
        startDate: "2025-07-20",
        endDate: "2025-10-15",
        response: "partial",
        responseNote: "Initial improvement in ROM, plateaued after 8 sessions. Strength gains but no pain reduction.",
        prescribedBy: "Dr. Reynolds",
      },
      {
        id: "t2",
        name: "Celebrex 200mg daily",
        category: "medication",
        startDate: "2025-08-01",
        endDate: "2025-11-30",
        response: "partial",
        responseNote: "Mild pain relief first 6 weeks, then diminishing returns. Discontinued due to GI side effects.",
        prescribedBy: "Dr. Reynolds",
      },
      {
        id: "t3",
        name: "Weight Management Program",
        category: "lifestyle",
        startDate: "2025-08-15",
        response: "improvement",
        responseNote: "BMI reduced from 31.2 to 28.5. Patient engaged and motivated. Ongoing.",
        prescribedBy: "Nurse Johnson",
      },
      {
        id: "t4",
        name: "Cortisone Injection (R knee)",
        category: "procedure",
        startDate: "2025-09-20",
        endDate: "2025-11-15",
        response: "none",
        responseNote: "Temporary relief for ~3 weeks, then full return of symptoms. No sustained benefit.",
        prescribedBy: "Dr. Patel",
      },
      {
        id: "t5",
        name: "Knee Bracing (unloader)",
        category: "therapy",
        startDate: "2025-10-01",
        response: "partial",
        responseNote: "Improved stability and confidence walking. Pain still present but slightly better with brace. Ongoing.",
        prescribedBy: "Dr. Reynolds",
      },
      {
        id: "t6",
        name: "Aquatic Therapy (8 sessions)",
        category: "therapy",
        startDate: "2025-12-01",
        endDate: "2026-02-15",
        response: "improvement",
        responseNote: "Improved mobility and reduced stiffness. Patient reports best functional gains from this intervention.",
        prescribedBy: "Nurse Johnson",
      },
    ],
    conditions: [
      { name: "R knee osteoarthritis (revision candidate)", diagnosedDate: "2025-07", status: "active",   system: "Musculoskeletal" },
      { name: "Previous R TKR",                            diagnosedDate: "2020-03", status: "managed",  system: "Musculoskeletal" },
      { name: "Type 2 Diabetes",                           diagnosedDate: "2015-06", status: "managed",  system: "Endocrine" },
      { name: "Hypertension",                              diagnosedDate: "2012-01", status: "managed",  system: "Cardiovascular" },
      { name: "CABG (coronary artery bypass)",             diagnosedDate: "2018-11", status: "resolved", system: "Cardiovascular" },
    ],
    images: [
      { id: "img1", url: "", date: "2025-07-20", label: "R Knee AP X-ray (Baseline)", type: "imaging" },
      { id: "img2", url: "", date: "2025-11-05", label: "R Knee MRI", type: "imaging" },
      { id: "img3", url: "", date: "2026-02-10", label: "R Knee AP X-ray (Follow-up)", type: "imaging" },
    ],
    assessmentNotes: "71-year-old male with failed R TKR (2020) presenting with progressive pain and functional decline over 8 months despite multimodal conservative management. BMI has improved from 31.2 to 28.5 through weight management program (positive). However, pain scores have worsened from 4/10 to 7/10 with cortisone injection providing no sustained benefit. Aquatic therapy provided best functional gains but insufficient for pain control. Patient now requires a cane for ambulation and reports difficulty with stairs and ADLs. Given failed conservative management, progressive symptoms, and improved surgical candidacy (lower BMI, engaged patient), revision TKR should be strongly considered.",
    planItems: [
      "Recommend revision R TKR — conservative management exhausted",
      "Pre-surgical optimization: continue weight management, target BMI < 28",
      "Cardiology clearance required given CABG history (2018)",
      "Endocrine consult for perioperative diabetes management",
      "Continue aquatic therapy for pre-hab until surgery date",
      "Patient counseled on revision TKR expectations and recovery timeline",
    ],
    clinicianNotes: "Patient is well-informed and motivated. Strong family support. Revision TKR is appropriate given trajectory. Surgical risk is moderate due to cardiac and metabolic history — ensure clearances obtained.",
  },
  {
    patientId: "p2",
    consultReason: "Left hip osteoarthritis — Progressive deterioration, assessing surgical readiness.",
    programStartDate: "2025-09-20",
    lastUpdated: "2026-03-08",
    programDurationMonths: 6,
    bmiHistory: [
      { date: "2025-09", value: 27.1 },
      { date: "2025-11", value: 27.0 },
      { date: "2026-01", value: 26.8 },
      { date: "2026-03", value: 26.5 },
    ],
    weightHistory: [
      { date: "2025-09", value: 72.5 },
      { date: "2025-11", value: 72.1 },
      { date: "2026-01", value: 71.6 },
      { date: "2026-03", value: 70.8 },
    ],
    symptomScores: [
      { date: "2025-09", score: 6, note: "Baseline at referral" },
      { date: "2025-10", score: 6 },
      { date: "2025-11", score: 5, note: "Mild improvement with physio" },
      { date: "2025-12", score: 5 },
      { date: "2026-01", score: 5 },
      { date: "2026-02", score: 6, note: "Winter exacerbation" },
      { date: "2026-03", score: 6 },
    ],
    treatments: [
      {
        id: "t1",
        name: "Physiotherapy (16 sessions)",
        category: "therapy",
        startDate: "2025-10-01",
        response: "partial",
        responseNote: "Improved hip flexion range. Pain unchanged at rest but slightly better with movement.",
        prescribedBy: "Dr. Reynolds",
      },
      {
        id: "t2",
        name: "Celebrex 200mg daily",
        category: "medication",
        startDate: "2025-10-15",
        response: "partial",
        responseNote: "Moderate pain relief. Well tolerated. Ongoing.",
        prescribedBy: "Dr. Reynolds",
      },
      {
        id: "t3",
        name: "Hip cortisone injection",
        category: "procedure",
        startDate: "2025-12-10",
        response: "improvement",
        responseNote: "Good relief lasting ~8 weeks. Confirms intra-articular source of pain.",
        prescribedBy: "Dr. Nguyen",
      },
    ],
    conditions: [
      { name: "L hip osteoarthritis (severe)", diagnosedDate: "2024-03", status: "active",  system: "Musculoskeletal" },
      { name: "Hypertension",                  diagnosedDate: "2019-05", status: "managed", system: "Cardiovascular" },
      { name: "Type 2 Diabetes",               diagnosedDate: "2020-08", status: "managed", system: "Endocrine" },
    ],
    images: [
      { id: "img1", url: "", date: "2025-09-25", label: "L Hip AP X-ray", type: "imaging" },
      { id: "img2", url: "", date: "2026-01-15", label: "L Hip Lateral X-ray", type: "imaging" },
    ],
    assessmentNotes: "53-year-old female with progressive left hip OA over 6 months. Cortisone injection provided good temporary relief, confirming diagnosis. Conservative management has provided modest benefit. Patient is a reasonable surgical candidate with well-controlled comorbidities. May benefit from continued conservative management with reassessment in 3 months.",
    planItems: [
      "Continue current conservative management for 3 more months",
      "Repeat cortisone injection if symptoms worsen before reassessment",
      "Consider total hip arthroplasty if no sustained improvement by June 2026",
      "Continue Celebrex and physiotherapy maintenance",
    ],
  },
];
