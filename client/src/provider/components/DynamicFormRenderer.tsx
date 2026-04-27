import React from "react";

interface DynamicFormRendererProps {
  template: any;
  formData: any;
  onChange?: (data: any) => void;
  readOnly?: boolean;
  isSubmitted?: boolean;
  formName?: string;
  compact?: boolean;
  activeSectionId?: string | null;
}

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  template,
  formData,
  onChange = () => {},
  readOnly = false,
  isSubmitted = false,
  formName,
  compact = false,
  activeSectionId = null,
}) => {
  if (!template || !template.sections) return null;

  const handleFieldChange = (fieldId: string, value: any, isFieldReadOnly: boolean) => {
    if (isFieldReadOnly) return;
    onChange({ ...formData, [fieldId]: value });
  };

  const renderField = (field: any, isFieldReadOnly: boolean) => {
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
            className="w-full min-w-0 px-4 py-2 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#1f64ad]/20 focus:border-[#1f64ad] focus:bg-white outline-none text-[13px] transition-all hover:bg-slate-100/50"
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
            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#1f64ad]/20 focus:border-[#1f64ad] focus:bg-white outline-none min-h-[100px] text-[13px] transition-all hover:bg-slate-100/50 resize-none"
            placeholder={field.placeholder || field.label}
          />
        );

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option: string) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer group bg-slate-50/50 hover:bg-slate-100/80 px-4 py-2.5 rounded-xl border border-separate transition-all">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={() => handleFieldChange(field.id, option, isFieldReadOnly)}
                  disabled={isFieldReadOnly}
                  className="w-4 h-4 text-[#1f64ad] border-slate-300 focus:ring-[#1f64ad]/20"
                />
                <span className="text-slate-700 font-semibold group-hover:text-slate-900 text-[12px]">{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option: string) => {
              const currentValues = Array.isArray(value) ? value : [];
              const isChecked = currentValues.includes(option);
              return (
                <label key={option} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option);
                      handleFieldChange(field.id, newValues, isFieldReadOnly);
                    }}
                    disabled={isFieldReadOnly}
                    className="w-3.5 h-3.5 rounded text-[#1f64ad] focus:ring-[#1f64ad]"
                  />
                  <span className="text-slate-600 group-hover:text-slate-900 text-[12px]">{option}</span>
                </label>
              );
            })}
          </div>
        );

      case "scale":
        return (
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: field.max - field.min + 1 }, (_, i) => i + field.min).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleFieldChange(field.id, val, isFieldReadOnly)}
                disabled={isFieldReadOnly}
                className={`flex items-center justify-center font-bold transition-all rounded-full ${compact ? "w-7 h-7 text-[10px]" : "w-8 h-8 text-xs"
                  } ${value === val
                    ? "bg-[#1f64ad] text-white shadow-md"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
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

  const sectionsToRender = activeSectionId
    ? template.sections.filter((s: any) => s.id === activeSectionId)
    : template.sections;

  return (
    <div className={compact ? "space-y-5" : "space-y-8"}>
      {sectionsToRender.map((section: any) => {
        let isSectionReadOnly = readOnly || isSubmitted;
        if (formName === "consent-form" && (readOnly || isSubmitted)) {
          if (section.id === "part1" || section.id === "part2") {
            isSectionReadOnly = false;
          }
        }

        return (
          <div key={section.id} className="space-y-4">
            <h2 className={compact ? "text-[12px] font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wider" : "text-[13px] font-bold text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wider"}>
              {section.title}
            </h2>
            <div className={compact ? "grid gap-4" : "grid gap-6"}>
              {section.fields?.map((field: any) => {
                const value = formData[field.id] || "";
                return (
                  <div key={field.id} className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-600 block">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderField(field, isSectionReadOnly)}
                    {/* Conditional sub-fields */}
                    {field.subFields && field.subFields[value] && (
                      <div className="ml-6 mt-3 p-3 bg-slate-50 rounded-lg space-y-4 border-l-4 border-slate-200">
                        {field.subFields[value].map((subField: any) => (
                          <div key={subField.id} className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 block">
                              {subField.label}
                            </label>
                            {renderField(subField, isSectionReadOnly)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default DynamicFormRenderer;
