import { User, Appointment, Task, WaitlistStatus, MedicalResult, Resource, Document, Faq } from "@shared/schema";

// Helper to manage localStorage
const STORAGE_KEY = 'careq_data_v4';

interface MyResult {
  id: number;
  category: "Labs" | "Imaging" | "E-Advice";
  title: string;
  date: Date;
  status: "Available" | "Pending" | "Reviewed";
  provider: string;
  summary?: string;
  details?: string;
}

interface AppData {
  user: User;
  appointments: Appointment[];
  tasks: Task[];
  waitlist: WaitlistStatus;
  results: MedicalResult[];
  resources: Resource[];
  documents: Document[];
  faqs: Faq[];
  myResults: MyResult[];
}

const initialData: AppData = {
  user: {
    id: 1,
    firstName: "Sarah",
    lastName: "Mitchell",
    email: "sarah.m@example.com",
    phone: "(555) 123-4567",
    dob: "1982-04-12",
    gender: "female",
    maritalStatus: "Married",
    address: "123 Maple Avenue",
    city: "Calgary",
    province: "AB",
    postalCode: "T2P 1J9",
    country: "CA",
    addressUse: "home",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    active: true,
    phnSystem: "https://fhir.infoway-inforoute.ca/NamingSystem/ca-ab-patient-healthcare-id",
    emergencyContactName: "James Mitchell",
    emergencyContactPhone: "(555) 987-6543",
    emergencyContactRelation: "Spouse",
    emergencyContactGender: "male",
    referringPhysicianName: "Dr. Robert Chen",
    referringPhysicianPhone: "403-555-0456",
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    resultAlerts: true,
  },
  waitlist: {
    // ... (existing waitlist data)
    id: 1,
    currentStage: 6,
    totalStages: 8,
    stageName: "6 Month Follow Up",
    estimatedWaitWeeks: 80,
    riskLevel: "Moderate",
    condition: "Left Hip Replacement",
    lastUpdated: new Date("2026-02-20"),
    nextExpectedAction: "Initial CareQ assessment completed.",
    carePlan: "Initial CareQ assessment completed. Patient with moderate left hip OA, appropriate surgical candidate. Risk category: Moderate. Estimated wait: 32 weeks. Plan: Continue conservative management, pre-habilitation physio, follow-up in 12 weeks.",
    carePlanActions: [
      "Continue current pain management",
      "Weight-bearing exercises as tolerated"
    ]
  },
  appointments: [
    // ... (existing appointments data)
    {
      id: 2,
      title: "Initial Appointment",
      doctorName: "Dr. Munib Ali",
      date: new Date("2025-09-10T14:30:00"),
      type: "Video Call",
      location: "Online",
      status: "Completed",
      notes: "Initial hip assessment.",
      zoomJoinUrl: "https://zoom.us/j/123456789",
    },
    {
      id: 3,
      title: "3 Month Appointment",
      doctorName: "Dr. Munib Ali",
      date: new Date("2025-12-10T14:00:00"),
      type: "Video Call",
      location: "Online (Zoom)",
      status: "Completed",
      notes: "Review progress and imaging.",
      zoomJoinUrl: "https://zoom.us/j/987654321",
    },
    {
      id: 4,
      title: "6 Month Appointment",
      doctorName: "Dr. Munib Ali",
      date: new Date("2026-06-12T09:00:00"),
      type: "Video Call",
      location: "Online (Zoom)",
      status: "Scheduled",
      notes: "Mid-point assessment.",
      zoomJoinUrl: "https://zoom.us/j/123456789",
    },
    {
      id: 41,
      title: "6 Month Appointment",
      doctorName: "Dr. Munib Ali",
      date: new Date("2026-06-13T10:00:00"),
      type: "Phone",
      location: "Phone Call",
      status: "Scheduled",
      notes: "Follow-up discussion.",
    },
    {
      id: 42,
      title: "6 Month Appointment",
      doctorName: "Dr. Munib Ali",
      date: new Date("2026-06-14T11:00:00"),
      type: "In-Person",
      location: "Alberta Hip and Knee Clinic",
      status: "Pending",
      notes: "In-person evaluation.",
    },
    {
      id: 5,
      title: "Surgical Prep Class",
      doctorName: "Nurse Practitioner Joy",
      date: new Date("2026-06-15T11:00:00"),
      type: "In-Person",
      location: "Education Center, Room B",
      status: "Scheduled",
      notes: "Group session covering what to expect on surgery day.",
    }
  ],
  tasks: [
    {
      id: 1,
      title: "Patient History Form",
      description: "Used to collect health background. Only needs to be completed once upon registration.",
      dueDate: new Date("2026-03-01"),
      status: "Pending",
      priority: "urgent",
      category: "Complete Forms",
      actionLabel: "Start Form",
      actionUrl: "/forms/health-history",
    },
    {
      id: 2,
      title: "Consent Form",
      description: "Needs to be completed once upon registration.",
      dueDate: new Date("2026-03-01"),
      status: "Pending",
      priority: "urgent",
      category: "Complete Forms",
      actionLabel: "Start Form",
      actionUrl: "/forms/consent",
    },
    {
      id: 3,
      title: "Pre-Visit Form",
      description: "This form helps determine the risk assessment score that will be used to calculate wait time. It is given before every visit with a CareQ GP.",
      dueDate: new Date("2026-04-25"),
      status: "Pending",
      priority: "normal",
      category: "Complete Forms",
      actionLabel: "Start Form",
      actionUrl: "/forms/pre-visit",
    },
    {
      id: 4,
      title: "Book Appointment",
      description: "Schedule your next appointment with your care team.",
      dueDate: new Date("2026-02-15"),
      status: "Pending",
      priority: "normal",
      category: "Appointment",
      actionLabel: "Book Appointment",
      actionUrl: "/book-appointment",
    },
    {
      id: 5,
      title: "Confirm Appointment",
      description: "Please confirm your upcoming appointment to secure your time slot.",
      dueDate: new Date("2026-04-20"),
      status: "Pending",
      priority: "normal",
      category: "Appointment",
    },
    {
      id: 12,
      title: "Complete Lab Work",
      description: "Visit your local lab to complete the required blood work before your next appointment.",
      dueDate: new Date("2026-04-10"),
      status: "Pending",
      priority: "normal",
      category: "Labs",
      actionLabel: "View Results",
      actionUrl: "/results",
    },
    {
      id: 13,
      title: "Complete Imaging",
      description: "Schedule and complete the required imaging (X-ray) as ordered by your care team.",
      dueDate: new Date("2026-04-15"),
      status: "Pending",
      priority: "normal",
      category: "Imaging",
      actionLabel: "View Results",
      actionUrl: "/results",
    },
    {
      id: 16,
      title: "Review Latest E-Advice",
      description: "Read your most recent clinical guidance from the care team.",
      dueDate: new Date("2026-04-22"),
      status: "Pending",
      priority: "normal",
      category: "Labs",
      actionLabel: "View E-Advice",
      actionUrl: "/resources",
    },
    {
      id: 17,
      title: "Upload External Imaging Report",
      description: "Upload any outside imaging reports before your next consult.",
      dueDate: new Date("2026-04-24"),
      status: "Pending",
      priority: "normal",
      category: "Imaging",
      actionLabel: "Access Requisition",
      actionUrl: "/results",
    },
    {
      id: 6,
      title: "Patient History Form",
      description: "Used to collect health background. Only needs to be completed once upon registration.",
      dueDate: new Date("2026-03-01"),
      status: "Completed",
      priority: "urgent",
      category: "Complete Forms",
      actionLabel: "Start Form",
      actionUrl: "/forms/health-history",
    },
    {
      id: 7,
      title: "Consent Form",
      description: "Needs to be completed once upon registration.",
      dueDate: new Date("2026-03-01"),
      status: "Completed",
      priority: "urgent",
      category: "Complete Forms",
      actionLabel: "Start Form",
      actionUrl: "/forms/consent",
    },
    {
      id: 8,
      title: "Pre-Visit Form",
      description: "This form helps determine the risk assessment score that will be used to calculate wait time. It is given before every visit with a CareQ GP.",
      dueDate: new Date("2026-04-25"),
      status: "Completed",
      priority: "normal",
      category: "Complete Forms",
      actionLabel: "Start Form",
      actionUrl: "/forms/pre-visit",
    },
    {
      id: 9,
      title: "Book Appointment",
      description: "Schedule your next appointment with your care team.",
      dueDate: new Date("2026-02-15"),
      status: "Completed",
      priority: "normal",
      category: "Appointment",
    },
    {
      id: 10,
      title: "Confirm Appointment",
      description: "Please confirm your upcoming appointment to secure your time slot.",
      dueDate: new Date("2026-04-20"),
      status: "Completed",
      priority: "normal",
      category: "Appointment",
    },
    {
      id: 14,
      title: "Complete Lab Work",
      description: "Visit your local lab to complete the required blood work before your next appointment.",
      dueDate: new Date("2026-04-10"),
      status: "Completed",
      priority: "normal",
      category: "Labs",
      actionLabel: "View Results",
      actionUrl: "/results",
    },
    {
      id: 15,
      title: "Complete Imaging",
      description: "Schedule and complete the required imaging (X-ray) as ordered by your care team.",
      dueDate: new Date("2026-04-15"),
      status: "Completed",
      priority: "normal",
      category: "Imaging",
      actionLabel: "View Results",
      actionUrl: "/results",
    },
  ],
  results: [],
  myResults: [
    {
      id: 1,
      category: "Labs",
      title: "Complete Blood Count (CBC)",
      date: new Date("2025-12-10"),
      status: "Available",
      provider: "",
      summary: "All values within normal range",
      details: "WBC: 6.8, RBC: 4.7, Hemoglobin: 14.2 g/dL, Hematocrit: 42%, Platelets: 245,000",
    },
    {
      id: 2,
      category: "Labs",
      title: "Creatinine / eGFR",
      date: new Date("2025-12-10"),
      status: "Available",
      provider: "",
      summary: "Kidney function normal",
      details: "Creatinine: 0.9 mg/dL, eGFR: >90 mL/min/1.73m²",
    },
    {
      id: 3,
      category: "Labs",
      title: "Hemoglobin A1c (HbA1c)",
      date: new Date("2025-12-10"),
      status: "Available",
      provider: "",
      summary: "Within target range",
      details: "HbA1c: 5.6% (normal <5.7%)",
    },
    {
      id: 11,
      category: "Labs",
      title: "Electrolytes",
      date: new Date("2025-12-10"),
      status: "Available",
      provider: "",
      summary: "All values within normal range",
      details: "Sodium: 140 mEq/L, Potassium: 4.2 mEq/L, Chloride: 101 mEq/L, Bicarbonate: 24 mEq/L, Calcium: 9.5 mg/dL",
    },
    {
      id: 4,
      category: "Imaging",
      title: "AP Pelvis X-Ray",
      date: new Date("2025-11-20"),
      status: "Reviewed",
      provider: "",
      summary: "Joint space narrowing on the left hip",
      details: "AP pelvis view centered at pubis demonstrates moderate narrowing of the left hip superior joint space with subchondral sclerosis. Right hip appears normal. No acute fracture identified.",
    },
    {
      id: 5,
      category: "Imaging",
      title: "AP Proximal Femur X-Ray (Left)",
      date: new Date("2025-11-20"),
      status: "Available",
      provider: "",
      summary: "Osteoarthritic changes noted",
      details: "AP view of the left proximal femur shows moderate osteophyte formation at the femoral head-neck junction with mild subchondral cyst formation. Templating sphere included for pre-op planning.",
    },
    {
      id: 6,
      category: "Imaging",
      title: "Lateral Proximal Femur X-Ray (Left)",
      date: new Date("2025-11-20"),
      status: "Available",
      provider: "",
      summary: "Consistent with degenerative changes",
      details: "Lateral view of the left proximal femur confirms moderate degenerative joint disease with marginal osteophytes. Femoral head contour maintained. No fracture or dislocation.",
    },
    {
      id: 7,
      category: "E-Advice",
      title: "3 Month Follow Up",
      date: new Date("2025-10-15"),
      status: "Reviewed",
      provider: "Sarah Jenkins, RN",
      summary: "Activity modifications and pain management guidance",
      details: "Continue current activity level with modifications. Avoid high-impact activities. Use ice for 20 min after activity. Acetaminophen 500mg as needed for pain, max 3g/day. Follow up if symptoms worsen.",
    },
    {
      id: 8,
      category: "E-Advice",
      title: "6 Month Follow Up",
      date: new Date("2025-12-01"),
      status: "Available",
      provider: "Dr. Emily Chen",
      summary: "Dietary recommendations before surgery",
      details: "Target BMI below 35 prior to surgery. Increase protein intake to 1.2g/kg/day. Consider meeting with nutritionist. Maintain moderate walking 30 min/day. Follow-up weight check in 8 weeks.",
    },
    {
      id: 9,
      category: "E-Advice",
      title: "9 Month Follow Up",
      date: new Date("2026-01-10"),
      status: "Available",
      provider: "Dr. Emily Chen",
      summary: "Stop blood thinners 7 days before surgery",
      details: "Discontinue aspirin and any NSAIDs 7 days prior to scheduled surgery date. Continue all other medications as prescribed. Contact office with any questions about specific medications.",
    },
  ],
  resources: [
     // ... (existing resources data)
    {
      id: 1,
      title: "Preparing for Hip Surgery",
      description: "A comprehensive video guide on what to expect.",
      category: "Education",
      type: "Video",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      title: "Post-Op Exercises",
      description: "Gentle movements to aid recovery.",
      category: "Exercise",
      type: "PDF",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      title: "Pain Management Guide",
      description: "Understanding your medication options and pain levels.",
      category: "Education",
      type: "Article",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 4,
      title: "Clinic Contact Information",
      description: "Phone numbers and emails for different departments.",
      category: "Contact",
      type: "Article",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 5,
      title: "Frequently Asked Questions",
      description: "Common questions about surgery and recovery.",
      category: "FAQ",
      type: "Article",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 6,
      title: "Daily Walking Plan",
      description: "Week-by-week walking goals for recovery.",
      category: "Exercise",
      type: "PDF",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 7,
      title: "Billing & Insurance",
      description: "Who to contact for billing inquiries.",
      category: "Contact",
      type: "Article",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 8,
      title: "Nutrition for Healing",
      description: "Dietary recommendations to speed up your recovery.",
      category: "Education",
      type: "Article",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 9,
      title: "Managing Sleep Comfort",
      description: "Tips for sleeping comfortably after hip surgery.",
      category: "Education",
      type: "Video",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 10,
      title: "Seated Chair Exercises",
      description: "Safe exercises you can do while sitting.",
      category: "Exercise",
      type: "Video",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 11,
      title: "Wound Care Basics",
      description: "How to properly care for your surgical incision.",
      category: "Education",
      type: "PDF",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 12,
      title: "Patient Advocacy Services",
      description: "Support services available to you during your stay.",
      category: "Contact",
      type: "Article",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 13,
      title: "Meditation for Pain Relief",
      description: "Guided meditation sessions to help manage pain levels.",
      category: "Education",
      type: "Video",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 14,
      title: "Home Safety Checklist",
      description: "Ensure your home is safe for your return after surgery.",
      category: "Education",
      type: "PDF",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 15,
      title: "Upper Body Strengthening",
      description: "Exercises to keep your upper body strong during recovery.",
      category: "Exercise",
      type: "Video",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 16,
      title: "Transportation Services",
      description: "Options for getting to and from your appointments.",
      category: "Contact",
      type: "Article",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 17,
      title: "Dietary Guidelines",
      description: "Foods to avoid and foods to include in your diet.",
      category: "Education",
      type: "PDF",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 18,
      title: "Gentle Stretching Routine",
      description: "Follow-along stretching video safe for post-op patients.",
      category: "Exercise",
      type: "Video",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 19,
      title: "Understanding Your X-Ray Results",
      description: "A doctor explains how to read common hip X-ray findings.",
      category: "Education",
      type: "Video",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 20,
      title: "What to Expect on Surgery Day",
      description: "A walkthrough of your surgery day from arrival to recovery room.",
      category: "Education",
      type: "Video",
      linkUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&auto=format&fit=crop&q=60",
    }
  ],
  faqs: [
    {
      id: 1,
      question: "How long will I be in the hospital?",
      answer: "Most patients stay in the hospital for 1-2 days after hip replacement surgery. Your care team will monitor your progress and determine the best discharge plan for you."
    },
    {
      id: 2,
      question: "When can I drive again?",
      answer: "You can usually resume driving 4-6 weeks after surgery, once you are no longer taking narcotic pain medication and have regained sufficient strength and reflexes."
    },
    {
      id: 3,
      question: "How do I manage pain at home?",
      answer: "Follow your prescribed medication schedule, apply ice packs as directed, and elevate your leg. Gentle movement and distraction techniques can also help manage discomfort."
    },
    {
      id: 4,
      question: "When can I shower?",
      answer: "You may be able to shower 2-3 days after surgery if your incision is covered with a waterproof dressing. Always follow the specific instructions provided by your surgeon."
    },
    {
      id: 5,
      question: "What equipment will I need at home?",
      answer: "Commonly recommended items include a walker or crutches, a raised toilet seat, a shower chair, and a reacher tool to help you pick up items without bending."
    },
     {
      id: 6,
      question: "How often should I do my exercises?",
      answer: "Physical therapy exercises should typically be performed 2-3 times a day. Consistency is key to regaining strength and mobility."
    }
  ],
  documents: [
    {
      id: 1,
      title: "Initial Consultation Summary",
      date: new Date("2023-11-15"),
      category: "Visit Summary",
      status: "Released",
      previewText: "Patient presented with chief complaint of left hip pain. Physical examination revealed limited range of motion...",
      author: "Dr. Alan Grant",
      downloadUrl: "#",
      reasonForUnavailability: null,
    },
    {
      id: 2,
      title: "Hip MRI Report",
      date: new Date("2024-02-28"),
      category: "Result",
      status: "Released",
      previewText: "FINDINGS: Severe osteoarthritis of the left hip joint with subchondral cystic changes and marginal osteophytes...",
      author: "Radiology Dept",
      downloadUrl: "#",
      reasonForUnavailability: null,
    },
    {
      id: 3,
      title: "Blood Work Panel (CBC/Metabolic)",
      date: new Date("2024-03-10"),
      category: "Result",
      status: "Released",
      previewText: "WBC: 6.5 (Normal), RBC: 4.8 (Normal), Hemoglobin: 14.2 g/dL (Normal). Comprehensive Metabolic Panel within normal limits.",
      author: "Central Lab",
      downloadUrl: "#",
      reasonForUnavailability: null,
    },
    {
      id: 4,
      title: "Surgical Consent Form",
      date: new Date("2024-04-01"),
      category: "Consent",
      status: "Pending release",
      previewText: null,
      author: "Admin",
      downloadUrl: null,
      reasonForUnavailability: "Pending physician signature",
    },
    {
      id: 5,
      title: "Referral Letter - Physical Therapy",
      date: new Date("2024-03-15"),
      category: "Other",
      status: "Released",
      previewText: "Referral for pre-operative physical therapy evaluation and treatment. Focus on strengthening hip abductors...",
      author: "Dr. Emily Chen",
      downloadUrl: "#",
      reasonForUnavailability: null,
    },
     {
      id: 6,
      title: "Pathology Report",
      date: new Date("2026-06-20"),
      category: "Result",
      status: "Not available",
      previewText: null,
      author: "Pathology",
      downloadUrl: null,
      reasonForUnavailability: "Result pending analysis (7-10 days)",
    },
  ]
};

