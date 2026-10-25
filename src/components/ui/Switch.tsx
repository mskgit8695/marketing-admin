import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onCheckedChange, label, description, disabled, id, ...props }, ref) => {
    const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const toggle = () => {
      if (!disabled) {
        onCheckedChange(!checked);
      }
    };

    return (
      <div className="flex items-start gap-3 select-none">
        <button
          id={switchId}
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={toggle}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            checked ? "bg-indigo-600" : "bg-slate-200",
            className
          )}
          {...props}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
              checked ? "translate-x-4" : "translate-x-0"
            )}
          />
        </button>
        {(label || description) && (
          <div className="flex flex-col text-xs">
            {label && (
              <label
                htmlFor={switchId}
                onClick={toggle}
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

Switch.displayName = "Switch";
