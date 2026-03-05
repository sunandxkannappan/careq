import { Layout } from "@/components/Layout";
import { useAppointments, useCreateAppointment, useUpdateAppointment, useTasks } from "@/hooks/use-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, MapPin, Video, Phone, Clock, Video as VideoIcon, Download, ChevronRight, ChevronDown, AlertCircle, CheckCircle2, Circle } from "lucide-react";
import { format, isPast } from "date-fns";
import { useState } from "react";
import { Appointment } from "@shared/schema";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const carePlanByAppointment: Record<number, { assessment: string; carePlan: string[] }> = {
  2: {
    assessment: "Initial assessment completed. Patient presents with moderate-to-severe left hip osteoarthritis confirmed by imaging. Persistent groin and lateral hip pain with reduced range of motion reported.",
    carePlan: [
      "Anti-inflammatory medication (Naproxen 500mg twice daily as needed)",
      "Referral to pre-habilitation physiotherapy program twice weekly",
      "Low-impact weight-bearing exercises: swimming, stationary cycling, gentle walking",
      "Order MRI scan for detailed joint assessment",
      "Follow up in 3 months to reassess pain levels and mobility",
    ],
  },
};

const futureStages = [
  { name: "9 Month Appointment", description: "Pending" },
  { name: "12 Month Appointment", description: "Pending" },
  { name: "15 Month Appointment", description: "Pending" },
  { name: "Surgical Consult", description: "18 Months" },
];

