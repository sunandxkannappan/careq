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
}

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  template,
  formData,
  onChange,
  readOnly = false,
  isSubmitted = false,
}) => {
  if (!template || !template.sections) return null;

  const handleFieldChange = (fieldId: string, value: any, isFieldReadOnly: boolean) => {
    if (isFieldReadOnly) return;
    onChange({ ...formData, [fieldId]: value });
  };

  const renderField = (field: Field, isFieldReadOnly: boolean) => {
    const value = formData[field.id] || "";

    switch (field.type) {
      case "text":
      case "date":
      case "email":
        return (
          <input
            type={field.type}
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value, isFieldReadOnly)}
            disabled={isFieldReadOnly}
            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1f64ad]/10 focus:border-[#1f64ad] focus:bg-white outline-none text-[13px] transition-all hover:bg-slate-100/50"
            placeholder={field.placeholder || field.label}
          />
        );

      case "textarea":
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value, isFieldReadOnly)}
            disabled={isFieldReadOnly}
            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1f64ad]/10 focus:border-[#1f64ad] focus:bg-white outline-none min-h-[100px] text-[13px] transition-all hover:bg-slate-100/50 resize-none"
            placeholder={field.placeholder || field.label}
          />
        );

      case "radio":
        return (
          <div className="space-y-3 pt-1">
            {field.options?.map((option) => (
              <label 
                key={option} 
                className={cn(
                  "flex items-center gap-3 cursor-pointer group bg-slate-50/50 hover:bg-slate-100/80 px-4 py-3 rounded-xl border border-slate-100 transition-all",
                  value === option && "border-[#1f64ad] bg-white ring-2 ring-[#1f64ad]/5"
                )}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={() => handleFieldChange(field.id, option, isFieldReadOnly)}
                  disabled={isFieldReadOnly}
                  className="w-4 h-4 accent-[#1f64ad]"
                />
                <span className="text-slate-700 font-bold group-hover:text-slate-900 text-[13px]">{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-3 pt-1">
            {field.options?.map((option) => {
              const currentValues = Array.isArray(value) ? value : [];
              const isChecked = currentValues.includes(option);
              return (
                <label key={option} className="flex items-center gap-3 cursor-pointer group bg-slate-50/50 hover:bg-slate-100/80 px-4 py-3 rounded-xl border border-slate-100 transition-all">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v) => v !== option);
                      handleFieldChange(field.id, newValues, isFieldReadOnly);
                    }}
                    disabled={isFieldReadOnly}
                    className="w-4 h-4 accent-[#1f64ad] rounded"
                  />
                  <span className="text-slate-700 font-bold group-hover:text-slate-900 text-[13px]">{option}</span>
                </label>
              );
            })}
          </div>
        );

      case "scale":
        return (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {Array.from({ length: (field.max || 10) - (field.min || 0) + 1 }, (_, i) => i + (field.min || 0)).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleFieldChange(field.id, val, isFieldReadOnly)}
                disabled={isFieldReadOnly}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black transition-all text-sm",
                  value === val
                    ? "bg-[#1f64ad] text-white shadow-lg shadow-blue-100 scale-110"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
              >
                {val}
              </button>
            ))}
          </div>
        );

      default:
        return <p className="text-red-500">Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <div className="space-y-12">
      {template.sections.map((section) => (
        <div key={section.id} className="space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#1f64ad] rounded-full" />
             <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-widest">
              {section.title}
             </h2>
          </div>
          <div className="grid gap-8">
            {section.fields.map((field) => {
              const fieldValue = formData[field.id] || "";
              return (
                <div key={field.id} className="space-y-3">
                  <label className="text-[13px] font-black text-slate-700 flex items-center gap-1.5">
                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                  </label>
                  {renderField(field, isSubmitted || readOnly)}
                  {/* Conditional sub-fields */}
                  {field.subFields && field.subFields[fieldValue] && (
                    <div className="ml-6 mt-4 p-5 bg-blue-50/30 rounded-2xl space-y-6 border-l-4 border-[#1f64ad]/20 card-animation">
                      {field.subFields[fieldValue].map((subField) => (
                        <div key={subField.id} className="space-y-3">
                          <label className="text-[12px] font-black text-[#1f64ad]">
                            {subField.label}
                          </label>
                          {renderField(subField, isSubmitted || readOnly)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicFormRenderer;
