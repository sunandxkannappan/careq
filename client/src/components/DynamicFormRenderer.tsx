import React from "react";
import { cn } from "@/lib/utils";

interface Field {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  min?: number;
  max?: number;
  subFields?: Record<string, Field[]>;
}

interface Section {
  id: string;
  title: string;
  fields: Field[];
}

interface Template {
  title: string;
  sections: Section[];
}

interface DynamicFormRendererProps {
  template: Template;
  formData: any;
  onChange: (data: any) => void;
  readOnly?: boolean;
  isSubmitted?: boolean;
  /** When set, only this section is rendered (stepped wizard mode) */
  activeSectionId?: string;
  /** Compact visual mode: inline pills, grid inputs, tighter spacing */
  compact?: boolean;
}

// ─── Group consecutive text/date fields so they render in a grid ──────────────
function groupFields(fields: Field[]): Field[][] {
  const groups: Field[][] = [];
  let textRun: Field[] = [];
  for (const field of fields) {
    if (field.type === "text" || field.type === "date" || field.type === "email") {
      textRun.push(field);
    } else {
      if (textRun.length) { groups.push([...textRun]); textRun = []; }
      groups.push([field]);
    }
  }
  if (textRun.length) groups.push(textRun);
  return groups;
}

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  template,
  formData,
  onChange,
  readOnly = false,
  isSubmitted = false,
  activeSectionId,
  compact = false,
}) => {
  if (!template || !template.sections) return null;

  const isFieldReadOnly = isSubmitted || readOnly;

  const handleChange = (fieldId: string, value: any) => {
    if (isFieldReadOnly) return;
    onChange({ ...formData, [fieldId]: value });
  };

  const renderField = (field: Field) => {
    const value = formData[field.id] ?? "";

    switch (field.type) {
      case "text":
      case "date":
      case "email":
        return (
          <input
            type={field.type}
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            disabled={isFieldReadOnly}
            placeholder={field.placeholder || ""}
            className={cn(
              "w-full bg-slate-50/60 border border-slate-200 rounded-xl outline-none text-[13px] transition-all",
              "focus:ring-2 focus:ring-[#1f64ad]/10 focus:border-[#1f64ad] focus:bg-white hover:bg-slate-100/50",
              compact ? "px-3 py-2" : "px-4 py-3"
            )}
          />
        );

      case "textarea":
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            disabled={isFieldReadOnly}
            placeholder={field.placeholder || field.label}
            className={cn(
              "w-full bg-slate-50/60 border border-slate-200 rounded-xl outline-none text-[13px] transition-all resize-none",
              "focus:ring-2 focus:ring-[#1f64ad]/10 focus:border-[#1f64ad] focus:bg-white hover:bg-slate-100/50",
              compact ? "px-3 py-2 min-h-[80px]" : "px-4 py-3 min-h-[100px]"
            )}
          />
        );

      case "radio":
        if (compact) {
          // Inline pill buttons in compact mode
          return (
            <div className="flex flex-wrap gap-2 pt-1">
              {field.options?.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => !isFieldReadOnly && handleChange(field.id, option)}
                  disabled={isFieldReadOnly}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all",
                    value === option
                      ? "bg-[#1f64ad] text-white border-[#1f64ad] shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-[#1f64ad]/50 hover:text-slate-900"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          );
        }
        // Default full-width rows
        return (
          <div className="space-y-3 pt-1">
            {field.options?.map((option) => (
              <label
                key={option}
                className={cn(
                  "flex items-center gap-3 cursor-pointer bg-slate-50/50 hover:bg-slate-100/80 px-4 py-3 rounded-xl border border-slate-100 transition-all",
                  value === option && "border-[#1f64ad] bg-white ring-2 ring-[#1f64ad]/5"
                )}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={() => handleChange(field.id, option)}
                  disabled={isFieldReadOnly}
                  className="w-4 h-4 accent-[#1f64ad]"
                />
                <span className="text-slate-700 font-bold text-[13px]">{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox": {
        const currentValues: string[] = Array.isArray(value) ? value : [];
        if (compact) {
          return (
            <div className="flex flex-wrap gap-2 pt-1">
              {field.options?.map((option) => {
                const checked = currentValues.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      if (isFieldReadOnly) return;
                      const next = checked
                        ? currentValues.filter((v) => v !== option)
                        : [...currentValues, option];
                      handleChange(field.id, next);
                    }}
                    disabled={isFieldReadOnly}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all",
                      checked
                        ? "bg-[#1f64ad] text-white border-[#1f64ad] shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-[#1f64ad]/50"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          );
        }
        return (
          <div className="space-y-3 pt-1">
            {field.options?.map((option) => {
              const checked = currentValues.includes(option);
              return (
                <label key={option} className="flex items-center gap-3 cursor-pointer bg-slate-50/50 hover:bg-slate-100/80 px-4 py-3 rounded-xl border border-slate-100 transition-all">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v) => v !== option);
                      handleChange(field.id, next);
                    }}
                    disabled={isFieldReadOnly}
                    className="w-4 h-4 accent-[#1f64ad] rounded"
                  />
                  <span className="text-slate-700 font-bold text-[13px]">{option}</span>
                </label>
              );
            })}
          </div>
        );
      }

      case "scale": {
        const nums = Array.from(
          { length: (field.max ?? 10) - (field.min ?? 0) + 1 },
          (_, i) => i + (field.min ?? 0)
        );
        const painColor = (v: number) =>
          v <= 3 ? "bg-green-500 text-white" : v <= 6 ? "bg-amber-500 text-white" : "bg-red-500 text-white";

        return (
          <div className="space-y-2 pt-1">
            <div className={cn("flex flex-wrap items-center", compact ? "gap-1.5" : "gap-3")}>
              {nums.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => !isFieldReadOnly && handleChange(field.id, v)}
                  disabled={isFieldReadOnly}
                  className={cn(
                    "rounded-full flex items-center justify-center font-black transition-all text-[12px]",
                    compact ? "w-8 h-8" : "w-10 h-10",
                    value === v
                      ? cn(painColor(v), "shadow-md scale-110")
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            {value !== "" && (
              <p className={cn(
                "text-[11px] font-bold",
                value <= 3 ? "text-green-600" : value <= 6 ? "text-amber-600" : "text-red-600"
              )}>
                {value <= 3 ? "Mild" : value <= 6 ? "Moderate" : "Severe"} pain ({value}/10)
              </p>
            )}
          </div>
        );
      }

      default:
        return <p className="text-red-500 text-xs">Unsupported field type: {field.type}</p>;
    }
  };

  const renderSectionFields = (section: Section) => {
    if (!compact) {
      // Original vertical stack layout
      return (
        <div className="grid gap-8">
          {section.fields.map((field) => {
            const fieldValue = formData[field.id] ?? "";
            return (
              <div key={field.id} className="space-y-3">
                <label className="text-[13px] font-black text-slate-700 flex items-center gap-1.5">
                  {field.label}{field.required && <span className="text-rose-500">*</span>}
                </label>
                {renderField(field)}
                {field.subFields && field.subFields[fieldValue] && (
                  <div className="ml-6 mt-4 p-5 bg-blue-50/30 rounded-2xl space-y-6 border-l-4 border-[#1f64ad]/20">
                    {field.subFields[fieldValue].map((sf) => (
                      <div key={sf.id} className="space-y-3">
                        <label className="text-[12px] font-black text-[#1f64ad]">{sf.label}</label>
                        {renderField(sf)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // Compact mode: group consecutive text/date fields into a grid
    const groups = groupFields(section.fields);
    return (
      <div className="space-y-5">
        {groups.map((group, gi) => {
          if (group.length > 1) {
            // Grid of text inputs — up to 3 columns
            const cols = group.length >= 3 ? "grid-cols-3" : "grid-cols-2";
            return (
              <div key={gi} className={cn("grid gap-3", cols)}>
                {group.map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      {field.label}{field.required && <span className="text-rose-500 ml-0.5">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            );
          }

          const field = group[0];
          const fieldValue = formData[field.id] ?? "";
          return (
            <div key={field.id} className="space-y-2">
              <label className="text-[12px] font-bold text-slate-600 flex items-center gap-1">
                {field.label}{field.required && <span className="text-rose-500">*</span>}
              </label>
              {renderField(field)}
              {/* Sub-fields */}
              {field.subFields && field.subFields[fieldValue] && (
                <div className="ml-4 pl-4 border-l-2 border-[#1f64ad]/20 space-y-3 pt-1">
                  {field.subFields[fieldValue].map((sf) => (
                    <div key={sf.id} className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#1f64ad]">{sf.label}</label>
                      {renderField(sf)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const sectionsToRender = activeSectionId
    ? template.sections.filter((s) => s.id === activeSectionId)
    : template.sections;

  if (!activeSectionId) {
    // Full form — original non-stepped layout
    return (
      <div className="space-y-12">
        {sectionsToRender.map((section) => (
          <div key={section.id} className="space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#1f64ad] rounded-full" />
              <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-widest">{section.title}</h2>
            </div>
            {renderSectionFields(section)}
          </div>
        ))}
      </div>
    );
  }

  // Stepped mode — just the section content, no header (panel handles that)
  return (
    <div className="space-y-5">
      {sectionsToRender.map((section) => renderSectionFields(section))}
    </div>
  );
};

export default DynamicFormRenderer;
