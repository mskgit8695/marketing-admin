import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  isCard?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, isCard = false, id, disabled, checked, ...props }, ref) => {
    const radioId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    if (isCard) {
      return (
        <label
          htmlFor={radioId}
          className={cn(
            "relative flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none",
            checked
              ? "border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-600/30"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <input
            id={radioId}
            ref={ref}
            type="radio"
            checked={checked}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-4 w-4 shrink-0 rounded-full border flex items-center justify-center mt-0.5 transition-colors",
              checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
            )}
          >
            {checked && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
          </div>
          <div className="flex flex-col text-xs">
            {label && <span className="font-semibold text-slate-800">{label}</span>}
            {description && <span className="text-slate-500 text-[11px] mt-0.5">{description}</span>}
          </div>
        </label>
      );
    }

    return (
      <div className="flex items-start gap-2.5 select-none">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={radioId}
            ref={ref}
            type="radio"
            checked={checked}
            disabled={disabled}
            className={cn(
              "peer h-4 w-4 shrink-0 rounded-full border border-slate-300 bg-white cursor-pointer appearance-none transition-all",
              "checked:border-indigo-600 checked:bg-indigo-600",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
          <div className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {(label || description) && (
          <div className="flex flex-col text-xs">
            {label && (
              <label
                htmlFor={radioId}
                className={cn("font-medium text-slate-800 cursor-pointer", disabled && "cursor-not-allowed opacity-60")}
              >
                {label}
              </label>
            )}
            {description && <p className="text-slate-500 text-[11px] mt-0.5">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";
