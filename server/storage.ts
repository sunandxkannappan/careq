import { 
  users, appointments, tasks, waitlistStatus, medicalResults, resources,
  type User, type InsertUser,
  type Appointment, type Task, type WaitlistStatus, type MedicalResult, type Resource
} from "@shared/schema";

export interface IStorage {
  getUser(): Promise<User>;
  updateUser(user: Partial<InsertUser>): Promise<User>;
  
  getAppointments(): Promise<Appointment[]>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment>;
  
  getTasks(): Promise<Task[]>;
  updateTaskStatus(id: number, status: string): Promise<Task>;
  
  getWaitlistStatus(): Promise<WaitlistStatus>;
  
  getMedicalResults(): Promise<MedicalResult[]>;
  
  getResources(): Promise<Resource[]>;
}

export class MemStorage implements IStorage {
  private user: User;
  private appointments: Appointment[];
  private tasks: Task[];
  private waitlist: WaitlistStatus;
  private results: MedicalResult[];
  private resources: Resource[];

  constructor() {
    // Initial Mock Data
    this.user = {
      id: 1,
      firstName: "Sarah",
      lastName: "Mitchell",
      email: "sarah.mitchell@email.com",
      phone: "403-555-0123",
      dob: "March 21, 1968",
      address: "123 Maple Avenue",
      city: "Calgary",
      province: "AB",
      postalCode: "T2P 1J9",
      avatar: "SM",
      emergencyContactName: "James Mitchell",
      emergencyContactPhone: "(555) 987-6543",
      emergencyContactRelation: "Spouse",
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      resultAlerts: true,
    };

    this.appointments = [
      {
        id: 1,
        title: "Follow-up Visit",
        doctorName: "Dr. Sarah Chen",
        date: new Date("2026-02-15T10:00:00"),
        type: "Video Call",
        location: "Zoom",
        status: "Scheduled",
        notes: "Regular check-in",
        zoomJoinUrl: null,
      },
      {
        id: 2,
        title: "Initial Assessment",
        doctorName: "Dr. James Wilson",
        date: new Date("2026-01-09T14:00:00"),
        type: "In-Person",
        location: "CareQ Clinic - Room 204",
        status: "Completed",
        notes: "Initial consultation for left hip pain",
        zoomJoinUrl: null,
      }
    ];

    this.tasks = [
      {
        id: 1,
        title: "Complete Pre-Visit Questionnaire",
        description: "Please complete your pre-visit questionnaire before your upcoming appointment on Feb 15.",
        dueDate: new Date("2026-02-14"),
        status: "Pending",
        priority: "urgent",
        actionLabel: "Start Questionnaire",
        actionUrl: "/questionnaire"
      },
      {
        id: 2,
        title: "Update Contact Information",
        description: "Please verify your email and phone number are current.",
        dueDate: null,
        status: "Completed",
        priority: "normal",
        actionLabel: "Go to Profile",
        actionUrl: "/profile"
      }
    ];

    this.waitlist = {
      id: 1,
      currentStage: 5,
      totalStages: 7,
      stageName: "Active Management",
      estimatedWaitWeeks: 32,
      riskLevel: "Moderate",
      condition: "Left Hip Replacement",
      lastUpdated: new Date(),
      nextExpectedAction: "Initial CareQ assessment completed.",
      carePlan: "Initial CareQ assessment completed. Patient with moderate left hip OA, appropriate surgical candidate. Risk category: Moderate. Estimated wait: 32 weeks. Plan: Continue conservative management, pre-habilitation physio, follow-up in 12 weeks.",
      carePlanActions: [
        "Continue current pain management",
        "Weight-bearing exercises as tolerated"
      ]
    };

    this.results = [
      {
        id: 1,
        title: "Initial Assessment Summary",
        date: new Date("2026-01-10"),
        summary: "Patient with moderate left hip OA, appropriate surgical candidate. Risk category: Moderate. Estimated wait: 32 weeks. Plan: Continue conservative management, pre-habilitation physio, follow-up in 12 weeks.",
        category: "Visit Summary",
        downloadUrl: "#"
      },
      {
        id: 2,
        title: "X-Ray Results - Left Hip",
        date: new Date("2025-12-15"),
        summary: "Moderate joint space narrowing observed. Osteophytes present.",
        category: "Imaging",
        downloadUrl: "#"
      }
    ];

    this.resources = [
      {
        id: 1,
        title: "Understanding Hip Replacement Surgery",
        description: "Learn what to expect before, during, and after hip replacement surgery.",
        category: "Education",
        type: "Article",
        linkUrl: "#",
        thumbnailUrl: null,
      },
      {
        id: 2,
        title: "Pre-Surgery Exercise Program",
        description: "Recommended exercises to strengthen muscles and improve recovery outcomes.",
        category: "Exercise",
        type: "PDF",
        linkUrl: "#",
        thumbnailUrl: null,
      },
      {
        id: 3,
        title: "Pain Management Guide",
        description: "Information about managing pain while waiting for surgery.",
        category: "Medication",
        type: "PDF",
        linkUrl: "#",
        thumbnailUrl: null,
      }
    ];
  }

  async getUser(): Promise<User> {
    return this.user;
  }

  async updateUser(updates: Partial<InsertUser>): Promise<User> {
    this.user = { ...this.user, ...updates };
    return this.user;
  }

  async getAppointments(): Promise<Appointment[]> {
    return this.appointments;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
    const appt = this.appointments.find(a => a.id === id);
    if (!appt) throw new Error("Appointment not found");
    appt.status = status;
    return appt;
  }

  async getTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async updateTaskStatus(id: number, status: string): Promise<Task> {
    const task = this.tasks.find(t => t.id === id);
    if (!task) throw new Error("Task not found");
    task.status = status;
    return task;
  }

  async getWaitlistStatus(): Promise<WaitlistStatus> {
    return this.waitlist;
  }

  async getMedicalResults(): Promise<MedicalResult[]> {
    return this.results;
  }

  async getResources(): Promise<Resource[]> {
    return this.resources;
  }
}

export const storage = new MemStorage();
