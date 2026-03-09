import { Layout } from "@/components/Layout";
import { useTasks } from "@/hooks/use-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ListChecks, FileText, Calendar, ClipboardList } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

const categoryToType: Record<string, "Forms" | "Appointments" | "Results"> = {
  "Complete Forms": "Forms",
  Appointment: "Appointments",
  Labs: "Results",
  Imaging: "Results",
};

const typeOrder: Array<"Forms" | "Appointments" | "Results"> = ["Forms", "Appointments", "Results"];

const typeIcon = {
  Forms: FileText,
  Appointments: Calendar,
  Results: ClipboardList,
};

export default function Tasks() {
  const { data: tasks, isLoading } = useTasks();
  const [, navigate] = useLocation();

  if (isLoading) return <Layout><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-20" /></Layout>;

  const allTasks = tasks || [];
  const pending = allTasks.filter((t) => t.status === "Pending");
  const completed = allTasks.filter((t) => t.status === "Completed");

  const getTaskAction = (task: any) => {
    const title = (task.title || "").toLowerCase();
    if (task.category === "Complete Forms") {
      if (title.includes("consent")) return { label: "Complete Form", href: "/forms/consent" };
      if (title.includes("pre-visit")) return { label: "Complete Form", href: "/forms/pre-appointment" };
      return { label: "Start Form", href: "/forms/health-history" };
    }
    if (title.includes("book appointment")) return { label: "Book Appointment", href: "/book-appointment" };
    if (title.includes("confirm appointment")) return { label: "Confirm Appointment", href: "/appointments" };
    if (title.includes("lab") || title.includes("imaging")) return { label: "Access Requisition", href: "/results" };
    return { label: "View E-Advice", href: "/resources" };
  };

  const withMeta = (task: any) => {
    const type = categoryToType[task.category] || "Forms";
    const action = getTaskAction(task);
    return { ...task, type, action };
  };

  const grouped = (list: any[]) => {
    const normalized = list.map(withMeta);
    return typeOrder
      .map((type) => ({ type, items: normalized.filter((t) => t.type === type) }))
      .filter((group) => group.items.length > 0);
  };

  const pendingGroups = grouped(pending);
  const completedGroups = grouped(completed);

  const TaskCard = ({ task, isCompleted }: { task: any; isCompleted: boolean }) => (
    <Card className="border rounded-lg bg-white shadow-sm border-border/60">
      <CardContent className="p-4 md:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={cn("font-semibold text-sm text-foreground", isCompleted && "text-muted-foreground line-through")}>
              {task.title.includes("Patient History") ? "Health History Form" : task.title.includes("Pre-Visit") ? "Pre-Appointment Form" : task.title}
            </p>
            <Badge className={cn("border-none", isCompleted ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800")}>
              {isCompleted ? "Completed" : "Pending"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 lg:items-center">
          {!isCompleted && (
            <Button
              onClick={() => {
                navigate(task.action.href);
              }}
            >
              {task.action.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const GroupSection = ({ type, items, completedView }: { type: "Forms" | "Appointments" | "Results"; items: any[]; completedView?: boolean }) => {
    const Icon = typeIcon[type];
    return (
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4.5 h-4.5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">{type}</h3>
          <Badge className="bg-muted text-muted-foreground border-none">{items.length}</Badge>
        </div>
        <div className="space-y-2">
          {items.map((task) => (
            <TaskCard key={task.id} task={task} isCompleted={!!completedView} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="w-8 h-8 text-primary" />
              <h1 className="font-display text-3xl font-bold text-foreground">Tasks</h1>
            </div>
            <p className="text-muted-foreground">Task list and status tracker for forms, appointments, and results.</p>
          </div>
          <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </header>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
              Pending ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
              Completed ({completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {pendingGroups.length > 0 ? (
              pendingGroups.map((group) => <GroupSection key={group.type} type={group.type} items={group.items} />)
            ) : (
              <Card className="border rounded-lg bg-white shadow-sm border-border/60"><CardContent className="py-10 text-center text-muted-foreground text-sm">No pending tasks.</CardContent></Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedGroups.length > 0 ? (
              completedGroups.map((group) => <GroupSection key={group.type} type={group.type} items={group.items} completedView />)
            ) : (
              <Card className="border rounded-lg bg-white shadow-sm border-border/60"><CardContent className="py-10 text-center text-muted-foreground text-sm">No completed tasks yet.</CardContent></Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
