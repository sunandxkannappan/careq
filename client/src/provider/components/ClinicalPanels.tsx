import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  CheckCircle2,
  Save,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Eye,
  AlertCircle,
  FileText,
  User,
  Pill,
  ClipboardList,
  ScanLine,
  Stethoscope,
  Video,
  MapPin,
  X,
  Calendar,
  Star,
  Scissors,
  Languages,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldCheck,
  RefreshCw,
  Mic,
  Ban,
  Accessibility,
  PersonStanding,
  Clock,
  List,
  CalendarCheck,
  FlaskConical,
  ExternalLink,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  WifiOff,
  Footprints,
  HeartPulse,
  CornerDownRight,
} from 'lucide-react';
import DynamicFormRenderer from './DynamicFormRenderer';
import { PRE_CHARTING_TEMPLATE, DURING_APPT_TEMPLATE, PRE_VISIT_TEMPLATE } from '../lib/ChartingTemplates';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// ─── Pictorial option icon + colour maps ─────────────────────────────────────

type LucideIcon = React.ElementType;

const OPTION_ICON: Record<string, LucideIcon> = {
  // Appointment type
  "Virtual": Video,
  "In-person": MapPin,
  // Binary
  "Yes": Check,
  "No": X,
  "No changes": Check,
  "Yes - document below": FileText,
  // Joints
  "Left Hip":  ArrowDownRight,
  "Right Hip": ArrowUpRight,
  "Left Knee": ArrowDownRight,
  "Right Knee": ArrowUpRight,
  // Appt number
  "Initial": Star,
  "3-month": Calendar,
  "6-month": Calendar,
  "9-month": Calendar,
  "12-month": Calendar,
  "Pre-surgical": Scissors,
  "Other": FileText,
  // Mobility aids
  "None": Ban,
  "Single cane": Footprints,
  "Bilateral canes": Footprints,
  "Crutch(es)": Footprints,
  "Walker": PersonStanding,
  "Wheelchair": Accessibility,
  // Symptom change
  "Improved": TrendingUp,
  "Stable": Minus,
  "Worsened": TrendingDown,
  "Significantly worsened - flag for physician": AlertTriangle,
  // Red flags / falls
  "None reported": Check,
  // Check-in
  "Yes - nurse to complete verbally": Mic,
  "No - nurse to complete verbally": Mic,
  "Patient completed pre-appointment check-in?": ClipboardList,
  // Allergy
  "Confirmed unchanged": ShieldCheck,
  "Updated - new allergy": AlertCircle,
  // Opioid adequacy
  "Partial": Minus,
  "No - flag for physician": AlertTriangle,
  // Waitlist
  "Not yet listed": Clock,
  "Waitlisted": List,
  "Booked": CalendarCheck,
  // Decisions
  "Continue current management plan": RefreshCw,
  "Adjust medications": Pill,
  "Order new investigations": FlaskConical,
  "Refer to additional services": ExternalLink,
  "Re-triage / reassess waitlist status": Activity,
  "Discuss surgical readiness": Stethoscope,
};

const OPTION_COLOR: Record<string, string> = {
  "Yes": "border-green-300 bg-green-50 text-green-800",
  "No": "border-red-200 bg-red-50 text-red-700",
  "Improved": "border-green-300 bg-green-50 text-green-800",
  "Stable": "border-slate-200 bg-slate-50 text-slate-700",
  "Worsened": "border-amber-300 bg-amber-50 text-amber-800",
  "Significantly worsened - flag for physician": "border-red-300 bg-red-50 text-red-800",
  "Virtual": "border-blue-200 bg-blue-50 text-blue-800",
  "In-person": "border-violet-200 bg-violet-50 text-violet-800",
  "None": "border-slate-200 bg-slate-50 text-slate-600",
  "No - flag for physician": "border-red-200 bg-red-50 text-red-700",
};

// ─── Flatten template into individual questions ────────────────────────────

interface FlatQuestion {
  field: any;
  sectionTitle: string;
  sectionPart: string;
  isSubField?: boolean;
}

