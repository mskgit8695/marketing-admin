import { useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: (DropdownItem | "divider")[];
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({ trigger, items, align = "right", className }: DropdownProps) {
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
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 min-w-[180px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl transition-all",
            "animate-in fade-in zoom-in-95 duration-150",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, idx) => {
            if (item === "divider") {
              return <div key={`divider-${idx}`} className="my-1 border-t border-slate-100" />;
            }

            return (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    setIsOpen(false);
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors select-none cursor-pointer",
                  item.destructive
                    ? "text-rose-600 hover:bg-rose-50 active:bg-rose-100"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
                  item.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
                )}
              >
                <span className="flex items-center gap-2">
                  {item.icon && <span className="shrink-0 text-slate-400">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
                {item.badge && <span>{item.badge}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
