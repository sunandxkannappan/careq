import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Send, Loader2, CheckCircle2 } from "lucide-react";
import DynamicFormRenderer from "@/components/DynamicFormRenderer";
import { Layout } from "@/components/Layout";

const PRE_APPT_TEMPLATE = {
  "template_name": "pre-appointment-check-in",
  "title": "Pre-Appointment Check-In Form",
  "timing": "Completed by patient 24-48 hours before each scheduled appointment.",
  "sections": [
    {
      "id": "part1",
      "title": "Part 1 — Appointment Confirmation",
      "fields": [
        { "id": "appointmentDate", "label": "Upcoming appointment date", "type": "date", "required": true },
        { "id": "appointmentType", "label": "Appointment type", "type": "radio", "options": ["Virtual", "In-person"], "required": true },
        { "id": "confirmAttendance", "label": "Do you confirm you are able to attend this appointment?", "type": "radio", "options": ["Yes", "No — I need to reschedule"], "required": true },
        { "id": "interpreterRequired", "label": "Do you require an interpreter for this appointment?", "type": "radio", "options": ["No", "Yes"], "subFields": { "Yes": [{ "id": "language", "label": "Language", "type": "text" }] } },
        { "id": "caregiverJoining", "label": "Will a caregiver or support person be joining you?", "type": "radio", "options": ["No", "Yes"], "required": true }
      ]
    },
    {
      "id": "part2",
      "title": "Part 2 — Symptom Update Since Last Visit",
      "fields": [
        { "id": "jointAssessed", "label": "Joint being assessed today", "type": "radio", "options": ["Left Hip", "Right Hip", "Left Knee", "Right Knee"], "required": true },
        { "id": "symptomChange", "label": "Since your last appointment, how have your symptoms changed overall?", "type": "radio", "options": ["Significantly improved", "Slightly improved", "No change", "Slightly worse", "Significantly worse"], "required": true },
        { "id": "painRest", "label": "Current pain level at rest (0-10)", "type": "scale", "min": 0, "max": 10 },
        { "id": "painActivity", "label": "Current pain level with activity (0-10)", "type": "scale", "min": 0, "max": 10 },
        { "id": "newSymptoms", "label": "Have you had any of the following since your last appointment? (tick all that apply)", "type": "checkbox", "options": [
          "Sudden significant increase in pain", "New swelling or redness in the joint", "Joint giving way or locking", 
          "Fall related to the joint", "New difficulty walking or bearing weight", 
          "New neurological symptoms (numbness, tingling, weakness)", "Fever or chills", "None of the above"
        ]},
        { "id": "symptomDescription", "label": "If you ticked any of the above, please describe briefly", "type": "textarea" }
      ]
    },
    {
      "id": "part3",
      "title": "Part 3 — Medication & Treatment Changes",
      "fields": [
        { "id": "painMedication", "label": "Are you currently taking pain medication for this joint?", "type": "radio", "options": ["No", "Over-the-counter", "Prescription (non-opioid)", "Prescription opioid"], "required": true },
        { "id": "medEffectiveness", "label": "If taking medication, is it providing adequate pain control?", "type": "radio", "options": ["Yes", "Partial relief", "No — inadequate despite current dose"] },
        { "id": "newTreatments", "label": "Have you started any new treatments since your last visit?", "type": "radio", "options": ["No", "Yes"], "subFields": { "Yes": [{ "id": "treatmentDescription", "label": "Please describe", "type": "textarea" }] } }
      ]
    },
    {
      "id": "part4",
      "title": "Part 4 — Functional Status Update",
      "fields": [
        { "id": "dailyActivityAbility", "label": "Compared to your last appointment, your ability to perform daily activities is:", "type": "radio", "options": ["Better", "About the same", "Worse"], "required": true },
        { "id": "walkingAbility", "label": "Are you currently able to walk outside your home?", "type": "radio", "options": ["Yes, without difficulty", "Yes, with difficulty", "No, housebound"], "required": true }
      ]
    },
    {
      "id": "part5",
      "title": "Part 5 — Questions & Agenda for Today’s Appointment",
      "fields": [
        { "id": "mainConcern", "label": "What is the main thing you would like to address in today’s appointment?", "type": "textarea" },
        { "id": "specificQuestions", "label": "Do you have any specific questions for your care team today?", "type": "textarea" },
        { "id": "additionalInfo", "label": "Is there anything else you would like your care team to know before the appointment?", "type": "textarea" }
      ]
    },
    {
      "id": "part6",
      "title": "Part 6 — Technical Check-In (Virtual Appointments Only)",
      "fields": [
        { "id": "techTesting", "label": "Have you tested your device, camera, and microphone for this appointment?", "type": "radio", "options": ["Yes, everything is working", "No, I need help", "Not applicable (in-person)"], "required": true },
        { "id": "deviceType", "label": "What device will you be using?", "type": "radio", "options": ["Smartphone", "Tablet", "Laptop / Computer", "Other"], "subFields": { "Other": [{ "id": "otherDevice", "label": "Other device", "type": "text" }] } },
        { "id": "privacy", "label": "Do you have a private, quiet space available for this appointment?", "type": "radio", "options": ["Yes", "No — I may have limited privacy"] }
      ]
    }
  ]
};

export default function PreAppointmentForm() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSave = (submit = false) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (submit) setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto mt-20 text-center space-y-6 animate-in fade-in zoom-in duration-500">
           <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
             <CheckCircle2 size={40} />
           </div>
           <div className="space-y-2">
             <h1 className="text-3xl font-black text-slate-800 tracking-tight">Form Submitted!</h1>
             <p className="text-slate-500 font-medium">Your responses have been received and will be reviewed by your clinician before your appointment.</p>
           </div>
           <Button 
            onClick={() => navigate("/tasks")}
            className="bg-[#1f64ad] hover:bg-[#16508c] text-white px-8 h-12 rounded-xl font-bold transition-all shadow-md mt-4"
           >
             Return to Tasks
           </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-10 py-6 animate-in slide-in-from-bottom-4 duration-700">
        <button
          onClick={() => navigate("/tasks")}
          className="flex items-center gap-2 text-slate-400 hover:text-[#1f64ad] font-black text-[13px] transition-all group"
        >
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          BACK TO TASKS
        </button>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {PRE_APPT_TEMPLATE.title}
            </h1>
            <div className="px-3 py-1 bg-blue-50 text-[#1f64ad] rounded-full text-[11px] font-black uppercase tracking-widest border border-blue-100">
              Instrument 2
            </div>
          </div>
          <p className="text-slate-400 font-bold text-[13px] uppercase tracking-wider">{PRE_APPT_TEMPLATE.timing}</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-xl shadow-slate-200/40">
          <DynamicFormRenderer
            template={PRE_APPT_TEMPLATE as any}
            formData={formData}
            onChange={setFormData}
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-12 mt-12 border-t border-slate-50">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="h-12 px-8 rounded-xl font-black text-[13px] border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              SAVE AS DRAFT
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="h-12 px-10 rounded-xl font-black text-[13px] bg-[#1f64ad] text-white hover:bg-[#16508c] transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              SUBMIT FORM
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
