import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import DynamicFormRenderer from './DynamicFormRenderer';
import { PRE_CHARTING_TEMPLATE, DURING_APPT_TEMPLATE, PRE_VISIT_TEMPLATE } from '../lib/ChartingTemplates';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const SECTION_ICONS: Record<string, React.ElementType> = {
  part1: User,
  part2: Activity,
  part3: Pill,
  part4: ClipboardList,
  part5: ScanLine,
  part6: Stethoscope,
};

export function PreChartPanel({ patient, meetingId, patientId: passedPatientId, readOnly = false }: any) {
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const template = PRE_CHARTING_TEMPLATE;
  const sections = template.sections || [];
  const activeSection = sections[currentStep];
  const SectionIcon = SECTION_ICONS[activeSection?.id] || Activity;

  const handleSave = async (isSubmit = false) => {
    setSaving(true);
    setSaveMessage(null);
    try {
      await new Promise(res => setTimeout(res, 600));
      setSaveMessage(isSubmit ? "Submitted!" : "Saved!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch {
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

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="py-4 px-8 border-b border-slate-100 bg-white flex justify-between items-center shrink-0 shadow-sm">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">Pre-Chart Review</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.15em]">
                Step {currentStep + 1} of {sections.length}
              </span>
            </div>
            {patient && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PHN:</span>
                  <span className="text-[10px] font-bold text-slate-600">{patient?.phn || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DOB:</span>
                  <span className="text-[10px] font-bold text-slate-600">{patient?.dob || "N/A"}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {readOnly && (
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-2xl border border-blue-100 flex items-center gap-1.5">
              <Eye size={12} /> READ-ONLY
            </span>
          )}
          {saveMessage && (
            <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 size={12} /> {saveMessage}
            </span>
          )}
          {!readOnly && (
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-[11px] font-black shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              DRAFT
            </button>
          )}
        </div>
      </div>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      <div className="w-full bg-slate-100 h-1.5 shrink-0">
        <div
          className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ width: `${((currentStep + 1) / sections.length) * 100}%` }}
        />
      </div>

      {/* ── Step dots ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 py-3 bg-white border-b border-slate-100 shrink-0">
        {sections.map((s: any, i: number) => {
          const Icon = SECTION_ICONS[s.id] || Activity;
          return (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              title={s.title}
              className={cn(
                "flex items-center justify-center rounded-full transition-all",
                i === currentStep
                  ? "w-8 h-8 bg-[#1f64ad] text-white shadow-md"
                  : i < currentStep
                  ? "w-7 h-7 bg-blue-100 text-blue-600"
                  : "w-7 h-7 bg-slate-100 text-slate-400"
              )}
            >
              {i < currentStep ? <Check size={12} /> : <Icon size={13} />}
            </button>
          );
        })}
      </div>

      {/* ── Section content ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#f8fafc]/30">
        <div className="bg-white rounded-2xl shadow-sm border border-blue-50/60 px-7 py-6 max-w-3xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-blue-300/10 to-transparent" />

          {/* Section header */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <SectionIcon className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Section {currentStep + 1}</p>
              <h4 className="text-[15px] font-black text-slate-900 tracking-tight">{activeSection?.title}</h4>
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

      {/* ── Navigation footer ───────────────────────────────────────────── */}
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
                className="flex items-center gap-2.5 bg-green-600 text-white px-6 py-2.5 rounded-xl text-[11px] font-black shadow-[0_10px_20px_-5px_rgba(22,163,74,0.3)] hover:brightness-110 hover:translate-y-[-1px] active:translate-y-[0px] transition-all disabled:opacity-50 tracking-widest"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                SUBMIT PRE-CHART
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
