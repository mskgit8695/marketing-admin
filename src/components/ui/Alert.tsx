import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";

export type AlertVariant = "info" | "success" | "warning" | "destructive";

export interface AlertProps {
  variant?: AlertVariant;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantConfig: Record<AlertVariant, { container: string; text: string; icon: ReactNode }> = {
  info: {
    container: "bg-sky-50 border-sky-200 text-sky-900",
    text: "text-sky-800",
    icon: <Info className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />,
  },
  success: {
    container: "bg-emerald-50 border-emerald-200 text-emerald-900",
    text: "text-emerald-800",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />,
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-900",
    text: "text-amber-800",
    icon: <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />,
  },
  destructive: {
    container: "bg-rose-50 border-rose-200 text-rose-900",
    text: "text-rose-800",
    icon: <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />,
  },
};

export function Alert({
  variant = "info",
  title,
  description,
  icon,
  children,
  dismissible = false,
  onDismiss,
  className,
}: AlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const config = variantConfig[variant];

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-xl border text-xs",
        config.container,
        className
      )}
    >
      <div>{icon || config.icon}</div>
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-bold tracking-tight text-slate-900">{title}</h5>}
        {description && <div className={cn("leading-relaxed", config.text)}>{description}</div>}
        {children && <div className="mt-2">{children}</div>}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 rounded-md p-0.5 transition-colors cursor-pointer"
          aria-label="Dismiss Alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
