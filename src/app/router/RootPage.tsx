import { toast } from "sonner";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Database, 
  Cpu, 
  ArrowRight,
  Boxes,
  Code2
} from "lucide-react";
import { appConfig } from "@/app/config/app.config";

export function FoundationPage() {
  const testFeedback = () => {
    toast.success("Design System & Providers Active", {
      description: "TanStack Query, Sonner Toaster, and Tailwind Tokens are operating normally.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
              {appConfig.appName}
              <span className="text-[10px] uppercase tracking-wider font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2 py-0.5 rounded-full">
                SaaS v{appConfig.version}
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">AI-Powered Digital Marketing & CRM Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Phase 0 Initialized
          </span>
          <button
            onClick={testFeedback}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-600/20 cursor-pointer"
          >
            Test Feedback Engine
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-6 py-12 flex-1">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/70 mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            Enterprise-Grade Multi-Tenant Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Frontend Architecture Foundation
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Cleanly structured frontend core decoupled from the upcoming backend API. 
            All foundational systems, routing, state caches, design tokens, and domain abstractions are operational.
          </p>
        </div>

        {/* System Diagnostics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Core Framework */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Modern Stack</h3>
            <p className="text-xs text-slate-500 mb-4">Core frameworks and bundler optimization</p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>React 19 + TypeScript (Strict Type Safety)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Vite 8 with Chunk Separation & HMR</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Tailwind CSS v4 + Commercial SaaS Tokens</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>React Router v7 Declarative Navigation</span>
              </li>
            </ul>
          </div>

          {/* Card 2: State & Storage */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">State & Forms</h3>
            <p className="text-xs text-slate-500 mb-4">Caching, validation, and feedback layers</p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>TanStack Query v5 with Caching & GC</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>React Hook Form + Zod Validation Schema</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Lucide Icons & Recharts Visualization</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Sonner Toast Notifications Configured</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Service Abstraction */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">API Abstraction</h3>
            <p className="text-xs text-slate-500 mb-4">Decoupled client architecture ready for swap</p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span><code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-600">services/api/client.ts</code> abstraction</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span><code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-600">services/mock/</code> directory prepared</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span><code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-600">types/index.ts</code> domain contracts ready</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Safe typed LocalStorage wrapper operational</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Roadmap Milestones Tracker */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-indigo-600" />
              <h4 className="font-bold text-slate-900 text-sm">Implementation Roadmap & Execution Plan</h4>
            </div>
            <span className="text-xs font-medium text-slate-500">Step-by-step phased execution</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900">Phase 0: Foundation</span>
              </div>
              <p className="text-[11px] text-emerald-700">Project setup, tokens, TanStack Query, types, folder architecture.</p>
            </div>

            <Link
              to="/design-system"
              className="p-3.5 rounded-xl border border-indigo-300 bg-indigo-50/70 hover:bg-indigo-100/70 hover:border-indigo-400 transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                  <span className="text-xs font-bold text-indigo-900">Phase 1: Design System</span>
                </div>
                <span className="text-[10px] font-semibold bg-indigo-600 text-white px-1.5 py-0.5 rounded">View Live</span>
              </div>
              <p className="text-[11px] text-indigo-800">27 Reusable UI Primitives ready: Buttons, Inputs, Modals, Tables, etc.</p>
            </Link>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 opacity-75">
              <div className="flex items-center gap-2 mb-1.5">
                <Code2 className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Phase 2: App Shell</span>
              </div>
              <p className="text-[11px] text-slate-500">Collapsible sidebar, Topbar, Workspace selector, Mobile drawer.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 opacity-75">
              <div className="flex items-center gap-2 mb-1.5">
                <Code2 className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Phase 3+: SaaS Features</span>
              </div>
              <p className="text-[11px] text-slate-500">Auth, Dashboard, CRM, Audiences, Campaigns, Automation, Super Admin.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500 font-medium">
        {appConfig.fullName} &bull; Frontend Admin Architecture &bull; Awaiting user confirmation for Phase 1
      </footer>
    </div>
  );
}
