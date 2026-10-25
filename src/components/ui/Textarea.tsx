import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      showCount = false,
      maxLength,
      value,
      defaultValue,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const currentLength = typeof value === "string" ? value.length : typeof defaultValue === "string" ? defaultValue.length : 0;

    return (
      <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 select-none">
              {label}
              {props.required && <span className="text-rose-500 ml-1">*</span>}
            </label>
          )}
          {showCount && maxLength && (
            <span className="text-[11px] text-slate-400 font-mono">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          id={inputId}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          disabled={disabled}
          className={cn(
            "w-full min-h-[80px] rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 resize-y",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20",
            disabled && "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