// Initialize localStorage if empty
const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  
  const raw = JSON.parse(stored);
  let dirty = false;
  if (raw.waitlist) {
    if (raw.waitlist.estimatedWaitWeeks !== initialData.waitlist.estimatedWaitWeeks) {
      raw.waitlist.estimatedWaitWeeks = initialData.waitlist.estimatedWaitWeeks;
      dirty = true;
    }
    if (raw.waitlist.currentStage !== initialData.waitlist.currentStage) {
      raw.waitlist.currentStage = initialData.waitlist.currentStage;
      dirty = true;
    }
    if (raw.waitlist.totalStages !== initialData.waitlist.totalStages) {
      raw.waitlist.totalStages = initialData.waitlist.totalStages;
      dirty = true;
    }
    if (raw.waitlist.stageName !== initialData.waitlist.stageName) {
      raw.waitlist.stageName = initialData.waitlist.stageName;
      dirty = true;
    }
    if (raw.waitlist.lastUpdated !== initialData.waitlist.lastUpdated.toISOString()) {
      raw.waitlist.lastUpdated = initialData.waitlist.lastUpdated.toISOString();
      dirty = true;
    }
  }
  if (raw.tasks && Array.isArray(raw.tasks)) {
    const initialIds = new Set(initialData.tasks.map((t: any) => t.id));
    raw.tasks = raw.tasks.filter((t: any) => initialIds.has(t.id));
    const taskMap: Record<number, any> = {};
    initialData.tasks.forEach((t: any) => { taskMap[t.id] = t; });
    raw.tasks.forEach((t: any) => {
      const src = taskMap[t.id];
      if (!src) return;
      ['title', 'description', 'category', 'actionLabel', 'actionUrl', 'status', 'priority'].forEach(field => {
        if (src[field] !== undefined && t[field] !== src[field]) {
          t[field] = src[field];
          dirty = true;
        }
      });
    });
    dirty = true;
  }
  if (raw.myResults && Array.isArray(raw.myResults)) {
    const titleMap: Record<number, string> = {};
    initialData.myResults.forEach((r: any) => { titleMap[r.id] = r.title; });
    raw.myResults.forEach((r: any) => {
      if (titleMap[r.id] && r.title !== titleMap[r.id]) {
        r.title = titleMap[r.id];
        dirty = true;
      }
    });
  }
  if (raw.appointments && Array.isArray(raw.appointments)) {
    const apptMap: Record<number, any> = {};
    initialData.appointments.forEach((a: any) => { apptMap[a.id] = a; });
    const validIds = new Set(initialData.appointments.map((a: any) => a.id));
    const beforeLen = raw.appointments.length;
    raw.appointments = raw.appointments.filter((a: any) => validIds.has(a.id));
    if (raw.appointments.length !== beforeLen) dirty = true;
    raw.appointments.forEach((a: any) => {
      const src = apptMap[a.id];
      if (!src) return;
      const fields = ['title', 'zoomJoinUrl', 'type', 'status', 'location', 'doctorName'] as const;
      fields.forEach(field => {
        if (src[field] && a[field] !== src[field]) {
          a[field] = src[field];
          dirty = true;
        }
      });
    });
  }
  if (dirty) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
  }
  
  // Need to revive Dates from JSON strings
  const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
  // Helper to revive dates
  const reviveDates = (obj: any): any => {
    if (!obj) return obj;
    if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}/.test(obj)) {
      return new Date(obj);
    }
    if (Array.isArray(obj)) return obj.map(reviveDates);
    if (typeof obj === 'object') {
      const newObj: any = {};
      for (const k in obj) newObj[k] = reviveDates(obj[k]);
      return newObj;
    }
    return obj;
  };
  
  const revived = reviveDates(parsed);
  
  const mergeById = (initial: any[], saved: any[]) => {
    if (!saved || !Array.isArray(saved)) return initial;
    const savedIds = new Set(saved.map((item: any) => item.id));
    const newItems = initial.filter((item: any) => !savedIds.has(item.id));
    return [...saved, ...newItems];
  };

  return {
    ...initialData,
    ...revived,
    resources: mergeById(initialData.resources, revived.resources),
    faqs: mergeById(initialData.faqs, revived.faqs),
    documents: mergeById(initialData.documents, revived.documents),
    results: mergeById(initialData.results, revived.results),
    myResults: initialData.myResults,
    tasks: mergeById(initialData.tasks, revived.tasks),
    appointments: mergeById(initialData.appointments, revived.appointments),
  };
};

export const db = {
  get: () => loadData(),
  save: (data: Partial<AppData>) => {
    const current = loadData();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};
