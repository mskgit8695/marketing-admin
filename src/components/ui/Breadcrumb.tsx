import { type ReactNode } from "react";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  showHome?: boolean;
  className?: string;
}

export function Breadcrumb({
  items,
  homeHref = "/",
  showHome = true,
  className,
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-xs text-slate-500", className)}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {showHome && (
          <li className="flex items-center gap-1.5">
            <a
              href={homeHref}
              className="text-slate-400 hover:text-slate-700 transition-colors flex items-center"
              aria-label="Home"
            >
              <Home className="h-3.5 w-3.5" />
            </a>
            {items.length > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {isLast ? (
                <span className="font-semibold text-slate-900 flex items-center gap-1.5" aria-current="page">
                  {item.icon && <span className="text-slate-500">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href || "#"}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  className="hover:text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {item.icon && <span className="text-slate-400">{item.icon}</span>}
                  {item.label}
                </a>
              )}

              {!isLast && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
