import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Send, Loader2, CheckCircle2 } from "lucide-react";
import DynamicFormRenderer from "@/components/DynamicFormRenderer";
import { Layout } from "@/components/Layout";

const CONSENT_TEMPLATE = {
  "template_name": "consent-form",
  "title": "Patient Registration & Intake Form",
  "timing": "Completed by patient at time of registration, prior to triage assessment",
  "sections": [
    {
      "id": "part1",
      "title": "Part 1 — Personal Information",
      "fields": [
        { "id": "firstName", "label": "Legal First Name", "type": "text", "required": true },
        { "id": "lastName", "label": "Legal Last Name", "type": "text", "required": true },
        { "id": "preferredName", "label": "Preferred Name (if different)", "type": "text" },
        { "id": "dob", "label": "Date of Birth", "type": "date", "required": true },
        { "id": "sexAtBirth", "label": "Sex assigned at birth", "type": "radio", "options": ["Male", "Female", "Intersex", "Prefer not to say"], "required": true },
        { "id": "genderIdentity", "label": "Gender identity", "type": "radio", "options": ["Man", "Woman", "Non-binary", "Two-spirit", "Prefer not to say", "Other"], "subFields": { "Other": [{ "id": "otherGender", "label": "Specify", "type": "text" }] } },
        { "id": "phn", "label": "Personal Health Number (PHN)", "type": "text", "required": true }
      ]
    },
    {
      "id": "part2",
      "title": "Part 2 — Contact Information",
      "fields": [
        { "id": "phoneNumber", "label": "Primary Phone Number", "type": "text", "required": true },
        { "id": "phoneType", "label": "Type", "type": "radio", "options": ["Mobile", "Home", "Work"], "required": true },
        { "id": "okToLeaveVoicemail", "label": "Is it okay to leave a detailed voicemail?", "type": "radio", "options": ["Yes", "No"], "required": true },
        { "id": "email", "label": "Email Address", "type": "email", "required": true },
        { "id": "address", "label": "Home Address", "type": "textarea", "required": true },
        { "id": "city", "label": "City/Town", "type": "text", "required": true },
        { "id": "postalCode", "label": "Postal Code", "type": "text", "required": true }
      ]
    },
    {
      "id": "part3",
      "title": "Part 3 — Agreements & Signatures",
      "fields": [
        { "id": "accuracyConfirm", "label": "I confirm that the information provided is accurate to the best of my knowledge.", "type": "checkbox", "options": ["I confirm"], "required": true },
        { "id": "emergencyAcknowledge", "label": "I understand emergency issues should not be managed through this portal.", "type": "checkbox", "options": ["I understand"], "required": true },
        { "id": "privacyPolicy", "label": "I acknowledge and agree to the CareQ Privacy Policy", "type": "checkbox", "options": ["I agree"], "required": true },
        { "id": "terms", "label": "I acknowledge and agree to the CareQ Terms of Use", "type": "checkbox", "options": ["I agree"], "required": true },
        { "id": "signature", "label": "Full Legal Name (Electronic Signature)", "type": "text", "required": true }
      ]
    }
  ]
};

export default function ConsentForm() {
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
             <h1 className="text-3xl font-black text-slate-800 tracking-tight">Registration Complete!</h1>
             <p className="text-slate-500 font-medium">Your onboarding information has been securely updated in our clinical system.</p>
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
              {CONSENT_TEMPLATE.title}
            </h1>
            <div className="px-3 py-1 bg-blue-50 text-[#1f64ad] rounded-full text-[11px] font-black uppercase tracking-widest border border-blue-100">
              Registration
            </div>
          </div>
          <p className="text-slate-400 font-bold text-[13px] uppercase tracking-wider">{CONSENT_TEMPLATE.timing}</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-xl shadow-slate-200/40">
          <DynamicFormRenderer
            template={CONSENT_TEMPLATE as any}
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
              SUBMIT REGISTRATION
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
