import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Zap, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Brand & Showcase Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative glow blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block">OmniFlow AI</span>
            <span className="text-[11px] text-slate-400 font-medium">Digital Marketing & CRM Platform</span>
          </div>
        </div>

        {/* Center Testimonial & Live Telemetry Card */}
        <div className="relative z-10 space-y-8 my-auto py-12">
          <div className="space-y-4 max-w-lg">
            <Badge variant="primary" size="sm" className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30">
              Enterprise Ready SaaS
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Scale your marketing campaigns across Email, WhatsApp & SMS with AI intelligence.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              OmniFlow brings HubSpot-grade contact management, high-throughput delivery gateways, and automated AI copy generation into one unified workspace.
            </p>
          </div>

          {/* Social Proof & Metrics Mini-Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-4">
            <div className="grid grid-cols-3 gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-2xl font-black text-white block tabular-nums">99.4%</span>
                <span className="text-[11px] text-slate-400">Delivery Rate</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400 block tabular-nums">12M+</span>
                <span className="text-[11px] text-slate-400">Messages/Month</span>
              </div>
              <div>
                <span className="text-2xl font-black text-indigo-400 block tabular-nums">4.2x</span>
                <span className="text-[11px] text-slate-400">ROI Lift</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> GDPR & CAN-SPAM
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-400" /> Meta Cloud API
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4 text-sky-400" /> Real-time Analytics
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} OmniFlow Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto py-8">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900">OmniFlow AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">{subtitle}</p>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            {children}
          </div>

          {/* Bottom Security Note */}
          <p className="text-center text-[11px] text-slate-400 mt-6 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            256-bit TLS encrypted &bull; Multi-tenant workspace isolation
          </p>
        </div>

        <div className="text-center text-xs text-slate-400 py-2">
          <Link to="/" className="text-indigo-600 hover:underline font-medium">
            &larr; Return to SaaS Architecture Home
          </Link>
        </div>
      </div>
    </div>
  );
}
