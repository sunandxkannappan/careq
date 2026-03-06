import { Layout } from "@/components/Layout";
import { useAppointments, useCreateAppointment } from "@/hooks/use-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, MapPin, Phone, Clock, Video as VideoIcon, ChevronDown, CheckCircle2 } from "lucide-react";
import { format, isPast } from "date-fns";
import { useState } from "react";
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

const appointmentTracking = {
  lateCancellations: 1,
  missedAppointments: 0,
};

// 6-Month appointment statuses to display
const sixMonthStatuses = [
  { status: "To book", type: "Zoom Call", date: "Jun 2026", time: "TBD", lateCancelDate: "June 15, 2026", missedDate: "June 10, 2026" },
  { status: "Booked", type: "Phone Call", date: "Jun 2026", time: "9:00 AM", lateCancelDate: null, missedDate: null },
  { status: "To confirm", type: "Zoom Call", date: "Jun 2026", time: "10:00 AM", lateCancelDate: null, missedDate: null },
  { status: "Confirmed", type: "Phone Call", date: "Jun 2026", time: "11:00 AM", lateCancelDate: null, missedDate: null },
  { status: "Ready", type: "Zoom Call", date: "Jun 2026", time: "9:00 AM", lateCancelDate: null, missedDate: null },
  { status: "Ready", type: "Phone Call", date: "Jun 2026", time: "9:00 AM", lateCancelDate: null, missedDate: null },
];

const futureStages = [
  { name: "9 Month Appointment", date: "Sep 2026", status: "Planned" },
  { name: "12 Month Appointment", date: "Dec 2026", status: "Planned" },
  { name: "15 Month Appointment", date: "Mar 2027", status: "Planned" },
];

