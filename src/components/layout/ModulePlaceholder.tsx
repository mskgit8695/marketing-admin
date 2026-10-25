import { type ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from "@/components/ui";
import { CheckCircle2, ArrowRight } from "lucide-react";

export interface ModulePlaceholderProps {
  title: string;
  category: string;
  description: string;
  icon: ReactNode;
  features: string[];
  actionLabel?: string;
  onAction?: () => void;
  statusText?: string;
}

export function ModulePlaceholder({
  title,
  category,
  description,
  icon,
  features,
  actionLabel = "Quick Action",
  onAction,
  statusText = "Ready for Business Phase",
}: ModulePlaceholderProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 shadow-xs shrink-0">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{category}</span>
              <Badge variant="primary" size="sm" dot>{statusText}</Badge>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-center">
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      </div>

      {/* Feature Capabilities Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Planned Module Capabilities</CardTitle>
            <CardDescription>Key domain features designed for upcoming implementation phase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-slate-700 leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Multi-Tenant Security & API Card */}
        <Card>
          <CardHeader>
            <CardTitle>Architecture Status</CardTitle>
            <CardDescription>Decoupled mock services and backend-ready models</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-indigo-900 block">Workspace Tenant Boundary</span>
              <p className="text-[11px] text-indigo-700">All queries automatically filtered by active workspace ID header.</p>
            </div>
            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-emerald-900 block">API Client Abstraction</span>
              <p className="text-[11px] text-emerald-700">Ready for instant mock-to-REST transition in subsequent phases.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
