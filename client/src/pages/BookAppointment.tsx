import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
];

const appointmentTypes = [
  { label: "Video Call (Zoom)", value: "video", icon: "📹" },
  { label: "In-Person", value: "in-person", icon: "🏥" },
  { label: "Phone Call", value: "phone", icon: "📞" },
];

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const { toast } = useToast();

  const today = startOfDay(new Date());
  const minDate = addDays(today, 3);

  const handleBook = () => {
    if (!selectedDate || !selectedTime || !selectedType) return;
    setBooked(true);
    toast({
      title: "Appointment Requested",
      description: `Your appointment on ${format(selectedDate, "MMMM d, yyyy")} at ${selectedTime} has been submitted for review.`,
    });
  };

  if (booked) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-8">
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CalendarDays className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold font-display text-foreground">Appointment Requested</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your appointment on <span className="font-semibold text-foreground">{format(selectedDate!, "MMMM d, yyyy")}</span> at <span className="font-semibold text-foreground">{selectedTime}</span> has been submitted. You will receive a confirmation soon.
              </p>
              <div className="pt-4">
                <Link href="/tasks">
                  <Button variant="outline" className="gap-2" asChild>
                    <span><ArrowLeft className="w-4 h-4" /> Back to Tasks</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/tasks" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-4" data-testid="link-back-tasks">
            <ArrowLeft className="w-4 h-4" /> Back to Tasks
          </Link>
          <h1 className="text-3xl font-bold font-display text-foreground" data-testid="text-page-title">Book Appointment</h1>
          <p className="text-muted-foreground mt-1">Select a date, time, and appointment type to schedule your visit.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                Select a Date
              </CardTitle>
              <CardDescription>Choose an available date for your appointment.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => { setSelectedDate(date); setSelectedTime(null); }}
                disabled={(date) => isBefore(date, minDate) || date.getDay() === 0 || date.getDay() === 6}
                className="rounded-md border"
                data-testid="calendar-date-picker"
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            {selectedDate && (
              <Card className="border-none shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Select a Time
                  </CardTitle>
                  <CardDescription>Available times for {format(selectedDate, "MMMM d, yyyy")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className={cn("w-full", selectedTime === time && "shadow-md")}
                        onClick={() => setSelectedTime(time)}
                        data-testid={`button-time-${time.replace(/\s/g, '-').toLowerCase()}`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedTime && (
              <Card className="border-none shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Appointment Type
                  </CardTitle>
                  <CardDescription>How would you like to attend?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointmentTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedType(type.value)}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                          selectedType === type.value
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/30 hover:bg-muted/30"
                        )}
                        data-testid={`button-type-${type.value}`}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className="font-medium text-foreground">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedDate && selectedTime && selectedType && (
              <Card className="border-none shadow-lg bg-white border-primary/20">
                <CardContent className="pt-6">
                  <div className="space-y-3 mb-6">
                    <h3 className="font-semibold text-foreground">Appointment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <span>{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{selectedTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{appointmentTypes.find(t => t.value === selectedType)?.label}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full shadow-md" onClick={handleBook} data-testid="button-confirm-booking">
                    Request Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
