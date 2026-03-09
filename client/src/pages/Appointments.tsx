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
import { Calendar, MapPin, Phone, Clock, Video as VideoIcon, CheckCircle2, X, LifeBuoy, ChevronDown, Download, MessageSquareText, Pill, Dumbbell, Activity } from "lucide-react";
import { format, isPast } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

const sixMonthStatuses = [
  { status: "Overdue", type: "TBD", date: "Jun 2026", time: "TBD" },
  { status: "To book", type: "TBD", date: "Jun 2026", time: "TBD" },
  { status: "Booked", type: "Phone Call", date: "June 12, 2026", time: "9:00 AM" },
  { status: "To confirm", type: "Zoom Call", date: "June 12, 2026", time: "10:00 AM" },
  { status: "Confirmed", type: "Phone Call", date: "June 12, 2026", time: "11:00 AM" },
  { status: "Ready", type: "Zoom Call", date: "June 12, 2026", time: "9:00 AM" },
  { status: "Ready", type: "Phone Call", date: "June 12, 2026", time: "9:00 AM" },
  { status: "Late Cancellation", type: "Phone Call", date: "June 12, 2026", time: "TBD" },
  { status: "Missed Appointment", type: "Phone Call", date: "June 12, 2026", time: "TBD" },
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
  const [overlay, setOverlay] = useState<"zoom" | "phone" | "help" | null>(null);

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

  const downloadPastSummaryPdf = (title: string, date: Date, doctor: string) => {
    const lines = [
      "CareQ Appointment Summary",
      "",
      `Appointment: ${title}`,
      `Date: ${format(date, "MMMM d, yyyy")}`,
      `Time: ${format(date, "h:mm a")}`,
      `Physician: ${doctor}`,
      "Nurse: Anita Cast",
    ];
    const escapePdfText = (value: string) =>
      value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    const content = lines
      .map((line, i) => `BT /F1 12 Tf 50 ${760 - i * 20} Td (${escapePdfText(line)}) Tj ET`)
      .join("\n");
    const objects = [
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
      "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
      "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
      `5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`,
    ];
    let pdf = "%PDF-1.4\n";
    const offsets: number[] = [0];
    for (const obj of objects) {
      offsets.push(pdf.length);
      pdf += `${obj}\n`;
    }
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i < offsets.length; i++) {
      pdf += `${offsets[i].toString().padStart(10, "0")} 00000 n \n`;
    }
    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `appointment-summary-${title.toLowerCase().replace(/\s+/g, "-")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            <p className="text-muted-foreground mt-1">View and manage your future and past appointments</p>
          </div>
          <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated: {new Date().toLocaleDateString()}
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

          <Dialog open={overlay !== null} onOpenChange={(open) => !open && setOverlay(null)}>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
              {overlay === "zoom" && (
                <>
                  <DialogHeader>
                    <DialogTitle>Join Your Video Visit</DialogTitle>
                    <DialogDescription>
                      Your appointment is ready to begin. Please make sure your camera, microphone, and internet connection are working before joining.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5 py-2">
                    <div className="space-y-2">
                      <p className="font-semibold">Step 1 - Check Your Setup</p>
                      <p>Make sure:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Your camera is on</li>
                        <li>Your microphone is working</li>
                        <li>Your internet connection is stable</li>
                        <li>You are in a quiet and private space</li>
                      </ul>
                      <p className="text-muted-foreground">You can test your device before joining.</p>
                      <Button variant="outline">Test Camera &amp; Microphone</Button>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Step 2 - Join Your Appointment</p>
                      <p className="text-muted-foreground">When you are ready, click the button below to join the video visit.</p>
                      <p className="text-muted-foreground">Your care team will admit you when the appointment begins.</p>
                      <Button className="w-full sm:w-auto">Join Video Visit</Button>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">If You Have Trouble</p>
                      <p className="text-muted-foreground">If video is not working, you can switch to a phone call instead.</p>
                      <Button variant="outline" onClick={() => setOverlay("phone")}>Switch to Phone Call</Button>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">Need Help?</p>
                      <p className="text-muted-foreground">If you are having trouble joining your visit, please contact the clinic.</p>
                      <p>(403) XXX-XXXX</p>
                      <Button variant="outline" onClick={() => setOverlay("help")}>Get Help</Button>
                    </div>
                  </div>
                </>
              )}

              {overlay === "phone" && (
                <>
                  <DialogHeader>
                    <DialogTitle>Prepare for Your Phone Appointment</DialogTitle>
                    <DialogDescription>
                      Your care team will call you at the scheduled time. Please confirm the phone number where you would like to receive the call.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5 py-2">
                    <div className="space-y-1">
                      <p className="font-semibold">Phone number for this appointment</p>
                      <p>(403) 555-1234</p>
                      <Button variant="outline">Change Phone Number</Button>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">At the time of your appointment:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Please keep your phone nearby</li>
                        <li>Make sure your phone is not on silent</li>
                        <li>Answer calls from unknown or private numbers</li>
                      </ul>
                      <p className="text-muted-foreground">If we cannot reach you, we may attempt to call again.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setOverlay(null)}>Confirm I'm Ready</Button>
                      <Button variant="outline" onClick={() => setOverlay("zoom")}>Switch to Video Visit</Button>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">Need Help?</p>
                      <p className="text-muted-foreground">If you are having trouble with your appointment, please contact the clinic.</p>
                      <p>(403) XXX-XXXX</p>
                      <Button variant="outline" onClick={() => setOverlay("help")}>Get Help</Button>
                    </div>
                  </div>
                </>
              )}

              {overlay === "help" && (
                <>
                  <DialogHeader>
                    <DialogTitle>Appointment Help</DialogTitle>
                    <DialogDescription>
                      If you are having trouble joining your appointment, we are here to help.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5 py-2">
                    <div className="space-y-2">
                      <p className="font-semibold">I can&apos;t join my video visit</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Check your internet connection</li>
                        <li>Make sure your camera and microphone are allowed</li>
                        <li>Try refreshing the page or re-joining</li>
                      </ul>
                      <Button variant="outline" onClick={() => setOverlay("zoom")}>Join Video Visit Again</Button>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">I need to switch to a phone call</p>
                      <Button variant="outline" onClick={() => setOverlay("phone")}>Switch to Phone Call</Button>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">I missed the call</p>
                      <p className="text-muted-foreground">If you missed the call, please contact the clinic to reschedule.</p>
                      <Button variant="outline">Reschedule Appointment</Button>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">Contact the Clinic</p>
                      <p>(403) XXX-XXXX</p>
                      <p className="text-muted-foreground">Clinic staff can help you join your visit or reschedule if needed.</p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOverlay(null)}>Return to Appointment</Button>
                    </DialogFooter>
                  </div>
                </>
              )}
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
                    <div className={cn(
                      "px-6 py-3 border-b border-border/40 flex items-center justify-between",
                      item.status === "To book" || item.status === "To confirm" ? "bg-muted/40" :
                      item.status === "Booked" ? "bg-accent" :
                      item.status === "Confirmed" ? "bg-blue-50" :
                      item.status === "Ready" ? "bg-emerald-50" :
                      item.status === "Late Cancellation" ? "bg-yellow-50" :
                      "bg-red-50"
                    )}>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">6 Month Appointment</h3>
                        <p className="text-sm text-muted-foreground mt-1">Jun 2026</p>
                      </div>
                      <Badge className={cn(
                        "text-sm border-none shrink-0 font-bold",
                        item.status === "To book" || item.status === "To confirm" ? "bg-black text-white" :
                        item.status === "Booked" ? "bg-primary text-white" :
                        item.status === "Confirmed" ? "bg-primary text-white" :
                        item.status === "Ready" ? "bg-emerald-700 text-white" :
                        item.status === "Late Cancellation" ? "bg-yellow-500 text-black" :
                        "bg-red-700 text-white"
                      )}>
                        {item.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50 bg-white">
                      <div className="p-5 space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Details</h4>
                        {item.status !== "To book" && item.status !== "Overdue" && (
                          <>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 rounded-lg border border-border">
                                <AvatarImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100" />
                                <AvatarFallback className="rounded-lg">Dr</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-foreground text-sm">Dr. Justin Case</p>
                                <p className="text-sm text-muted-foreground">Physician</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 rounded-lg border border-border">
                                <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100" />
                                <AvatarFallback className="rounded-lg">RN</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-foreground text-sm">Anita Cast</p>
                                <p className="text-sm text-muted-foreground">Nurse</p>
                              </div>
                            </div>
                          </>
                        )}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /><span>{item.status === "To book" || item.status === "Overdue" ? "TBD" : item.date}</span></div>
                          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /><span>{item.status === "To book" || item.status === "Overdue" ? "TBD" : item.time}</span></div>
                          <div className="flex items-center gap-2">{item.type === "Zoom Call" ? <VideoIcon className="w-4 h-4 text-primary" /> : <Phone className="w-4 h-4 text-primary" />}<span>{item.status === "To book" || item.status === "Overdue" ? "TBD" : item.type}</span></div>
                        </div>
                      </div>

                      <div className="p-5">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">History</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                            <span className="text-sm text-muted-foreground">Late cancellation (Jun 10, 2025)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <span className="text-sm text-muted-foreground">Missed appointment (Jun 05, 2025)</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col gap-3 items-center justify-start">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide w-full max-w-[240px]">Actions</h4>
                        {item.status === 'To book' && <Button className="w-full max-w-[240px] bg-black text-white"><Calendar className="w-4 h-4 mr-2" />Book Appointment</Button>}
                        {item.status === 'Booked' && (<><Button variant="outline" className="w-full max-w-[240px]"><VideoIcon className="w-4 h-4 mr-2" />Switch to Zoom</Button><Button variant="outline" className="w-full max-w-[240px]"><Clock className="w-4 h-4 mr-2" />Reschedule</Button><Button className="w-full max-w-[240px] bg-red-100 text-red-700 border border-red-200 hover:bg-red-100"><X className="w-4 h-4 mr-2" />Cancel</Button></>)}
                        {item.status === 'To confirm' && (<><Button className="w-full max-w-[240px] bg-black text-white"><CheckCircle2 className="w-4 h-4 mr-2" />Confirm Appointment</Button><Button variant="outline" className="w-full max-w-[240px]"><Phone className="w-4 h-4 mr-2" />Switch to Phone</Button><Button variant="outline" className="w-full max-w-[240px]"><Clock className="w-4 h-4 mr-2" />Reschedule</Button><Button className="w-full max-w-[240px] bg-red-100 text-red-700 border border-red-200 hover:bg-red-100"><X className="w-4 h-4 mr-2" />Cancel</Button></>)}
                        {item.status === 'Confirmed' && (<><Button variant="outline" className="w-full max-w-[240px]"><VideoIcon className="w-4 h-4 mr-2" />Switch to Zoom</Button><Button variant="outline" className="w-full max-w-[240px]"><Clock className="w-4 h-4 mr-2" />Reschedule</Button><Button className="w-full max-w-[240px] bg-red-100 text-red-700 border border-red-200 hover:bg-red-100"><X className="w-4 h-4 mr-2" />Cancel</Button></>)}
                        {item.status === 'Ready' && item.type === 'Zoom Call' && (
                          <>
                            <Button className="w-full max-w-[240px] bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setOverlay("zoom")}><VideoIcon className="w-4 h-4 mr-2" />Join Now</Button>
                            <Button variant="outline" className="w-full max-w-[240px]"><Phone className="w-4 h-4 mr-2" />Switch to Phone</Button>
                            <Button className="w-full max-w-[240px] bg-red-100 text-red-700 border border-red-200 hover:bg-red-100" onClick={() => setOverlay("help")}><LifeBuoy className="w-4 h-4 mr-2" />I Need Help</Button>
                          </>
                        )}
                        {item.status === 'Ready' && item.type === 'Phone Call' && (
                          <>
                            <Button className="w-full max-w-[240px] bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setOverlay("phone")}><Phone className="w-4 h-4 mr-2" />Ready for Call</Button>
                            <Button variant="outline" className="w-full max-w-[240px]"><VideoIcon className="w-4 h-4 mr-2" />Switch to Zoom</Button>
                            <Button className="w-full max-w-[240px] bg-red-100 text-red-700 border border-red-200 hover:bg-red-100" onClick={() => setOverlay("help")}><LifeBuoy className="w-4 h-4 mr-2" />I Need Help</Button>
                          </>
                        )}
                        {item.status === 'Overdue' && (
                          <>
                            <p className="text-sm text-muted-foreground w-full max-w-[240px]">This appointment is overdue. Please book an appointment to continue your care journey.</p>
                            <Button className="w-full max-w-[240px] bg-red-600 hover:bg-red-700 text-white"><Calendar className="w-4 h-4 mr-2" />Book Appointment</Button>
                          </>
                        )}
                        {item.status === 'Late Cancellation' && (
                          <>
                            <p className="text-sm text-muted-foreground w-full max-w-[240px]">This appointment was cancelled late. Please book a new appointment to continue your care journey.</p>
                            <Button className="w-full max-w-[240px] bg-yellow-500 hover:bg-yellow-500 text-black border border-yellow-600"><Calendar className="w-4 h-4 mr-2" />Book New Appointment</Button>
                          </>
                        )}
                        {item.status === 'Missed Appointment' && (
                          <>
                            <p className="text-sm text-muted-foreground w-full max-w-[240px]">This appointment was missed. Please book an appointment to continue your care journey.</p>
                            <Button className="w-full max-w-[240px] bg-red-600 hover:bg-red-700 text-white"><Calendar className="w-4 h-4 mr-2" />Book New Appointment</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Future Stages - Planned Appointments */}
              <div className="space-y-3 mt-8">
                {futureStages.map((stage, index) => (
                  <Card key={index} className="border border-border/60 shadow-sm bg-white rounded-xl">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{stage.name}</h3>
                        <p className="text-[10px] text-muted-foreground mt-1">{stage.date}</p>
                      </div>
                      <Badge className="text-sm border-none shrink-0 font-bold bg-neutral-600 text-white">
                        {stage.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="past" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="grid gap-3">
              {past.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(appt => {
                return (
                  <Collapsible key={appt.id}>
                    <Card className="border border-border/60 shadow-sm bg-white rounded-xl overflow-hidden" data-testid={`card-past-appointment-${appt.id}`}>
                      <CardContent className="p-0">
                        <div className="bg-muted/30 px-6 py-3 border-b border-border/40 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-foreground">{appt.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{format(new Date(appt.date), "MMM yyyy")}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="text-sm border-none shrink-0 font-bold bg-emerald-100 text-emerald-700">
                              <CheckCircle2 className="w-4 h-4 mr-1.5" />
                              Completed
                            </Badge>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-sm gap-1.5 group">
                                <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>

                        <CollapsibleContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50 bg-white">
                            <div className="p-5 space-y-4">
                              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Details</h4>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12 rounded-lg border border-border">
                                  <AvatarImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100" />
                                  <AvatarFallback className="rounded-lg">Dr</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-foreground text-sm">Dr. Justin Case</p>
                                  <p className="text-sm text-muted-foreground">Physician</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12 rounded-lg border border-border">
                                  <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100" />
                                  <AvatarFallback className="rounded-lg">RN</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-foreground text-sm">Anita Cast</p>
                                  <p className="text-sm text-muted-foreground">Nurse</p>
                                </div>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /><span>{format(new Date(appt.date), "MMMM d, yyyy")}</span></div>
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /><span>{format(new Date(appt.date), "h:mm a")}</span></div>
                                <div className="flex items-center gap-2">{appt.type === 'Video Call' ? <VideoIcon className="w-4 h-4 text-primary" /> : appt.type === 'Phone' ? <Phone className="w-4 h-4 text-primary" /> : <MapPin className="w-4 h-4 text-primary" />}<span>{appt.type === 'Video Call' ? 'Zoom Call' : appt.type === 'Phone' ? 'Phone Call' : appt.location}</span></div>
                              </div>
                            </div>
                            <div className="p-5 space-y-3">
                              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">History</h4>
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                <span className="text-sm text-muted-foreground">Late cancellation (Jun 10, 2025)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                <span className="text-sm text-muted-foreground">Missed appointment (Jun 05, 2025)</span>
                              </div>
                            </div>
                            <div className="p-5 flex flex-col gap-3 items-center justify-start">
                              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide w-full max-w-[240px]">Actions</h4>
                              <Button variant="outline" className="w-full max-w-[240px]" onClick={() => downloadPastSummaryPdf(appt.title, new Date(appt.date), "Dr. Justin Case")}><Download className="w-4 h-4 mr-2" />Download PDF</Button>
                              <Button variant="outline" className="w-full max-w-[240px]" onClick={() => (window.location.href = "/resources")}><MessageSquareText className="w-4 h-4 mr-2" />View E-advice</Button>
                            </div>
                          </div>

                          <div className="px-5 pb-5 bg-white">
                            <div className="grid grid-cols-1 gap-4 mt-4">
                              <div className="bg-white p-5 rounded-lg border border-border">
                                <h4 className="font-semibold text-base text-foreground mb-3">Current Condition</h4>
                                <h5 className="text-xs text-primary uppercase tracking-wide mb-3 origin-left scale-90">Right Knee Osteoarthritis</h5>
                                <p className="text-sm font-medium text-foreground leading-relaxed">
                                  You have osteoarthritis in your right knee. This means that the cartilage in the knee joint has gradually worn down over time, which can cause the bones in the joint to rub against each other. This often leads to symptoms such as pain, stiffness, swelling, and difficulty with activities like walking, standing for long periods, or climbing stairs.
                                </p>
                              </div>
                              <div className="bg-white p-5 rounded-lg border border-border">
                                <h4 className="font-semibold text-base text-foreground mb-4">Current Plan</h4>
                                <div className="space-y-2">
                                  <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg border border-border/50">
                                    <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0"><Pill className="w-6 h-6" /></div>
                                    <div><p className="text-xs text-primary uppercase tracking-wide mb-1 origin-left scale-90">Medication</p><p className="text-sm font-medium">Daily Naproxen (500mg) for joint inflammation</p></div>
                                  </div>
                                  <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg border border-border/50">
                                    <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0"><Dumbbell className="w-6 h-6" /></div>
                                    <div><p className="text-xs text-primary uppercase tracking-wide mb-1 origin-left scale-90">Lifestyle</p><p className="text-sm font-medium">Pre-habilitation strengthening exercises</p></div>
                                  </div>
                                  <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg border border-border/50">
                                    <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0"><Activity className="w-6 h-6" /></div>
                                    <div><p className="text-xs text-primary uppercase tracking-wide mb-1 origin-left scale-90">Lifestyle</p><p className="text-sm font-medium">Mobility and low-impact conditioning</p></div>
                                  </div>
                                </div>
                              </div>
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
