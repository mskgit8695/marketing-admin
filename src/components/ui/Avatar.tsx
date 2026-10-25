import { useState, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "offline" | "busy" | "away";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  shape?: "circle" | "rounded";
}

const sizeClasses: Record<AvatarSize, { container: string; text: string; icon: string; status: string }> = {
  xs: { container: "h-6 w-6", text: "text-[10px]", icon: "h-3.5 w-3.5", status: "h-1.5 w-1.5 ring-1" },
  sm: { container: "h-8 w-8", text: "text-xs", icon: "h-4 w-4", status: "h-2 w-2 ring-1.5" },
  md: { container: "h-10 w-10", text: "text-sm", icon: "h-5 w-5", status: "h-2.5 w-2.5 ring-2" },
  lg: { container: "h-12 w-12", text: "text-base", icon: "h-6 w-6", status: "h-3 w-3 ring-2" },
  xl: { container: "h-16 w-16", text: "text-xl", icon: "h-8 w-8", status: "h-3.5 w-3.5 ring-2" },
};

const statusClasses: Record<AvatarStatus, string> = {
  online: "bg-emerald-500",
  offline: "bg-slate-400",
  busy: "bg-rose-500",
  away: "bg-amber-500",
};

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  status,
  shape = "circle",
  className,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const getInitials = (str?: string) => {
    if (!str) return "";
    const parts = str.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name || alt);
  const sizeConfig = sizeClasses[size];

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 bg-slate-100 text-slate-700 font-semibold select-none overflow-hidden",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        sizeConfig.container,
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : initials ? (
        <span className={cn(sizeConfig.text, "font-bold text-indigo-700 bg-indigo-50/80 w-full h-full flex items-center justify-center")}>
          {initials}
        </span>
      ) : (
        <User className={cn(sizeConfig.icon, "text-slate-400")} />
      )}

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-white",
            sizeConfig.status,
            statusClasses[status]
          )}
        />
      )}
    </div>
  );
}
