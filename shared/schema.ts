import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  dob: text("dob"),
  gender: text("gender"),
  maritalStatus: text("marital_status"),
  address: text("address"),
  city: text("city"),
  province: text("province"),
  postalCode: text("postal_code"),
  country: text("country").default("CA"),
  addressUse: text("address_use").default("home"),
  avatar: text("avatar"),
  active: boolean("active").default(true),
  phnSystem: text("phn_system").default("https://fhir.infoway-inforoute.ca/NamingSystem/ca-ab-patient-healthcare-id"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactRelation: text("emergency_contact_relation"),
  emergencyContactGender: text("emergency_contact_gender"),
  referringPhysicianName: text("referring_physician_name"),
  referringPhysicianPhone: text("referring_physician_phone"),
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  appointmentReminders: boolean("appointment_reminders").default(true),
  resultAlerts: boolean("result_alerts").default(true),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  doctorName: text("doctor_name").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(), // 'Video Call', 'Phone', 'In-Person'
  location: text("location").notNull(),
  status: text("status").notNull(), // 'Scheduled', 'Completed', 'Cancelled'
  notes: text("notes"),
  zoomJoinUrl: text("zoom_join_url"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date"),
  status: text("status").notNull(), // 'Pending', 'Completed'
  priority: text("priority").default("normal"), // 'normal', 'urgent'
  actionLabel: text("action_label"),
  actionUrl: text("action_url"),
});

export const waitlistStatus = pgTable("waitlist_status", {
  id: serial("id").primaryKey(),
  currentStage: integer("current_stage").notNull(), // 1-7
  totalStages: integer("total_stages").default(7),
  stageName: text("stage_name").notNull(),
  estimatedWaitWeeks: integer("estimated_wait_weeks"),
  riskLevel: text("risk_level"), // 'Low', 'Moderate', 'High'
  condition: text("condition"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  nextExpectedAction: text("next_expected_action"),
  carePlan: text("care_plan"),
  carePlanActions: jsonb("care_plan_actions").$type<string[]>(),
});

export const medicalResults = pgTable("medical_results", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(), // 'Visit Summary', 'Lab Result', 'Imaging'
  downloadUrl: text("download_url"),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'Education', 'Exercise', 'Medication', 'FAQ'
  type: text("type").notNull(), // 'Article', 'Video', 'PDF'
  linkUrl: text("link_url"),
  thumbnailUrl: text("thumbnail_url"),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  category: text("category").notNull(), // 'Visit Summary', 'Result', 'Consent', 'Other'
  status: text("status").notNull(), // 'Released', 'Pending release', 'Not available'
  reasonForUnavailability: text("reason_for_unavailability"),
  previewText: text("preview_text"),
  author: text("author"),
  downloadUrl: text("download_url"),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type WaitlistStatus = typeof waitlistStatus.$inferSelect;
export type MedicalResult = typeof medicalResults.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Faq = typeof faqs.$inferSelect;
