import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: "line" | "pills";
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: "line" | "pills";
  className?: string;
  children: ReactNode;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  variant = "line",
  className,
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const activeTab = value !== undefined ? value : internalValue;
  const setActiveTab = (newVal: string) => {
    if (value === undefined) {
      setInternalValue(newVal);
    }
    onValueChange?.(newVal);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
      <div className={cn("w-full flex flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  className?: string;
  children: ReactNode;
}

export function TabsList({ className, children }: TabsListProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsList must be used within Tabs");

  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1",
        context.variant === "line"
          ? "border-b border-slate-200 w-full"
          : "bg-slate-100 p-1 rounded-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function TabsTrigger({
  value,
  disabled,
  icon,
  badge,
  className,
  children,
}: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const isActive = context.activeTab === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => context.setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center font-medium text-xs transition-all select-none cursor-pointer whitespace-nowrap",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        "disabled:pointer-events-none disabled:opacity-50",
        context.variant === "line"
          ? cn(
              "px-4 py-2.5 border-b-2 -mb-px gap-2",
              isActive
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            )
          : cn(
              "px-3 py-1.5 rounded-lg gap-1.5",
              isActive
                ? "bg-white text-slate-900 font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            ),
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge && <span>{badge}</span>}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  if (context.activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={cn("mt-4 focus-visible:outline-none animate-in fade-in-50 duration-150", className)}
    >
      {children}
    </div>
  );
}
