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
import { Calendar, MapPin, Phone, Clock, Video as VideoIcon, CheckCircle2, X, LifeBuoy, ChevronDown, Download, MessageSquareText, Pill, Dumbbell, Activity, AlertCircle, Lock } from "lucide-react";
import { format, isPast, addMonths } from "date-fns";
import dayjs from "dayjs";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

// --- Premium Card Components ---

const BRAND = '#1f64ad';

const MilestoneCard = ({ title, status, details = { date: 'TBD', time: 'TBD' }, onBook, isAvailable = true }: any) => {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  return (
    <div className={cn(
      "rounded-[24px] border transition-all duration-300 flex flex-col overflow-hidden mb-4",
      isActive ? 'bg-white border-blue-100 shadow-lg shadow-blue-50/50' : 'bg-slate-50/50 border-slate-100'
    )}>
      <div className="px-8 py-6 flex items-center justify-between bg-white border-b border-slate-50">
        <div>
          <h3 className="text-[17px] font-black text-slate-800 tracking-tight">{title}</h3>
          <p className="text-[12px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
            {isActive ? 'Schedule To Continue' : (isCompleted ? 'Completed' : 'Locked')}
          </p>
        </div>
        
        <div className={cn(
          "px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest",
          isActive ? 'bg-[#1f64ad] text-white shadow-md shadow-blue-100' : 'bg-slate-300 text-white'
        )}>
          {isActive ? 'Active' : (isCompleted ? 'Completed' : 'Locked')}
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Details</p>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-slate-100/50 text-slate-400">
                <Calendar size={18} strokeWidth={2.5}/>
              </div>
              <span className="text-[14px] font-bold text-slate-600">{details.date}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-slate-100/50 text-slate-400">
                <Clock size={18} strokeWidth={2.5}/>
              </div>
              <span className="text-[14px] font-bold text-slate-600">{details.time}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <Button 
            onClick={onBook}
            disabled={!isActive}
            className={cn(
              "w-full h-12 rounded-xl flex items-center justify-center gap-2 font-black text-[13px] transition-all",
              isActive 
                ? "bg-[#1f64ad] text-white hover:bg-[#1a5592] shadow-sm shadow-blue-100 active:scale-[0.98]" 
                : "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
            )}
          >
            {isActive ? <Calendar size={16} /> : <Lock size={16} />}
            {isActive ? 'Book Appointment' : 'Locked'}
          </Button>
        </div>
      </div>
    </div>
  );
};


const MeetingCard = ({ meeting, onJoin, onCancel, index }: any) => {
  const isPrimary = index === 0;

  if (isPrimary) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-4 overflow-hidden">
        <div className="px-5 py-4 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between">
          <h3 className="text-[14px] font-black text-[#1f64ad] uppercase tracking-tight">
            {meeting.title || 'Appointment'}
          </h3>
        </div>
        <div className="flex flex-col lg:flex-row gap-0">
          <div className="flex-1 px-5 py-4">
            <div className="mb-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Care Team</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[#1f64ad] text-white text-[10px]">DR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800">{meeting.doctorName || 'Dr. Justin Case'}</p>
                    <p className="text-[10px] text-slate-400 italic">Physician</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-slate-500 text-white text-[10px]">RN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800">Anita Cast</p>
                    <p className="text-[10px] text-slate-400 italic">Nurse</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Calendar size={13} className="text-[#1f64ad]" />
                <span className="text-[13px] font-medium">{format(new Date(meeting.date), "EEE, MMM do")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Clock size={13} className="text-[#1f64ad]" />
                <span className="text-[13px] font-medium">{format(new Date(meeting.date), "h:mm a")}</span>
              </div>
            </div>
          </div>
          <div className="px-5 py-5 w-full lg:w-48 flex flex-col gap-2 self-center">
            <Button 
              onClick={() => onJoin(meeting)}
              className="bg-[#1f64ad] hover:bg-[#1a5592] font-bold rounded-xl h-11"
            >
              <VideoIcon size={14} className="mr-2" /> Join
            </Button>
            <Button variant="outline" className="rounded-xl font-bold h-10 border-slate-200">
              Reschedule
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onCancel(meeting.id)}
              className="text-slate-500 hover:text-red-600 font-bold"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-3 flex items-center justify-between px-5 py-4 hover:shadow-md transition-shadow">
      <div>
        <span className="text-sm font-bold text-slate-800 block">{meeting.title}</span>
        <span className="text-[10px] text-slate-400"><b>Dr:</b> {meeting.doctorName}</span>
      </div>
      <div className="flex items-center gap-3">
        <Badge className="bg-blue-50 text-[#1f64ad] border-blue-100 font-bold text-[10px] rounded-md px-2 py-0.5">
          UPCOMING
        </Badge>
        <Button 
          size="sm" 
          onClick={() => onJoin(meeting)}
          className="bg-[#1f64ad] hover:bg-[#1a5592] h-9 px-4 rounded-lg font-bold"
        >
          Join
        </Button>
      </div>
    </div>
  );
};


