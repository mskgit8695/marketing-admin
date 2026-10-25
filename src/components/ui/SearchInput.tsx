import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
  containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, value, onClear, disabled, ...props }, ref) => {
    const hasValue = value !== undefined && value !== "";

    return (
      <div className={cn("relative flex items-center w-full", containerClassName)}>
        <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
          <Search className="h-4 w-4" />
        </div>
        <input
          ref={ref}
          type="text"
          value={value}
          disabled={disabled}
          placeholder="Search..."
          className={cn(
            "w-full h-9 rounded-lg border border-slate-300 bg-white pl-9 pr-8 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 transition-colors",
            "focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
            disabled && "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed",
            className
          )}
          {...props}
        />
        {hasValue && onClear && !disabled && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
