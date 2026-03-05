import { Layout } from "@/components/Layout";
import { useUser, useWaitlist, useAppointments, useTasks } from "@/hooks/use-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Activity,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: user } = useUser();
  const { data: waitlist } = useWaitlist();
  const { data: appointments } = useAppointments();
  const { data: tasks } = useTasks();

  const nextAppt = appointments?.find(a => a.status === 'Scheduled');
  const pendingTasks = tasks?.filter(t => t.status === 'Pending') || [];
  const progress = waitlist ? Math.round((waitlist.currentStage / waitlist.totalStages!) * 100) : 0;

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <Layout>
      <header className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          {greeting}, {user?.firstName}
        </h1>
        <p className="text-muted-foreground text-lg">Here's what's happening with your care today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Waitlist Card */}
        <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-none shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-lg font-medium text-primary-foreground/90">Current Waitlist Status</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-0">
              <div className="flex-1 w-full space-y-4 pr-0 sm:pr-6 flex flex-col justify-center">
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold mb-1">{waitlist?.stageName}</h3>
                  <p className="text-primary-foreground/80 text-sm">Step {waitlist?.currentStage} of {waitlist?.totalStages}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-primary-foreground/70 uppercase tracking-wider">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2.5 bg-black/20" indicatorClassName="bg-white" />
                </div>
                <Link href="/waitlist" className="block">
                  <Button variant="secondary" className="w-full bg-white text-primary border-none shadow-lg shadow-black/10" asChild>
                    <span>View Detailed Status</span>
                  </Button>
                </Link>
              </div>
              <div className="hidden sm:block w-px self-stretch bg-white/20 my-1" />
              <div className="block sm:hidden h-px w-full bg-white/20 my-4" />
              <div className="flex-1 w-full flex flex-col items-center justify-center pl-0 sm:pl-6 py-4">
                <p className="text-xs font-semibold text-primary-foreground/60 uppercase tracking-widest mb-2">Wait Time to Consult</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-white leading-none">~20</span>
                  <span className="text-lg font-medium text-primary-foreground/70">months</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Appointment Card */}
        <Card className="bg-card shadow-lg shadow-black/5 hover:shadow-xl transition-shadow duration-300 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Next Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextAppt ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
                  <p className="font-bold text-lg text-primary mb-1">
                    {format(new Date(nextAppt.date), "MMMM d, h:mm a")}
                  </p>
                  <p className="font-medium text-foreground">{nextAppt.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{nextAppt.doctorName}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  Confirmed
                </div>
                <Link href="/appointments" className="block mt-2">
                  <Button variant="outline" className="w-full" asChild>
                    <span>View All Appointments</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Link href="/appointments">
                   <Button asChild><span>Schedule Now</span></Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Priority Tasks</h2>
            <Link href="/tasks" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="group flex items-start gap-4 p-5 rounded-xl bg-white border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
                  <div className={cn(
                    "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    task.priority === 'urgent' ? "border-amber-500 bg-amber-50" : "border-muted-foreground/30"
                  )}>
                    {task.priority === 'urgent' && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{task.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    <Link href={task.actionUrl || "/tasks"}>
                      <Button size="sm" variant={task.priority === 'urgent' ? "default" : "outline"} className="text-xs" asChild>
                        <span>{task.actionLabel || "Complete Task"}</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-border">
                <CheckCircle2 className="w-12 h-12 text-sky-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg">All caught up!</h3>
                <p className="text-muted-foreground">You have no pending tasks at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Resources */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold font-display">Recommended For You</h2>
          <div className="space-y-4">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 group cursor-pointer">
              <div className="h-32 bg-muted relative">
                {/* Placeholder for resource image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Surgery Prep"
                />
                <div className="absolute bottom-3 left-3 z-20 text-white font-medium flex items-center gap-2">
                  <div className="bg-primary/90 p-1.5 rounded-lg">
                    <Clock className="w-3 h-3" />
                  </div>
                  <span>5 min read</span>
                </div>
              </div>
              <CardContent className="p-4">
                <Badge variant="outline" className="mb-2 text-xs border-primary/20 text-primary bg-primary/5">Education</Badge>
                <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">Preparing for Hip Surgery</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">Complete guide on what to expect before your procedure.</p>
              </CardContent>
            </Card>

            <div className="bg-secondary/10 rounded-xl p-5 border border-secondary/20">
              <h3 className="font-bold text-secondary-foreground flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4" />
                Health Tip
              </h3>
              <p className="text-sm text-foreground/80 italic">
                "Gentle stretching every morning can help maintain mobility while waiting for your procedure."
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
