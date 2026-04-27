import { ProviderLayout } from "@/provider/components/ProviderLayout";
import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import { Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { MOCK_APPOINTMENTS, AppointmentCard } from "./ProviderAppointments";
import { MOCK_TASKS, TASK_TYPE_CONFIG, type TaskType } from "./ProviderTasks";
import { useState } from "react";
import { useRole, showDashboardAppointments, canAccessTaskType } from "@/provider/lib/RoleContext";

export default function ProviderDashboard() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { role } = useRole();
  const hasAppointments = showDashboardAppointments(role.id);

  const todayAppts = MOCK_APPOINTMENTS
    .filter(a => isToday(a.date))
    .sort((a, b) => a.time.localeCompare(b.time));

  const pendingTasks = MOCK_TASKS.filter(t => !t.completed && canAccessTaskType(role.id, t.taskType));

  // Group pending tasks by type
  const taskBuckets = new Map<TaskType, number>();
  for (const task of pendingTasks) {
    taskBuckets.set(task.taskType, (taskBuckets.get(task.taskType) ?? 0) + 1);
  }
  const sortedBuckets = Array.from(taskBuckets.entries()).sort((a, b) => b[1] - a[1]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <ProviderLayout>
      {/* Greeting */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">
          {greeting}, {role.name}
        </h1>
        <p className="text-base text-muted-foreground mt-1.5 font-light">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      <div className={cn("grid grid-cols-1 gap-8", hasAppointments && "lg:grid-cols-2")}>
        {/* ── Left: Today's schedule (VP/VN only) ── */}
        {hasAppointments && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold font-display tracking-tight">Today's schedule</h2>
              <Link href="/appointments">
                <span className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5 cursor-pointer">
                  View all <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>

            {todayAppts.length === 0 ? (
              <div className="bg-card rounded-xl border border-border shadow-sm p-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <p className="text-base font-medium text-foreground">No appointments today</p>
                <p className="text-sm text-muted-foreground mt-1">Enjoy a free day.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppts.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appt={appt}
                    expanded={expandedId === appt.id}
                    onToggle={() => setExpandedId(expandedId === appt.id ? null : appt.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tasks ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-semibold font-display tracking-tight">Tasks</h2>
              {pendingTasks.length > 0 && (
                <span className="text-xs font-semibold text-white bg-primary rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingTasks.length}
                </span>
              )}
            </div>
            <Link href="/tasks">
              <span className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5 cursor-pointer">
                View all <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="bg-card rounded-xl border border-border shadow-sm p-12 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <p className="text-base font-medium text-foreground">All caught up</p>
              <p className="text-sm text-muted-foreground mt-1">No pending tasks.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sortedBuckets.map(([taskType, count]) => {
                const config = TASK_TYPE_CONFIG[taskType];
                const Icon = config.icon;
                return (
                  <Link key={taskType} href={config.route}>
                    <div className="bg-card rounded-xl border border-border shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:border-border/80 transition-all cursor-pointer group">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                        <Icon className={cn("w-5 h-5", config.text)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{taskType}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {count} pending task{count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <span className={cn(
                        "text-xl font-bold font-display tracking-tight",
                        config.text
                      )}>
                        {count}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProviderLayout>
  );
}