export default function Appointments() {
  const { data: appointments, isLoading } = useAppointments();
  const createMutation = useCreateAppointment();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    time: "",
    type: "In-Person"
  });

  const past = appointments?.filter(a => isPast(new Date(a.date)) || a.status === 'Completed') || [];

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

  if (isLoading) return <Layout><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-20" /></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border/40">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3" data-testid="text-appointments-title">
              <Calendar className="w-8 h-8 text-primary" />
              Appointments
            </h1>
            <p className="text-muted-foreground mt-1">View and manage your upcoming and past appointments</p>
          </div>
          
        </header>

        <div>
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

        <Tabs defaultValue="future" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="future" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
              Future
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
              Past
            </TabsTrigger>
          </TabsList>

          <TabsContent value="future" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="space-y-6">
              {/* 6-Month Appointment Status Variations */}
              {sixMonthStatuses.map((item, idx) => (
                <Card key={idx} className="border-none shadow-md bg-white rounded-xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-muted/30 px-6 py-3 border-b border-border/40 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">6 Month Appointment</h3>
                        <p className="text-[10px] text-muted-foreground mt-1">{item.date}</p>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[10px] h-5 border-none shrink-0 font-bold uppercase tracking-wider",
                        item.status === 'Ready' ? "bg-emerald-100 text-emerald-700" :
                        "bg-muted/50 text-muted-foreground"
                      )}>
                        {item.status}
                      </Badge>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Left Side - Care Team & Details */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Care Team</h4>
                          <div className="flex gap-4">
                            {item.status === 'To book' ? (
                              <>
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-lg bg-muted"></div>
                                  <div>
                                    <p className="font-semibold text-foreground text-sm">TBD</p>
                                    <p className="text-xs text-muted-foreground">Physician</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-lg bg-muted"></div>
                                  <div>
                                    <p className="font-semibold text-foreground text-sm">TBD</p>
                                    <p className="text-xs text-muted-foreground">Nurse</p>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
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
                              </>
                            )}
                          </div>
                        </div>

                        {item.status !== 'To book' && (
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3 text-foreground">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span>{item.date}</span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground">
                              <Clock className="w-4 h-4 text-primary" />
                              <span>{item.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground">
                              {item.type === 'Zoom Call' ? <VideoIcon className="w-4 h-4 text-primary" /> : <Phone className="w-4 h-4 text-primary" />}
                              <span>{item.type}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Side - Actions & Tracking */}
                      <div className="flex flex-col gap-3 border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-8">
                        {item.status === 'To book' && (
                          <>
                            <Button className="w-full bg-primary text-white">Book Appointment</Button>
                            {(item.lateCancelDate || item.missedDate) && (
                              <div className="mt-2 space-y-1">
                                {item.lateCancelDate && (
                                  <Badge className="text-[10px] bg-yellow-100 text-yellow-800 w-full justify-start">
                                    Late Cancellation · {item.lateCancelDate}
                                  </Badge>
                                )}
                                {item.missedDate && (
                                  <Badge className="text-[10px] bg-red-100 text-red-800 w-full justify-start">
                                    Missed Appointment · {item.missedDate}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </>
                        )}
                        {item.status === 'Booked' && (
                          <>
                            {item.type === 'Zoom Call' ? (
                              <Button variant="outline" className="w-full">Switch to Phone</Button>
                            ) : (
                              <Button variant="outline" className="w-full">Switch to Zoom</Button>
                            )}
                            <Button variant="outline" className="w-full">Reschedule</Button>
                            <Button variant="outline" className="w-full">Cancel</Button>
                          </>
                        )}
                        {item.status === 'To confirm' && (
                          <>
                            <Button className="w-full bg-primary text-white">Confirm</Button>
                            <Button variant="outline" className="w-full">Reschedule</Button>
                            <Button variant="outline" className="w-full">Cancel</Button>
                          </>
                        )}
                        {item.status === 'Confirmed' && (
                          <>
                            <Button variant="outline" className="w-full">Reschedule</Button>
                            <Button variant="outline" className="w-full">Cancel</Button>
                          </>
                        )}
                        {item.status === 'Ready' && item.type === 'Zoom Call' && (
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                            <VideoIcon className="w-4 h-4 mr-2" /> Join Now
                          </Button>
                        )}
                        {item.status === 'Ready' && item.type === 'Phone Call' && (
                          <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                            <p className="text-[10px] font-semibold text-muted-foreground mb-2">INCOMING CALL</p>
                            <p className="text-sm font-medium text-foreground">You can expect a phone call to (604) 555-0142</p>
                            <p className="text-[10px] text-muted-foreground mt-1">between 9:00 AM - 9:15 AM</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Future Stages - Planned Appointments */}
              <div className="space-y-3 mt-8">
                {futureStages.map((stage, index) => (
                  <Card key={index} className="border border-border/60 shadow-sm bg-white/80 rounded-xl">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{stage.name}</h3>
                        <p className="text-[10px] text-muted-foreground mt-1">{stage.date}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] h-5 bg-muted/50 text-muted-foreground border-border shrink-0 font-bold uppercase tracking-wider">
                        {stage.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="past" className="space-y-6 animate-in fade-in-50 duration-300">
            {past.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Late Cancellations</p>
                  <p className="text-2xl font-bold text-foreground">{appointmentTracking.lateCancellations}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Missed Appointments</p>
                  <p className="text-2xl font-bold text-foreground">{appointmentTracking.missedAppointments}</p>
                </div>
              </div>
            )}
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
                        <div>
                          <h3 className="text-sm font-bold text-foreground">{appt.title}</h3>
                          <p className="text-[10px] text-muted-foreground mt-1">{format(new Date(appt.date), "MMM yyyy")}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {appt.id === 1 && (
                            <>
                              <Badge className="text-[10px] bg-yellow-100 text-yellow-800 border-none">
                                Late Cancellation · June 10, 2025
                              </Badge>
                              <Badge className="text-[10px] bg-red-100 text-red-800 border-none">
                                Missed Appointment · June 5, 2025
                              </Badge>
                            </>
                          )}
                          <Badge className="bg-emerald-100 text-emerald-700 border-none">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
                          </Badge>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-sm gap-1.5 group">
                              <ChevronDown className="w-3.5 h-3.5 transition-transform group-data-[state=open]:rotate-180" />
                            </Button>
                          </CollapsibleTrigger>
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
                              {appt.type === 'Video Call' ? <VideoIcon className="w-5 h-5 text-primary" /> : appt.type === 'Phone' ? <Phone className="w-5 h-5 text-primary" /> : <MapPin className="w-5 h-5 text-primary" />}
                            </div>
                            <span className="font-medium">
                              {appt.type === 'Video Call' ? 'Zoom Call' : appt.type === 'Phone' ? 'Phone Call' : appt.location}
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
