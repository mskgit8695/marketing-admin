import { useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Filter, X, RotateCcw, Check } from "lucide-react";
import { Button } from "./Button";

export interface FilterPanelProps {
  activeCount?: number;
  onReset?: () => void;
  onApply?: () => void;
  children: ReactNode;
  triggerLabel?: string;
  className?: string;
}

export function FilterPanel({
  activeCount = 0,
  onReset,
  onApply,
  children,
  triggerLabel = "Filters",
  className,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        leftIcon={<Filter className="h-3.5 w-3.5 text-slate-500" />}
        className={cn(
          activeCount > 0 && "border-indigo-300 bg-indigo-50/50 text-indigo-700"
        )}
      >
        <span>{triggerLabel}</span>
        {activeCount > 0 && (
          <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
            {activeCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-40 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-900">Filter Options</h4>
              {activeCount > 0 && (
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                  {activeCount} active
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Filter Body */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {children}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
            {onReset && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={onReset}
                leftIcon={<RotateCcw className="h-3 w-3" />}
              >
                Reset
              </Button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                type="button"
                variant="primary"
                size="xs"
                onClick={() => {
                  onApply?.();
                  setIsOpen(false);
                }}
                leftIcon={<Check className="h-3 w-3" />}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
