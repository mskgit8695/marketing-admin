import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, containerClassName, label, error, helperText, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 select-none">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
            <Calendar className="h-4 w-4" />
          </div>
          <input
            id={inputId}
            ref={ref}
            type="date"
            disabled={disabled}
            className={cn(
              "w-full h-9 rounded-lg border bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 transition-colors cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20",
              disabled && "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
