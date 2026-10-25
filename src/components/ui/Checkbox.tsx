import { forwardRef, type InputHTMLAttributes, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Check, Minus } from "lucide-react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, indeterminate, id, checked, disabled, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement | null>(null);
    const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    const setRefs = (element: HTMLInputElement | null) => {
      internalRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <div className="flex items-start gap-2.5 select-none">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={checkboxId}
            ref={setRefs}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className={cn(
              "peer h-4 w-4 shrink-0 rounded border border-slate-300 bg-white cursor-pointer appearance-none transition-all",
              "checked:bg-indigo-600 checked:border-indigo-600",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100",
              indeterminate && "bg-indigo-600 border-indigo-600",
              className
            )}
            {...props}
          />
          <div className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity">
            {indeterminate ? <Minus className="h-3 w-3 stroke-[3]" /> : <Check className="h-3 w-3 stroke-[3]" />}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col text-xs">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn("font-medium text-slate-800 cursor-pointer", disabled && "cursor-not-allowed opacity-60")}
              >
                {label}
              </label>
            )}
            {description && <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
