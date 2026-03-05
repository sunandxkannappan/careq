import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useUpdateTask, useTasks } from "@/hooks/use-data";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const medicalConditions = [
  "Diabetes",
  "High Blood Pressure",
  "Heart Disease",
  "Asthma / COPD",
  "Arthritis",
  "Thyroid Disorder",
  "Kidney Disease",
  "Liver Disease",
  "Cancer",
  "Stroke",
  "Seizures / Epilepsy",
  "Blood Clotting Disorder",
];

const surgeryHistory = [
  "Hip Replacement",
  "Knee Replacement",
  "Heart Surgery",
  "Appendectomy",
  "Gallbladder Removal",
  "Hernia Repair",
  "Spinal Surgery",
  "Other Orthopedic Surgery",
];

export default function HealthHistoryForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { data: tasks } = useTasks();
  const updateTask = useUpdateTask();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    sex: "",
    healthCardNumber: "",
    phone: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    height: "",
    weight: "",
    bloodType: "",
    selectedConditions: [] as string[],
    conditionsOther: "",
    selectedSurgeries: [] as string[],
    surgeriesOther: "",
    currentMedications: "",
    allergies: "",
    smokingStatus: "",
    alcoholUse: "",
    exerciseFrequency: "",
    familyHistory: "",
    additionalNotes: "",
  });

  const toggleCondition = (condition: string) => {
    setForm(prev => ({
      ...prev,
      selectedConditions: prev.selectedConditions.includes(condition)
        ? prev.selectedConditions.filter(c => c !== condition)
        : [...prev.selectedConditions, condition],
    }));
  };

  const toggleSurgery = (surgery: string) => {
    setForm(prev => ({
      ...prev,
      selectedSurgeries: prev.selectedSurgeries.includes(surgery)
        ? prev.selectedSurgeries.filter(s => s !== surgery)
        : [...prev.selectedSurgeries, surgery],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.dateOfBirth) {
      toast({
        title: "Missing required fields",
        description: "Please fill in your name and date of birth.",
        variant: "destructive",
      });
      return;
    }
    const healthHistoryTask = tasks?.find(t => t.actionUrl === "/forms/health-history");
    if (healthHistoryTask) {
      updateTask.mutate({ id: healthHistoryTask.id, status: "Completed" });
    }
    setSubmitted(true);
    toast({
      title: "Form submitted",
      description: "Your health history form has been submitted successfully.",
    });
  };

  if (submitted) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-3">Form Submitted</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Your health history form has been received. Your care team will review it before your next appointment.
          </p>
          <Button onClick={() => navigate("/tasks")} className="gap-2" data-testid="button-back-to-tasks">
            <ArrowLeft className="w-4 h-4" /> Back to Tasks
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6 pt-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/tasks")} className="gap-1" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>

        <h1 className="font-display text-3xl font-bold mb-2" data-testid="text-form-title">Health History Form</h1>
        <p className="text-muted-foreground mb-8">Please complete this form as accurately as possible. Fields marked with * are required.</p>

        <form onSubmit={handleSubmit} className="space-y-8">

          <Card className="border-none shadow-md bg-white rounded-xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} data-testid="input-first-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} data-testid="input-last-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input id="dob" type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} data-testid="input-dob" />
                </div>
                <div className="space-y-2">
                  <Label>Sex</Label>
                  <Select value={form.sex} onValueChange={val => setForm({...form, sex: val})}>
                    <SelectTrigger data-testid="select-sex">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="healthCard">Health Card Number</Label>
                  <Input id="healthCard" value={form.healthCardNumber} onChange={e => setForm({...form, healthCardNumber: e.target.value})} placeholder="e.g. 1234-567-890" data-testid="input-health-card" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="e.g. (555) 123-4567" data-testid="input-phone" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white rounded-xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ecName">Full Name</Label>
                  <Input id="ecName" value={form.emergencyContactName} onChange={e => setForm({...form, emergencyContactName: e.target.value})} data-testid="input-ec-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ecPhone">Phone</Label>
                  <Input id="ecPhone" type="tel" value={form.emergencyContactPhone} onChange={e => setForm({...form, emergencyContactPhone: e.target.value})} data-testid="input-ec-phone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ecRelation">Relationship</Label>
                  <Input id="ecRelation" value={form.emergencyContactRelation} onChange={e => setForm({...form, emergencyContactRelation: e.target.value})} placeholder="e.g. Spouse, Parent" data-testid="input-ec-relation" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white rounded-xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Physical Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" value={form.height} onChange={e => setForm({...form, height: e.target.value})} placeholder="e.g. 175" data-testid="input-height" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} placeholder="e.g. 80" data-testid="input-weight" />
                </div>
                <div className="space-y-2">
                  <Label>Blood Type</Label>
                  <Select value={form.bloodType} onValueChange={val => setForm({...form, bloodType: val})}>
                    <SelectTrigger data-testid="select-blood-type">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a-pos">A+</SelectItem>
                      <SelectItem value="a-neg">A-</SelectItem>
                      <SelectItem value="b-pos">B+</SelectItem>
                      <SelectItem value="b-neg">B-</SelectItem>
                      <SelectItem value="ab-pos">AB+</SelectItem>
                      <SelectItem value="ab-neg">AB-</SelectItem>
                      <SelectItem value="o-pos">O+</SelectItem>
                      <SelectItem value="o-neg">O-</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white rounded-xl">
            <CardContent className="p-6 space-y-5">
              <h2 className="font-display font-bold text-lg text-foreground">Medical Conditions</h2>
              <p className="text-sm text-muted-foreground">Check any conditions that apply to you currently or in the past.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {medicalConditions.map(condition => (
                  <label key={condition} className={cn(
                    "flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm",
                    form.selectedConditions.includes(condition) 
                      ? "border-primary/30 bg-primary/5 text-foreground" 
                      : "border-border hover:bg-muted/50 text-foreground"
                  )}>
                    <Checkbox
                      checked={form.selectedConditions.includes(condition)}
                      onCheckedChange={() => toggleCondition(condition)}
                      data-testid={`checkbox-condition-${condition.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    {condition}
                  </label>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="conditionsOther">Other conditions</Label>
                <Input id="conditionsOther" value={form.conditionsOther} onChange={e => setForm({...form, conditionsOther: e.target.value})} placeholder="List any other conditions not shown above" data-testid="input-conditions-other" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white rounded-xl">
            <CardContent className="p-6 space-y-5">
              <h2 className="font-display font-bold text-lg text-foreground">Surgical History</h2>
              <p className="text-sm text-muted-foreground">Check any surgeries you have had in the past.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {surgeryHistory.map(surgery => (
                  <label key={surgery} className={cn(
                    "flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm",
                    form.selectedSurgeries.includes(surgery) 
                      ? "border-primary/30 bg-primary/5 text-foreground" 
                      : "border-border hover:bg-muted/50 text-foreground"
                  )}>
                    <Checkbox
                      checked={form.selectedSurgeries.includes(surgery)}
                      onCheckedChange={() => toggleSurgery(surgery)}
                      data-testid={`checkbox-surgery-${surgery.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    {surgery}
                  </label>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="surgeriesOther">Other surgeries</Label>
                <Input id="surgeriesOther" value={form.surgeriesOther} onChange={e => setForm({...form, surgeriesOther: e.target.value})} placeholder="List any other surgeries not shown above" data-testid="input-surgeries-other" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white rounded-xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Medications & Allergies</h2>
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea id="medications" value={form.currentMedications} onChange={e => setForm({...form, currentMedications: e.target.value})} placeholder="List all current medications including dosage (e.g. Aspirin 81mg daily)" rows={3} data-testid="input-medications" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea id="allergies" value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} placeholder="List any known allergies to medications, foods, or materials (e.g. Penicillin, Latex)" rows={3} data-testid="input-allergies" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white rounded-xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Lifestyle</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Smoking Status</Label>
                  <Select value={form.smokingStatus} onValueChange={val => setForm({...form, smokingStatus: val})}>
                    <SelectTrigger data-testid="select-smoking">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never Smoked</SelectItem>
                      <SelectItem value="former">Former Smoker</SelectItem>
                      <SelectItem value="current">Current Smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Alcohol Use</Label>
                  <Select value={form.alcoholUse} onValueChange={val => setForm({...form, alcoholUse: val})}>
                    <SelectTrigger data-testid="select-alcohol">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="occasional">Occasional</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Exercise Frequency</Label>
                  <Select value={form.exerciseFrequency} onValueChange={val => setForm({...form, exerciseFrequency: val})}>
                    <SelectTrigger data-testid="select-exercise">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="light">Light (1-2x/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-4x/week)</SelectItem>
                      <SelectItem value="active">Active (5+/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white rounded-xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Family History</h2>
              <div className="space-y-2">
                <Label htmlFor="familyHistory">Relevant Family Medical History</Label>
                <Textarea id="familyHistory" value={form.familyHistory} onChange={e => setForm({...form, familyHistory: e.target.value})} placeholder="List any significant medical conditions in your immediate family (parents, siblings)" rows={3} data-testid="input-family-history" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white rounded-xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Additional Notes</h2>
              <div className="space-y-2">
                <Label htmlFor="notes">Anything else your care team should know?</Label>
                <Textarea id="notes" value={form.additionalNotes} onChange={e => setForm({...form, additionalNotes: e.target.value})} placeholder="Any additional information, concerns, or questions for your care team" rows={4} data-testid="input-additional-notes" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pb-8">
            <Button type="button" variant="outline" onClick={() => navigate("/tasks")} data-testid="button-cancel-form">
              Cancel
            </Button>
            <Button type="submit" className="gap-2 px-8" data-testid="button-submit-form">
              <CheckCircle2 className="w-4 h-4" /> Submit Form
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