function getEffectiveQuestions(sections: any[], formData: any): FlatQuestion[] {
  const qs: FlatQuestion[] = [];
  for (const section of sections) {
    for (const field of section.fields) {
      qs.push({ field, sectionTitle: section.title, sectionPart: section.id });
      const val = formData[field.id];
      if (val && field.subFields && field.subFields[val]) {
        for (const sf of field.subFields[val]) {
          qs.push({ field: sf, sectionTitle: section.title, sectionPart: section.id, isSubField: true });
        }
      }
    }
  }
  return qs;
}

// ─── Pictorial answer option card ─────────────────────────────────────────

function OptionCard({
  option, selected, onClick, readOnly,
}: { option: string; selected: boolean; onClick: () => void; readOnly: boolean }) {
  const Icon = OPTION_ICON[option] || Check;
  const colorClass = selected
    ? "border-[#1f64ad] bg-[#1f64ad]/5 text-[#1f64ad] shadow-md"
    : (OPTION_COLOR[option] ?? "border-slate-200 bg-white text-slate-700 hover:border-[#1f64ad]/40 hover:bg-blue-50/30");

  return (
    <button
      type="button"
      onClick={() => !readOnly && onClick()}
      disabled={readOnly}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-150 text-center cursor-pointer select-none",
        "min-h-[90px]",
        colorClass,
        selected && "ring-2 ring-[#1f64ad]/20"
      )}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1f64ad] text-white flex items-center justify-center">
          <Check size={11} />
        </span>
      )}
      <Icon size={22} className={selected ? "text-[#1f64ad]" : undefined} />
      <span className="text-[12px] font-bold leading-tight">{option}</span>
    </button>
  );
}

