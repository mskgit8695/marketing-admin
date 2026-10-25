import { useState } from "react";
import { Monitor, Smartphone, ShieldCheck, Mail } from "lucide-react";
import type { EmailSenderIdentity } from "@/services/api/email-studio.service";

interface EmailDevicePreviewProps {
  sender?: EmailSenderIdentity;
  subject: string;
  preheader: string;
  htmlContent: string;
  simulatedName?: string;
  simulatedCompany?: string;
}

export function EmailDevicePreview({
  sender,
  subject,
  preheader,
  htmlContent,
  simulatedName = "Alex",
  simulatedCompany = "Acme Corp",
}: EmailDevicePreviewProps) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  // Replace variable tokens for realistic live simulation
  const renderedSubject = subject
    .replace(/\{\{firstName\}\}/g, simulatedName)
    .replace(/\{\{company\}\}/g, simulatedCompany)
    .replace(/\{\{discountCode\}\}/g, "VIP30-OFF");

  const renderedHtml = htmlContent
    .replace(/\{\{firstName\}\}/g, simulatedName)
    .replace(/\{\{company\}\}/g, simulatedCompany)
    .replace(/\{\{email\}\}/g, "alex.morgan@acmecorp.com")
    .replace(/\{\{discountCode\}\}/g, "VIP30-OFF");

  return (
    <div className="flex flex-col h-full bg-slate-100/70 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
      {/* Top Device Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewport === "desktop"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop (1024px)
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewport === "mobile"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile (375px)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Personalized for:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
            {simulatedName} ({simulatedCompany})
          </span>
        </div>
      </div>

      {/* Device Viewport Canvas */}
      <div className="flex-1 flex justify-center overflow-y-auto py-2">
        <div
          className={`transition-all duration-300 w-full ${
            viewport === "mobile"
              ? "max-w-[390px] rounded-[36px] p-3.5 bg-slate-900 shadow-2xl ring-8 ring-slate-800/40 my-auto"
              : "max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800"
          }`}
        >
          {/* Mobile Speaker Notch */}
          {viewport === "mobile" && (
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-8 h-1 bg-slate-700 rounded-full" />
            </div>
          )}

          <div
            className={`rounded-xl overflow-hidden bg-white text-slate-900 ${
              viewport === "mobile" ? "min-h-[580px]" : ""
            }`}
          >
            {/* Email Client Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-slate-900">
                        {sender?.name || "OmniFlow AI"}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        &lt;{sender?.email || "updates@notify.omniflow.ai"}&gt;
                      </span>
                      {sender?.isDkimVerified && (
                        <span
                          className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold"
                          title="DKIM & SPF cryptographic authentication verified"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      to: {simulatedName.toLowerCase()}@{simulatedCompany.toLowerCase().replace(/\s+/g, "")}.com
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-mono shrink-0">
                  10:42 AM
                </span>
              </div>

              {/* Subject & Preheader in email header */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                <h4 className="font-bold text-sm text-slate-900 leading-snug">
                  {renderedSubject || "Subject line will appear here..."}
                </h4>
                {preheader && (
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {preheader}
                  </p>
                )}
              </div>
            </div>

            {/* Email Rendered Content (Sandboxed to prevent XSS / script execution) */}
            <div className="p-2 sm:p-4 overflow-x-auto text-sm">
              <iframe
                title="Email Content Sandbox Preview"
                srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;margin:0;padding:16px;color:#1e293b;line-height:1.6;font-size:14px;background:#ffffff;}img{max-width:100%;height:auto;}a{color:#4f46e5;text-decoration:underline;}</style></head><body>${renderedHtml}</body></html>`}
                sandbox="allow-popups"
                className="w-full min-h-[460px] border-0 rounded-lg bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
