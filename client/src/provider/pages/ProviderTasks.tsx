import { ProviderLayout } from "@/provider/components/ProviderLayout";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { useRole, canAccessTaskType } from "@/provider/lib/RoleContext";
import {
  Calendar,
  FileText,
  FileSearch,
  Stethoscope,
  FlaskConical,
  HeartHandshake,
  ClipboardCheck,
} from "lucide-react";

// ─── Task type definitions ─────────────────────────────────

export type TaskType =
  | "Charting"
  | "E-advice"
  | "E-consult"
  | "Escalation"
  | "Investigations"
  | "Care Coordination"
  | "Scheduling";

export interface Task {
  id: string;
  title: string;
  taskType: TaskType;
  completed: boolean;
  patientName?: string;
  dueDate?: string;
}

export const MOCK_TASKS: Task[] = [
  // Charting
  { id: "t1",  title: "Pre-chart for Sandra Obi",                taskType: "Charting",          completed: false, patientName: "Sandra Obi",        dueDate: "Today" },
  { id: "t2",  title: "Chart review for Helen Tremblay",         taskType: "Charting",          completed: false, patientName: "Helen Tremblay",    dueDate: "Today" },
  { id: "t3",  title: "Appointment charting — David Chen",       taskType: "Charting",          completed: false, patientName: "David Chen",        dueDate: "Today" },
  { id: "t4",  title: "Pre-chart for Thomas Blais",              taskType: "Charting",          completed: false, patientName: "Thomas Blais",      dueDate: "This week" },
  // E-advice
  { id: "t5",  title: "Review e-advice for Omar Hassan",         taskType: "E-advice",          completed: true,  patientName: "Omar Hassan" },
  // E-consult
  { id: "t6",  title: "E-consult pending — Robert Singh",        taskType: "E-consult",         completed: false, patientName: "Robert Singh",      dueDate: "Today" },
  { id: "t7",  title: "E-consult follow-up — Helen Tremblay",    taskType: "E-consult",         completed: false, patientName: "Helen Tremblay",    dueDate: "This week" },
  // Escalation
  { id: "t8",  title: "Urgent escalation — Sandra Obi",          taskType: "Escalation",        completed: false, patientName: "Sandra Obi",        dueDate: "Today" },
  { id: "t9",  title: "Escalation consult — Brenda MacPherson",  taskType: "Escalation",        completed: false, patientName: "Brenda MacPherson", dueDate: "Today" },
  { id: "t10", title: "Escalation review — David Chen",          taskType: "Escalation",        completed: false, patientName: "David Chen",        dueDate: "This week" },
  { id: "t11", title: "Escalation follow-up — Thomas Blais",     taskType: "Escalation",        completed: false, patientName: "Thomas Blais",      dueDate: "This week" },
  { id: "t12", title: "Escalation consult — Fatima Al-Rashid",   taskType: "Escalation",        completed: false, patientName: "Fatima Al-Rashid",  dueDate: "Next week" },
  { id: "t13", title: "Escalation consult — Robert Singh",       taskType: "Escalation",        completed: false, patientName: "Robert Singh",      dueDate: "Next week" },
  // Investigations
  { id: "t14", title: "MRI results reviewed — David Chen",       taskType: "Investigations",    completed: true,  patientName: "David Chen" },
  { id: "t15", title: "Blood work reviewed — Helen Tremblay",    taskType: "Investigations",    completed: true,  patientName: "Helen Tremblay" },
  // Care Coordination
  { id: "t16", title: "Care coordination — Margaret Liu",        taskType: "Care Coordination", completed: false, patientName: "Margaret Liu",      dueDate: "This week" },
  { id: "t17", title: "Care coordination — Omar Hassan",         taskType: "Care Coordination", completed: false, patientName: "Omar Hassan",       dueDate: "Next week" },
  // Scheduling
  { id: "t18", title: "Schedule follow-up — David Chen",         taskType: "Scheduling",        completed: false, patientName: "David Chen",        dueDate: "Today" },
  { id: "t19", title: "Schedule pre-op — Sandra Obi",            taskType: "Scheduling",        completed: false, patientName: "Sandra Obi",        dueDate: "Today" },
  { id: "t20", title: "Schedule imaging — Brenda MacPherson",    taskType: "Scheduling",        completed: false, patientName: "Brenda MacPherson", dueDate: "This week" },
  { id: "t21", title: "Schedule consult — Robert Singh",         taskType: "Scheduling",        completed: false, patientName: "Robert Singh",      dueDate: "This week" },
  { id: "t22", title: "Schedule follow-up — Thomas Blais",       taskType: "Scheduling",        completed: false, patientName: "Thomas Blais",      dueDate: "Next week" },
  { id: "t23", title: "Schedule assessment — Fatima Al-Rashid",  taskType: "Scheduling",        completed: false, patientName: "Fatima Al-Rashid",  dueDate: "Next week" },
];

