import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useTasks, useUpdateTask } from "@/hooks/use-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "wouter";

export default function Tasks() {
  const { data: tasks, isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const [, navigate] = useLocation();
  const [selectedTask, setSelectedTask] = useState<any>(null);

  if (isLoading) return <Layout><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-20" /></Layout>;

  const pending = tasks?.filter(t => t.status === "Pending") || [];
  const completed = tasks?.filter(t => t.status === "Completed") || [];

  const handleComplete = (id: number) => {
    updateTask.mutate({
      id,
      status: "Completed"
    });
    setSelectedTask(null);
  };

  const handleMarkIncomplete = (id: number) => {
    updateTask.mutate({
      id,
      status: "Pending"
    });
  };

  const TaskCard = ({ task, isCompleted }: { task: any, isCompleted: boolean }) => (
    <Card className={cn(
      "transition-all duration-300 border-l-4 hover:shadow-md",
      isCompleted ? "border-l-sky-400 opacity-75 hover:opacity-100" : 
      "border-l-primary"
    )}>
      <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={cn("font-bold text-lg", isCompleted && "line-through text-muted-foreground")}>
              {task.title}
            </h3>
            {task.category && (
              <Badge variant="outline" className="text-[10px] tracking-wider font-medium border-border text-muted-foreground">
                {task.category}
              </Badge>
            )}
            <Badge variant="secondary" 
              className={cn(
                "uppercase text-[10px] tracking-wider font-bold",
                isCompleted ? "bg-sky-100 text-sky-700 hover:bg-sky-200" :
                "bg-primary/10 text-primary hover:bg-primary/20"
              )}>
              {isCompleted ? "Completed" : "To Do"}
            </Badge>
          </div>
          
          <p className="text-muted-foreground text-sm max-w-2xl">
            {task.description}
          </p>

          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mt-2">
            {task.dueDate && (
              <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Due {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          {!isCompleted ? (
            <Button 
              onClick={() => task.actionUrl ? navigate(task.actionUrl) : setSelectedTask(task)} 
              className="w-full sm:w-auto gap-2 shadow-sm"
              data-testid={`button-complete-task-${task.id}`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {task.actionLabel || (task.category === "Appointment" ? "Go to Appointments" : "Complete Task")}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">My Tasks</h1>
          <p className="text-muted-foreground">Manage your required actions and documentation</p>
        </header>

        <Tabs defaultValue="todo" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 mx-auto sm:mx-0">
            <TabsTrigger value="todo" className="gap-2">
              To Do
              {pending.length > 0 && (
                <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] min-w-[1.25rem]">
                  {pending.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="todo" className="space-y-4 animate-in fade-in-50 duration-300">
            {pending.length > 0 ? (
              pending.map(task => <TaskCard key={task.id} task={task} isCompleted={false} />)
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-border/60">
                <div className="w-16 h-16 bg-sky-50 text-sky-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You have no pending tasks. Check back later or review your completed items.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 animate-in fade-in-50 duration-300">
            {completed.length > 0 ? (
              completed.map(task => <TaskCard key={task.id} task={task} isCompleted={true} />)
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-border/60">
                <div className="w-16 h-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-2">No Completed Tasks</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Tasks you complete will appear here for your reference.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
          <DialogContent className="sm:max-w-[450px]">
            {selectedTask && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedTask.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-muted-foreground text-sm">{selectedTask.description}</p>
                  {selectedTask.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="w-4 h-4" />
                      <span>Due {format(new Date(selectedTask.dueDate), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setSelectedTask(null)}>Cancel</Button>
                  <Button onClick={() => handleComplete(selectedTask.id)} data-testid="button-confirm-complete">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
