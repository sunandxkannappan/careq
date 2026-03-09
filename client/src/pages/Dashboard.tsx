import { Layout } from "@/components/Layout";
import { useUser, useWaitlist, useAppointments, useTasks, useMyResults } from "@/hooks/use-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, ClipboardList, BookOpen, Hourglass, ListChecks } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: user } = useUser();
  const { data: waitlist } = useWaitlist();
  const { data: appointments } = useAppointments();
  const { data: tasks } = useTasks();
  const { data: results } = useMyResults();

  const nextAppt = appointments?.find((a) => a.status === "Scheduled") || null;
  const pendingTasks = (tasks || []).filter((t) => t.status === "Pending");
  const recentResults = (results || [])
    .filter((r) => r.category === "Labs" || r.category === "Imaging" || r.type === "Requisition")
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);
  const resourceItems = [
    { id: "ahkc", title: "AHKC Welcome Package", subtitle: "Joint assessment and surgical consult overview" },
    { id: "careq", title: "CareQ Welcome Package", subtitle: "Portal guide for tasks, appointments, and updates" },
  ];
  const monthsWaited = 6;
  const consultEstimateLow = 16;
  const consultEstimateHigh = 18;
  const consultEstimateMid = Math.round((consultEstimateLow + consultEstimateHigh) / 2);
  const waitProgress = Math.min(100, Math.round((monthsWaited / consultEstimateMid) * 100));

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="pb-2 border-b border-border/40">
          <h1 className="font-display text-3xl font-bold text-primary">Welcome, {user?.firstName}</h1>
          <p className="text-muted-foreground mt-1">Your care journey snapshot in one view.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 bg-primary shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-white"><Hourglass className="w-5 h-5 text-white" />Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col h-full">
              {waitlist ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-lg bg-white/12 border border-white/20 p-3">
                      <p className="text-xs text-blue-100">Wait List Status</p>
                      <p className="text-sm font-semibold text-white">Waiting for consult</p>
                    </div>
                    <div className="rounded-lg bg-white/12 border border-white/20 p-3">
                      <p className="text-xs text-blue-100">Time Waited Since Referral</p>
                      <p className="text-sm font-semibold text-white">{monthsWaited} months</p>
                    </div>
                    <div className="rounded-lg bg-white/12 border border-white/20 p-3">
                      <p className="text-xs text-blue-100">Wait Time to Consult</p>
                      <p className="text-sm font-semibold text-white">{consultEstimateLow}-{consultEstimateHigh} months</p>
                    </div>
                  </div>
                  <div className="pt-3 mt-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start mt-2">
                      <div className="sm:col-span-2">
                        <div className="flex justify-between items-center text-xs text-blue-100 mb-1.5">
                          <span>Referral to Consult Timeline</span>
                          <span>35%</span>
                        </div>
                        <Progress value={waitProgress} className="h-2.5 bg-white" indicatorClassName="bg-blue-200" />
                      </div>
                      <div className="sm:col-span-1 sm:justify-self-end self-end">
                        <Link href="/status"><Button className="bg-blue-200 text-blue-900 hover:bg-blue-300">View Status</Button></Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-blue-100">No status information available yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 bg-primary shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-white"><Calendar className="w-5 h-5 text-white" />Next Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col h-full">
              {nextAppt ? (
                <div className="space-y-4 flex flex-col h-full">
                  <div className="space-y-1">
                    <p className="font-semibold text-white">6 Month Appointment</p>
                    <p className="text-sm text-blue-100">Zoom Call</p>
                  </div>
                  <p className="text-sm text-blue-100">{format(new Date(nextAppt.date), "MMMM d, yyyy • h:mm a")}</p>
                  <div className="mt-auto pt-3">
                    <Link href="/appointments"><Button className="w-full bg-blue-200 text-blue-900 hover:bg-blue-300">View Appointment</Button></Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 flex flex-col h-full">
                  <p className="text-sm text-blue-100">No upcoming appointments.</p>
                  <div className="mt-auto pt-3">
                    <Link href="/appointments"><Button className="w-full bg-[#0b1f3a] text-white hover:bg-[#0b1f3a]/90">Go to Appointments</Button></Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 row-span-2 border border-border/60 bg-white shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><ListChecks className="w-5 h-5 text-primary" />Tasks</CardTitle>
              <Link href="/tasks" className="text-sm text-primary font-medium inline-flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingTasks.length > 0 ? (
                pendingTasks.slice(0, 7).map((task) => (
                  <div key={task.id} className="border border-border/60 rounded-lg p-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{task.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    </div>
                    <Badge className="bg-slate-100 text-slate-800 border-none">Pending</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No priority tasks right now.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-muted/30 shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><ClipboardList className="w-5 h-5 text-primary" />Latest Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex flex-col h-full">
              {recentResults.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {recentResults.map((result) => (
                      <div key={result.id} className="text-sm border-b border-border/40 pb-2 last:border-b-0 last:pb-0">
                        <p className="font-medium text-foreground">{result.title}</p>
                        <p className="text-muted-foreground">{result.category}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-3">
                    <Link href="/results"><Button className="w-full border-0 shadow-none bg-blue-200 text-blue-900 hover:bg-blue-300">View Results</Button></Link>
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full">
                  <p className="text-sm text-muted-foreground">No recent results to display.</p>
                  <div className="mt-auto pt-3">
                    <Link href="/results"><Button className="w-full border-0 shadow-none bg-blue-200 text-blue-900 hover:bg-blue-300">View Results</Button></Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-muted/30 shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" />New Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex flex-col h-full">
              <div className="space-y-2">
                {resourceItems.map((item) => (
                  <div key={item.id} className="text-sm border-b border-border/40 pb-2 last:border-b-0 last:pb-0">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-muted-foreground">{item.subtitle}</p>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-3">
                <Link href="/resources"><Button className="w-full border-0 shadow-none bg-blue-200 text-blue-900 hover:bg-blue-300">View Resources</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