export function PreChartPanel({ patient, meetingId, patientId: passedPatientId, readOnly = false }: any) {
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const sections = PRE_CHARTING_TEMPLATE.sections || [];

  // Flatten all questions into a single list, inserting sub-fields after their parent
  const questions = useMemo(() => getEffectiveQuestions(sections, formData), [formData, sections]);

  // Clamp step if questions list shrinks (sub-field removed)
  useEffect(() => {
    if (currentStep >= questions.length) setCurrentStep(Math.max(0, questions.length - 1));
  }, [questions.length]);

  const currentQ = questions[currentStep];
  const progress = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = async (isSubmit = false) => {
    setSaving(true);
    try {
      await new Promise(res => setTimeout(res, 500));
      setSaveMessage(isSubmit ? "Submitted!" : "Saved!");
      setTimeout(() => setSaveMessage(null), 2500);
    } catch {
      setSaveMessage("Error saving.");
      setTimeout(() => setSaveMessage(null), 2500);
    } finally {
      setSaving(false);
    }
  };

  const goNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleSave(true);
    }
  };

  const goPrev = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };

  // ── Render a single question ─────────────────────────────────────────────
  const renderQuestion = (q: FlatQuestion) => {
    const { field } = q;
    const value = formData[field.id] ?? "";

    switch (field.type) {
      case "radio": {
        const opts: string[] = field.options || [];
        const cols = opts.length <= 2 ? "grid-cols-2" : opts.length <= 4 ? "grid-cols-2 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3";
        return (
          <div className={cn("grid gap-3", cols)}>
            {opts.map((opt: string) => (
              <OptionCard
                key={opt}
                option={opt}
                selected={value === opt}
                onClick={() => handleChange(field.id, opt)}
                readOnly={readOnly}
              />
            ))}
          </div>
        );
      }

      case "checkbox": {
        const current: string[] = Array.isArray(value) ? value : [];
        const opts: string[] = field.options || [];
        const cols = opts.length <= 4 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3";
        return (
          <div className={cn("grid gap-3", cols)}>
            {opts.map((opt: string) => (
              <OptionCard
                key={opt}
                option={opt}
                selected={current.includes(opt)}
                onClick={() => {
                  const next = current.includes(opt)
                    ? current.filter((v: string) => v !== opt)
                    : [...current, opt];
                  handleChange(field.id, next);
                }}
                readOnly={readOnly}
              />
            ))}
          </div>
        );
      }

      case "scale": {
        const min = field.min ?? 0;
        const max = field.max ?? 10;
        const nums = Array.from({ length: max - min + 1 }, (_, i) => i + min);
        const scoreColor = (v: number) =>
          v <= 3 ? "bg-green-500 text-white border-green-500"
          : v <= 6 ? "bg-amber-500 text-white border-amber-500"
          : "bg-red-500 text-white border-red-500";
        const scoreLabel = (v: number) =>
          v === 0 ? "No pain" : v <= 3 ? "Mild" : v <= 6 ? "Moderate" : v <= 8 ? "Severe" : "Worst possible";

        return (
          <div className="space-y-5">
            <div className="flex items-end justify-between px-1 mb-1">
              <span className="text-[11px] text-slate-400 font-semibold">0 — No pain</span>
              <span className="text-[11px] text-slate-400 font-semibold">10 — Worst</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {nums.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => !readOnly && handleChange(field.id, v)}
                  disabled={readOnly}
                  className={cn(
                    "w-11 h-11 rounded-full border-2 font-black text-[14px] transition-all",
                    value === v
                      ? scoreColor(v) + " scale-110 shadow-lg"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            {value !== "" && (
              <p className={cn(
                "text-center text-[13px] font-bold",
                value <= 3 ? "text-green-600" : value <= 6 ? "text-amber-600" : "text-red-600"
              )}>
                {scoreLabel(value)} — {value}/10
              </p>
            )}
          </div>
        );
      }

      case "text":
      case "date":
      case "email":
        return (
          <input
            type={field.type}
            autoFocus
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            disabled={readOnly}
            placeholder={field.placeholder || "Type your answer..."}
            onKeyDown={(e) => e.key === "Enter" && goNext()}
            className="w-full max-w-lg mx-auto block bg-transparent border-0 border-b-2 border-slate-300 focus:border-[#1f64ad] outline-none text-2xl font-bold text-slate-800 placeholder:text-slate-300 py-3 transition-colors text-center"
          />
        );

      case "textarea":
        return (
          <textarea
            autoFocus
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            disabled={readOnly}
            placeholder={field.placeholder || "Type your answer..."}
            rows={4}
            className="w-full max-w-lg mx-auto block bg-slate-50 border border-slate-200 rounded-2xl outline-none text-[14px] text-slate-700 placeholder:text-slate-400 px-5 py-4 focus:border-[#1f64ad] focus:ring-2 focus:ring-[#1f64ad]/10 transition-all resize-none"
          />
        );

      default:
        return null;
    }
  };

  if (!currentQ) return null;

  return (
    <div
      className="flex flex-col h-full overflow-hidden bg-white"
      style={{ fontFamily: '"DM Sans", sans-serif' }}
    >
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-8 pt-4 pb-2 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          {patient && (
            <div>
              <p className="text-[13px] font-bold text-slate-800">{patient.name}</p>
              <p className="text-[10px] text-slate-400">PHN {patient.phn} · DOB {patient.dob}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="text-[11px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-1.5">
              <CheckCircle2 size={12} /> {saveMessage}
            </span>
          )}
          {readOnly && (
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 flex items-center gap-1.5">
              <Eye size={12} /> View Only
            </span>
          )}
          {!readOnly && (
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-[11px] font-bold transition-colors disabled:opacity-40"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Save draft
            </button>
          )}
          <span className="text-[12px] font-bold text-slate-400">{currentStep + 1} / {questions.length}</span>
        </div>
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div className="h-1 bg-slate-100 shrink-0">
        <div
          className="h-full bg-[#1f64ad] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Question area ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8 py-10">
        <div className="w-full max-w-2xl space-y-8">

          {/* Section label */}
          <div className="flex items-center gap-2">
            {currentQ.isSubField && (
              <CornerDownRight size={13} className="text-slate-400" />
            )}
            <span className="text-[10px] font-black text-[#1f64ad]/70 uppercase tracking-[0.2em]">
              {currentQ.sectionTitle.replace(/Part \d+ — /, "").replace(/ \(.*\)/, "")}
            </span>
          </div>

          {/* Question text */}
          <h2 className="text-[22px] font-black text-slate-900 leading-snug tracking-tight">
            {currentQ.field.label}
            {currentQ.field.required && <span className="text-red-400 ml-1">*</span>}
          </h2>

          {/* Answer input */}
          <div>
            {renderQuestion(currentQ)}
          </div>

          {/* Hint for text fields */}
          {(currentQ.field.type === "text" || currentQ.field.type === "date") && (
            <p className="text-[11px] text-slate-400 text-center">Press Enter to continue</p>
          )}
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 text-[13px] font-bold text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-20 group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        <div className="flex items-center gap-2">
          {/* Mini dot progress */}
          {questions.slice(Math.max(0, currentStep - 3), currentStep + 4).map((_, i) => {
            const idx = Math.max(0, currentStep - 3) + i;
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-full transition-all",
                  idx === currentStep ? "w-6 h-2 bg-[#1f64ad]" : idx < currentStep ? "w-2 h-2 bg-[#1f64ad]/40" : "w-2 h-2 bg-slate-200"
                )}
              />
            );
          })}
        </div>

        {currentStep === questions.length - 1 ? (
          !readOnly && (
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-[12px] font-black shadow-md hover:brightness-110 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              Submit
            </button>
          )
        ) : (
          <button
            onClick={goNext}
            className="flex items-center gap-2 bg-[#1f64ad] text-white px-5 py-2.5 rounded-xl text-[12px] font-black shadow-md hover:brightness-110 transition-all group"
          >
            OK
            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}

export function ChartingPanel({ patient, meetingId, patientId: passedPatientId, readOnly = false, onApprove }: any) {
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  const template = DURING_APPT_TEMPLATE;
  const sections = template.sections || [];
  const activeSection = sections[currentStep];

  const handleSave = async (isSubmit = false) => {
    if (readOnly) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      // Mock API call
      await new Promise(res => setTimeout(res, 600));
      if (isSubmit && onApprove) {
        onApprove(meetingId);
      }
      setSaveMessage(isSubmit ? "Submitted!" : "Saved!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage("Error saving.");
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
      if (!readOnly) handleSave(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] text-slate-800 bg-[#f8fafc]/50 overflow-hidden" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      {/* Header */}
      <div className="py-4 px-8 border-b border-slate-100 bg-white backdrop-blur-md flex justify-between items-start z-10 shadow-sm shrink-0">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">Encounter Charting</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.15em] whitespace-nowrap">Step {currentStep + 1} of {sections.length}</span>
            </div>
            {patient && (
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PHN:</span>
                    <span className="text-[10px] font-bold text-slate-600 tracking-tight">{patient.phn || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DOB:</span>
                    <span className="text-[10px] font-bold text-slate-600 tracking-tight">{patient.dob || "N/A"}</span>
                  </div>
               </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 py-1">
          {readOnly && (
            <span className="text-[10px] font-black text-blue-600 bg-blue-50/80 px-4 py-2 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-2 animate-in zoom-in-95 leading-none">
              <Eye size={14} /> READ-ONLY VIEW
            </span>
          )}
          {saveMessage && (
            <span className="text-[10px] font-black text-green-600 bg-green-50/80 px-3 py-1.5 rounded-full border border-green-100 shadow-sm flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 size={12} /> {saveMessage}
            </span>
          )}
          
          <div className="flex items-center gap-3">
            {!readOnly && (
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-[11px] font-black shadow-sm transition-all hover:bg-slate-50 hover:translate-y-[-0.5px] active:translate-y-[0.5px] disabled:opacity-50"
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                DRAFT
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 shrink-0">
        <div
          className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ width: `${((currentStep + 1) / sections.length) * 100}%` }}
        />
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc]/30">
        <div className="bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(31,100,173,0.05)] border border-blue-50/50 p-6 py-8 max-w-full min-h-full overflow-hidden relative transition-all hover:shadow-[0_40px_90px_rgba(31,100,173,0.08)]">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-transparent"></div>
          
          <div className="mb-10 flex items-center justify-between border-b border-slate-50 pb-8 focus-within:border-blue-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                <Activity className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">Section {currentStep + 1}</p>
                <h4 className="text-[16px] font-black text-slate-900 tracking-tight">{activeSection?.title}</h4>
              </div>
            </div>
          </div>

          <DynamicFormRenderer
            template={template}
            formData={formData}
            onChange={setFormData}
            readOnly={readOnly}
            compact={true}
            activeSectionId={activeSection?.id}
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="py-3 px-8 border-t border-slate-100 bg-white/90 backdrop-blur-md flex justify-between items-center shadow-[0_-1px_10px_rgba(0,0,0,0.02)] shrink-0">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-black text-slate-500 hover:text-slate-900 transition-all disabled:opacity-20 uppercase tracking-widest group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Previous
        </button>

        <div className="flex gap-3">
          {currentStep === sections.length - 1 ? (
            !readOnly && (
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2.5 bg-green-600 text-white px-5 py-2.5 rounded-xl text-[11px] font-black shadow-[0_10px_20px_-5px_rgba(22,163,74,0.3)] hover:brightness-110 hover:translate-y-[-1px] active:translate-y-[0px] transition-all disabled:opacity-50 tracking-widest"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              COMPLETE CHARTING
            </button>
            )
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center gap-2.5 bg-[#1f64ad] text-white px-7 py-2.5 rounded-xl text-[12px] font-black shadow-[0_10px_20px_-5px_rgba(31,100,173,0.3)] hover:brightness-110 hover:translate-y-[-1px] active:translate-y-[0px] transition-all group"
            >
              CONTINUE
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EAdvicePanel({ patient, meetingId, readOnly = false }: any) {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden text-slate-800 bg-[#f8fafc]/50 p-8 justify-center items-center">
        <div className="bg-white rounded-[2rem] border border-blue-50 shadow-sm p-12 text-center max-w-lg">
           <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
             <FileText className="text-blue-500 w-8 h-8" />
           </div>
           <h3 className="text-xl font-extrabold text-slate-900 mb-2">E-Advice Panel Mock</h3>
           <p className="text-slate-500 text-[13px] leading-relaxed">
             This panel has been strictly stubbed since the E-Advice form schema was not provided in the 029 SQL script.
           </p>
        </div>
    </div>
  )
}

export function PatientFormPanel({ patient, meetingId, readOnly = false }: any) {
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const template = PRE_VISIT_TEMPLATE;

  const handleSave = async () => {
    if (readOnly) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      await new Promise(res => setTimeout(res, 600));
      setSaveMessage("Saved successfully!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage("Failed to save.");
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 overflow-y-auto h-full text-slate-800 bg-[#f8fafc]/50" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
            Patient Pre-Visit Form
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">Reviewing patient-submitted check-in data</p>
        </div>
        <div>
          {saveMessage && (
            <span className="text-[10px] font-black text-green-600 bg-white px-3 py-1.5 rounded-full border border-green-100 shadow-sm flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 size={12} /> {saveMessage}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 italic font-black text-blue-600">
            P
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">{patient?.name || "Patient"}</h4>
            <p className="text-[10px] text-slate-400 font-medium">Form ID: {meetingId || "N/A"}</p>
          </div>
        </div>

        <DynamicFormRenderer
          template={template}
          formData={formData}
          onChange={setFormData}
          readOnly={readOnly}
          compact={true}
        />
      </div>

      {!readOnly && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#1f64ad] text-white px-4 py-2 rounded-xl text-[11px] font-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            SAVE UPDATES
          </button>
        </div>
      )}
    </div>
  );
}