export default function Appointments() {
  const { data: appointments, isLoading } = useAppointments();
  const { data: tasks } = useTasks();
  const createMutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    time: "",
    type: "In-Person"
  });

  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: ""
  });

  const [rescheduleCount, setRescheduleCount] = useState(() => {
    const stored = localStorage.getItem("careq_reschedule_count");
    return stored ? parseInt(stored, 10) : 1;
  });

  const allUpcoming = appointments?.filter(a => !isPast(new Date(a.date)) && a.status !== 'Cancelled') || [];
  const past = appointments?.filter(a => isPast(new Date(a.date)) || a.status === 'Completed') || [];

  const sortedUpcoming = [...allUpcoming].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const primaryAppointment = sortedUpcoming.length > 0 ? sortedUpcoming[0] : null;

  const pendingTasks = tasks?.filter(t => t.status === "Pending") || [];
  const hasPendingTasks = pendingTasks.length > 0;

  const handleCreate = () => {
    if (!formData.reason || !formData.date || !formData.time) return;
    
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    
    createMutation.mutate({
      title: formData.reason,
      doctorName: "Dr. Emily Chen",
      date: dateTime,
      type: formData.type,
      location: formData.type === "In-Person" ? "Orthopedic Center" : "Online",
      notes: "Patient requested appointment via portal.",
      zoomJoinUrl: null,
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setFormData({ reason: "", date: "", time: "", type: "In-Person" });
      }
    });
  };

  const openReschedule = (appt: Appointment) => {
    const d = new Date(appt.date);
    setRescheduleId(appt.id);
    setRescheduleData({
      date: format(d, "yyyy-MM-dd"),
      time: format(d, "HH:mm")
    });
  };

  const handleReschedule = () => {
    if (!rescheduleId || !rescheduleData.date || !rescheduleData.time) return;
    
    const dateTime = new Date(`${rescheduleData.date}T${rescheduleData.time}`);
    
    updateMutation.mutate({
      id: rescheduleId,
      date: dateTime,
      status: 'Scheduled'
    }, {
      onSuccess: () => {
        const newCount = rescheduleCount + 1;
        setRescheduleCount(newCount);
        localStorage.setItem("careq_reschedule_count", String(newCount));
        setRescheduleId(null);
      }
    });
  };

  const handleCancel = (id: number) => {
    updateMutation.mutate({
      id,
      status: 'Cancelled'
    });
  };

  if (isLoading) return <Layout><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-20" /></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center pt-2">
          <h1 className="font-display text-3xl font-bold text-foreground" data-testid="text-appointments-title">Appointments</h1>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Request Appointment</DialogTitle>
                <DialogDescription>Select a preferred time for your visit.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for visit</Label>
                  <Input 
                    id="reason" 
                    placeholder="e.g. Follow-up, New Pain" 
                    value={formData.reason}
                    onChange={e => setFormData({...formData, reason: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Appointment Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={val => setFormData({...formData, type: val})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In-Person">In-Person Visit</SelectItem>
                      <SelectItem value="Video Call">Video Consultation</SelectItem>
                      <SelectItem value="Phone">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Scheduling..." : "Confirm Request"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
              Past
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6 animate-in fade-in-50 duration-300">
            
            {sortedUpcoming.length > 0 ? (
              <div className="space-y-6">
                {sortedUpcoming.map((appt) => (
                  <Card key={appt.id} className="border-none shadow-md bg-white rounded-xl overflow-hidden" data-testid={`card-appointment-${appt.id}`}>
                    <CardContent className="p-0">
                      
                      <div className="bg-muted/30 px-6 py-3 border-b border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{appt.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Status:</span>
                          <Badge variant="secondary" className={cn(
                            "border-none px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider",
                            appt.status === 'Pending' ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
                          )}>
                            {appt.status === 'Pending' ? 'Pending Booking' : 'Booked'}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Care Team</h3>
                            <div className="flex gap-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12 rounded-lg border border-border">
                                  <AvatarImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100" />
                                  <AvatarFallback className="rounded-lg">Dr</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-foreground text-sm">Dr. Munib Ali</p>
                                  <p className="text-xs text-muted-foreground">Physician</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12 rounded-lg border border-border">
                                  <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100" />
                                  <AvatarFallback className="rounded-lg">RN</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-foreground text-sm">Sarah Jenkins</p>
                                  <p className="text-xs text-muted-foreground">Nurse</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                             <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 flex justify-center">
                                  <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                <span className="font-medium">
                                  {format(new Date(appt.date), "MMMM do, yyyy")}
                                </span>
                             </div>
                             <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 flex justify-center">
                                  <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <span className="font-medium">
                                  {format(new Date(appt.date), "h:mm a")}
                                </span>
                             </div>
                             <div className="flex items-center gap-3 text-foreground">
                                <div className="w-8 flex justify-center">
                                  {appt.type === 'Video Call' ? <VideoIcon className="w-5 h-5 text-primary" /> : appt.type === 'Phone' ? <Phone className="w-5 h-5 text-primary" /> : <MapPin className="w-5 h-5 text-primary" />}
                                </div>
                                <span className="font-medium">
                                  {appt.location} 
                                  {appt.type === 'Video Call' && " (Zoom)"}
                                </span>
                             </div>
                          </div>

                          {rescheduleCount > 0 && (
                            <div className="flex justify-end pt-2">
                              <span className="text-[10px] text-muted-foreground/60 italic flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Previously rescheduled {rescheduleCount} {rescheduleCount === 1 ? "time" : "times"}
                              </span>
                            </div>
                          )}

                        </div>

                        <div className="flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-8">
                          
                          {appt.type === 'Video Call' && (
                            <Button 
                              onClick={() => window.open('https://zoom.us/meeting/schedule', '_blank')}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                              data-testid="button-join-zoom"
                            >
                              <VideoIcon className="w-4 h-4 mr-2" /> Join Zoom Call
                            </Button>
                          )}

                          <Dialog open={rescheduleId === appt.id} onOpenChange={(open) => !open && setRescheduleId(null)}>
                            <DialogTrigger asChild>
                              <Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-white" onClick={() => openReschedule(appt)} data-testid="button-reschedule">
                                Reschedule
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reschedule Appointment</DialogTitle>
                                <DialogDescription>
                                  Choose a new date and time for your appointment.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>New Date</Label>
                                    <Input 
                                      type="date" 
                                      value={rescheduleData.date}
                                      onChange={e => setRescheduleData({...rescheduleData, date: e.target.value})}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>New Time</Label>
                                    <Input 
                                      type="time" 
                                      value={rescheduleData.time}
                                      onChange={e => setRescheduleData({...rescheduleData, time: e.target.value})}
                                    />
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleReschedule} disabled={updateMutation.isPending}>
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" className="w-full border-primary/20 text-foreground hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30" data-testid="button-cancel-appointment">
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel your appointment? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleCancel(appt.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  Yes, Cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="space-y-3 mt-2">
                  {futureStages.map((stage, index) => (
                    <Card key={index} className="border border-border/60 shadow-sm bg-white/80 rounded-xl" data-testid={`card-future-stage-${index}`}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground text-sm">{stage.name}</h3>
                          <p className="text-[10px] text-muted-foreground">{stage.description}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] h-5 bg-muted/50 text-muted-foreground border-border shrink-0">
                          Upcoming
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-border/60 shadow-sm">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-foreground">No Upcoming Appointments</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You don't have any visits scheduled at the moment.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 animate-in fade-in-50 duration-300">
             <div className="grid gap-3">
              {past.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(appt => {
                const carePlan = carePlanByAppointment[appt.id] || {
                  assessment: `${appt.title} completed with ${appt.doctorName}. Patient progress reviewed and care plan updated accordingly.`,
                  carePlan: [
                    "Continue current treatment plan and medications",
                    "Monitor symptoms and report any changes",
                    "Follow up at next scheduled appointment",
                  ],
                };
                return (
                <Collapsible key={appt.id}>
                  <Card className="border-none shadow-md bg-white rounded-xl overflow-hidden" data-testid={`card-past-appointment-${appt.id}`}>
                    <CardContent className="p-0">

                      <div className="bg-muted/30 px-6 py-3 border-b border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Status:</span>
                          <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-sm gap-1.5 group" data-testid={`button-care-plan-${appt.id}`}>
                            Care Plan <ChevronDown className="w-3.5 h-3.5 transition-transform group-data-[state=open]:rotate-180" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>

                      <div className="px-6 py-4 flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground text-base">{appt.title}</h3>
                          <p className="text-xs text-muted-foreground">{appt.doctorName}</p>
                        </div>
                      </div>

                      <CollapsibleContent>
                        <div className="px-6 pb-6 space-y-6 border-t border-border/40 pt-6">

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Care Team</h3>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 rounded-lg border border-border">
                                <AvatarImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100" />
                                <AvatarFallback className="rounded-lg">Dr</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-foreground text-sm">Dr. {appt.doctorName.replace(/^Dr\.\s*/i, '')}</p>
                                <p className="text-xs text-muted-foreground">Physician</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 rounded-lg border border-border">
                                <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100" />
                                <AvatarFallback className="rounded-lg">RN</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-foreground text-sm">Sarah Jenkins</p>
                                <p className="text-xs text-muted-foreground">Nurse</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-foreground">
                            <div className="w-8 flex justify-center">
                              <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-medium">
                              {format(new Date(appt.date), "MMMM do, yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-foreground">
                            <div className="w-8 flex justify-center">
                              <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-medium">
                              {format(new Date(appt.date), "h:mm a")}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-foreground">
                            <div className="w-8 flex justify-center">
                              {appt.type === 'Video Call' ? <VideoIcon className="w-5 h-5 text-primary" /> : <MapPin className="w-5 h-5 text-primary" />}
                            </div>
                            <span className="font-medium">
                              {appt.location}
                              {appt.type === 'Video Call' && " (Zoom)"}
                            </span>
                          </div>
                        </div>
                          <div className="bg-muted/30 p-5 rounded-lg border border-border/50">
                            <h4 className="font-semibold text-base text-foreground mb-3">Assessment</h4>
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              {carePlan.assessment}
                            </p>
                          </div>
                          <div className="bg-muted/30 p-5 rounded-lg border border-border/50">
                            <h4 className="font-semibold text-base text-foreground mb-3">Care Plan</h4>
                            <ul className="text-sm text-foreground/80 space-y-2 list-disc list-inside">
                              {carePlan.carePlan.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CollapsibleContent>

                    </CardContent>
                  </Card>
                </Collapsible>
                );
              })}
              {past.length === 0 && (
                 <div className="text-center py-12 text-muted-foreground">
                    No past appointments found.
                 </div>
              )}
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