// ─── Task type config ──────────────────────────────────────

export const TASK_TYPE_CONFIG: Record<TaskType, {
  icon: typeof Calendar;
  bg: string;
  text: string;
  route: string;
}> = {
  Scheduling:          { icon: Calendar,        bg: "bg-slate-50",    text: "text-slate-600",    route: "/schedule" },
  "E-advice":          { icon: FileText,        bg: "bg-amber-50",    text: "text-amber-700",    route: "/charting" },
  "E-consult":         { icon: FileSearch,      bg: "bg-blue-50",     text: "text-blue-600",     route: "/reviews" },
  Escalation:          { icon: Stethoscope,     bg: "bg-red-50",      text: "text-red-600",      route: "/reviews" },
  Investigations:      { icon: FlaskConical,    bg: "bg-purple-50",   text: "text-purple-600",   route: "/reviews" },
  "Care Coordination": { icon: HeartHandshake,  bg: "bg-emerald-50",  text: "text-emerald-600",  route: "/reviews" },
  Charting:            { icon: ClipboardCheck,  bg: "bg-purple-50",   text: "text-purple-600",   route: "/charting" },
};

const TASK_TYPE_ORDER: TaskType[] = [
  "Scheduling",
  "E-advice",
  "E-consult",
  "Escalation",
  "Investigations",
  "Care Coordination",
  "Charting",
];

// ─── Main component ────────────────────────────────────────

export default function ProviderTasks() {
  const [, navigate] = useLocation();
  const { role } = useRole();

  // Only show task types accessible to the current role
  const visibleTaskTypes = TASK_TYPE_ORDER.filter(t => canAccessTaskType(role.id, t));

  const pendingByType: Record<TaskType, number> = {} as Record<TaskType, number>;
  for (const t of visibleTaskTypes) {
    pendingByType[t] = MOCK_TASKS.filter((task) => task.taskType === t && !task.completed).length;
  }

  const totalPending = MOCK_TASKS.filter((t) => !t.completed && canAccessTaskType(role.id, t.taskType)).length;

  return (
    <ProviderLayout>
      {/* Page title */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">
          Tasks
        </h1>
        <p className="text-base text-muted-foreground mt-1.5 font-light">
          {totalPending} pending task{totalPending !== 1 ? "s" : ""} across all categories.
        </p>
      </div>

      {/* Task type grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleTaskTypes.map((taskType) => {
          const config = TASK_TYPE_CONFIG[taskType];
          const Icon = config.icon;
          const pending = pendingByType[taskType];
          const allGood = pending === 0;

          return (
            <button
              key={taskType}
              onClick={() => navigate(config.route)}
              className="bg-card rounded-xl border border-border shadow-sm overflow-hidden text-left transition-all duration-150 hover:shadow-md group"
            >
              {/* Card body */}
              <div className="p-6 flex items-center gap-4">
                <div className={cn("w-11 h-11 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                  <Icon className={cn("w-5 h-5", config.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold font-display tracking-tight text-foreground">
                    {taskType}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {allGood ? "No pending tasks" : `${pending} pending task${pending !== 1 ? "s" : ""}`}
                  </p>
                </div>
                {allGood ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Complete
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {pending} Pending
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </ProviderLayout>
  );
}