export default function Appointments() {
  const { data: appointments, isLoading } = useAppointments();
  const createMutation = useCreateAppointment();

  const [activeTab, setActiveTab] = useState("milestones");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [overlay, setOverlay] = useState<"zoom" | "phone" | "help" | null>(null);

  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    time: "",
    type: "In-Person"
  });

  const upcoming = useMemo(() => 
    appointments?.filter(a => !isPast(new Date(a.date)) && a.status !== 'Completed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [],
  [appointments]);

  const past = useMemo(() => 
    appointments?.filter(a => isPast(new Date(a.date)) || a.status === 'Completed')
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [],
  [appointments]);

  // --- Dynamic Milestone Logic ---
  const milestones = useMemo(() => {
    const baseMonths = [0, 3, 6, 9];
    const visibleMonthsSet = new Set(baseMonths);

    const getMonthFromTitle = (title: string) => {
      if (title.includes("Initial")) return 0;
      const match = title.match(/^(\d+)\s+Month/i);
      return match ? parseInt(match[1]) : null;
    };

    appointments?.forEach(appt => {
      const m = getMonthFromTitle(appt.title);
      if (m !== null && (appt.status === 'Scheduled' || appt.status === 'Completed' || appt.status === 'Booked')) {
        visibleMonthsSet.add(m + 12);
      }
    });

    const initialAppt = appointments?.find(a => a.title.includes("Initial"));
    const baseDate = initialAppt ? new Date(initialAppt.date) : new Date();

    return Array.from(visibleMonthsSet).sort((a, b) => a - b).map(m => {
      const title = m === 0 ? "Initial Appointment" : `${m} Month Appointment`;
      const appt = appointments?.find(a => getMonthFromTitle(a.title) === m);
      
      const status = appt?.status === 'Completed' ? 'completed' : 
                     (appt && !isPast(new Date(appt.date))) ? 'active' : 'available';

      return {
        title,
        months: m,
        status,
        targetDate: addMonths(baseDate, m),
        apptId: appt?.id,
        details: appt ? {
          date: format(new Date(appt.date), "MMMM d, yyyy"),
          time: format(new Date(appt.date), "h:mm a")
        } : { date: 'TBD', time: 'TBD' }
      };
    });
  }, [appointments]);

  const handleCreate = () => {
    if (!formData.reason || !formData.date || !formData.time) return;
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    createMutation.mutate({
      title: formData.reason,
      doctorName: "Dr. Justin Case",
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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              Appointments
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Review your care journey and scheduled sessions</p>
          </div>
          <Button 
            onClick={() => {
              setFormData({...formData, reason: "Emergency Appointment"});
              setIsCreateOpen(true);
            }}
            size="sm"
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg h-10 px-4 text-[12px] font-black shadow-sm transition-all"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </header>
        {/* Advanced Slot Booking Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-[850px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
            <div className="bg-white">
              <div className="p-8 border-b border-slate-50 flex items-center gap-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border-slate-200 text-[#1f64ad] font-bold px-4 h-10 flex items-center gap-2 group hover:bg-blue-50/50"
                >
                  <span className="transition-transform group-hover:-translate-x-1">←</span> Back
                </Button>
                <div>
                  <h2 className="text-[22px] font-black text-slate-800 tracking-tight">Book {formData.reason || 'Appointment'}</h2>
                  <p className="text-[14px] text-slate-400 font-bold mt-0.5">Select a date and time for your consultation.</p>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Date Selection */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[13px] font-black uppercase tracking-widest text-slate-800">Select Date</Label>
                    <div className="relative group">
                      <Input 
                        type="date" 
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        className="h-14 rounded-xl border-slate-200 font-bold text-slate-700 bg-slate-50/30 focus:bg-white transition-all pr-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Time Slots */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-[13px] font-black uppercase tracking-widest text-slate-800">
                      Available Time Slots {formData.date && `(${format(new Date(formData.date), 'MMM d')})`}
                    </Label>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["12:40 PM", "12:50 PM", "1:00 PM", "1:10 PM", "1:20 PM", "1:30 PM", "1:40 PM", "1:50 PM", "2:00 PM", "2:10 PM", "2:20 PM", "2:30 PM", "2:40 PM", "2:50 PM", "3:00 PM", "3:10 PM"].map((time, i) => (
                      <button
                        key={i}
                        onClick={() => setFormData({...formData, time: time.split(' ')[0]})}
                        className={cn(
                          "py-4 px-2 rounded-xl border text-[11px] font-bold transition-all text-center flex flex-col items-center justify-center gap-1",
                          formData.time === time.split(' ')[0]
                            ? "bg-white border-[#1f64ad] text-[#1f64ad] shadow-lg shadow-blue-50 ring-1 ring-[#1f64ad]/20"
                            : "bg-slate-50/50 border-slate-100/50 text-slate-300 hover:border-slate-200 hover:bg-white hover:text-slate-500"
                        )}
                      >
                        <span className="text-[13px] font-black">{time} -</span>
                        <span>{dayjs(`2000-01-01 ${time}`).add(40, 'minute').format('h:mm A')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 bg-slate-50/20 flex justify-end items-center gap-4 border-t border-slate-100">
                <Button 
                  onClick={handleCreate} 
                  disabled={createMutation.isPending || !formData.date || !formData.time} 
                  className="bg-[#1f64ad] hover:bg-[#1a5592] text-white px-8 h-12 rounded-xl font-black text-[13px] shadow-sm active:scale-[0.98] transition-all"
                >
                  {createMutation.isPending ? "Booking..." : "Confirm & Book Appointment"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>


        <Dialog open={overlay !== null} onOpenChange={(open) => !open && setOverlay(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto rounded-3xl">
            {overlay === "zoom" && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Join Your Video Visit</DialogTitle>
                  <DialogDescription className="font-medium">
                    Your appointment is ready to begin. Please make sure your camera, microphone, and internet connection are working before joining.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-3">
                    <p className="font-bold text-slate-800">Step 1 - Check Your Setup</p>
                    <ul className="list-disc list-inside text-slate-500 font-medium space-y-1">
                      <li>Your camera is on</li>
                      <li>Your microphone is working</li>
                      <li>Your internet connection is stable</li>
                    </ul>
                    <Button variant="outline" className="rounded-xl font-bold">Test Camera &amp; Microphone</Button>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <p className="font-bold text-slate-800">Step 2 - Join Your Appointment</p>
                    <p className="text-slate-500 font-medium">When you are ready, click the button below to join the video visit.</p>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-black h-12 rounded-xl shadow-lg shadow-emerald-50">Join Video Visit</Button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                    <Button variant="outline" className="flex-1 rounded-xl font-bold" onClick={() => setOverlay("phone")}>Switch to Phone Call</Button>
                    <Button variant="outline" className="flex-1 rounded-xl font-bold" onClick={() => setOverlay("help")}>Get Technical Help</Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8">
            <TabsList className="inline-flex bg-slate-100 rounded-xl p-1 gap-1 h-11 border-none">
              <TabsTrigger value="milestones" className="px-6 py-1.5 rounded-lg text-[13px] font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-800 text-slate-500">
                Book Appointment
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="px-6 py-1.5 rounded-lg text-[13px] font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-800 text-slate-500">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="past" className="px-6 py-1.5 rounded-lg text-[13px] font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-800 text-slate-500">
                Past Appointments
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="milestones" className="animate-in fade-in-50 duration-300 outline-none">
            <div className="grid gap-2">
              {milestones.map((m, idx) => (
                <MilestoneCard 
                  key={idx}
                  {...m}
                  onBook={() => {
                    setFormData({...formData, reason: m.title});
                    setIsCreateOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="animate-in fade-in-50 duration-300 outline-none">
            {upcoming.length > 0 ? (
              <div className="space-y-4">
                {upcoming.map((appt, idx) => (
                  <MeetingCard 
                    key={appt.id} 
                    meeting={appt} 
                    index={idx}
                    onJoin={() => setOverlay("zoom")}
                    onCancel={(id: string) => alert("Cancelling " + id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">No Upcoming Appointments</p>
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveTab("milestones")}
                  className="text-[#1f64ad] font-bold text-sm mt-1 hover:bg-blue-50"
                >
                  Book a milestone appointment
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6 animate-in fade-in-50 duration-300 outline-none">
            <div className="grid gap-3">
              {past.map(appt => (
                <Collapsible key={appt.id}>
                  <Card className="border border-border/60 shadow-sm bg-white rounded-xl overflow-hidden">
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
                                <AvatarFallback className="rounded-lg">DR</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-foreground text-sm">Dr. Justin Case</p>
                                <p className="text-sm text-muted-foreground">Physician</p>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm text-slate-600">
                              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /><span>{format(new Date(appt.date), "MMMM d, yyyy")}</span></div>
                              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /><span>{format(new Date(appt.date), "h:mm a")}</span></div>
                            </div>
                          </div>
                          <div className="p-5 space-y-3">
                              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Actions</h4>
                              <Button variant="outline" className="w-full rounded-xl font-bold" onClick={() => downloadPastSummaryPdf(appt.title, new Date(appt.date), "Dr. Justin Case")}><Download className="w-4 h-4 mr-2" />Download PDF</Button>
                          </div>
                          <div className="p-5 bg-slate-50/30">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Visit Note</p>
                            <p className="text-[13px] text-slate-600 line-clamp-3">Clinical summary preserved from visit record...</p>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
