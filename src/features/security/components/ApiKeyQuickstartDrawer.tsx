import { useState } from "react";
import { Copy, Check, Terminal, Code2, Globe } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface ApiKeyQuickstartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sampleKeyPrefix?: string;
}

export function ApiKeyQuickstartDrawer({
  isOpen,
  onClose,
  sampleKeyPrefix = "omni_live_your_secret_key_here",
}: ApiKeyQuickstartDrawerProps) {
  const [activeTab, setActiveTab] = useState<"curl" | "node" | "python">("curl");
  const [copied, setCopied] = useState(false);

  const snippets = {
    curl: `curl -X POST https://api.omniflow.io/v1/broadcasts \\
  -H "Authorization: Bearer ${sampleKeyPrefix}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "email",
    "subject": "Exclusive VIP Announcement",
    "sender": "vip@acmeluxury.com",
    "recipients": ["client@example.com"],
    "templateId": "tmpl_autumn_gala_01"
  }'`,
    node: `import { OmniFlowClient } from '@omniflow/sdk';

const client = new OmniFlowClient({
  apiKey: '${sampleKeyPrefix}',
});

// Trigger real-time campaign dispatch
const response = await client.campaigns.dispatch({
  channel: 'email',
  subject: 'Exclusive VIP Announcement',
  sender: 'vip@acmeluxury.com',
  recipients: ['client@example.com'],
  templateId: 'tmpl_autumn_gala_01',
});

console.log('Dispatch initiated:', response.id);`,
    python: `from omniflow import OmniFlowClient

client = OmniFlowClient(api_key="${sampleKeyPrefix}")

# Trigger campaign broadcast
response = client.campaigns.dispatch(
    channel="email",
    subject="Exclusive VIP Announcement",
    sender="vip@acmeluxury.com",
    recipients=["client@example.com"],
    template_id="tmpl_autumn_gala_01"
)

print(f"Dispatched with ID: {response.id}")`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    toast.success("Code snippet copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Developer API Quickstart"
      description="Authenticate external microservices and backend pipelines using Bearer tokens."
      size="lg"
    >
      <div className="space-y-6 pt-2">
        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("curl")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "curl"
                ? "bg-white text-indigo-700 shadow-2xs border border-indigo-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-600" />
            cURL / Shell
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("node")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "node"
                ? "bg-white text-emerald-700 shadow-2xs border border-emerald-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-600" />
            Node.js / TypeScript
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("python")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "python"
                ? "bg-white text-amber-700 shadow-2xs border border-amber-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-amber-600" />
            Python 3.x
          </button>
        </div>

        {/* Code Container */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 p-4 font-mono text-xs overflow-x-auto">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400">
              {activeTab === "curl" ? "Shell Command" : activeTab === "node" ? "index.ts" : "main.py"}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-800 text-[11px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="ml-1.5">{copied ? "Copied" : "Copy Code"}</span>
            </Button>
          </div>
          <pre className="text-slate-300 leading-relaxed font-mono select-all">
            {snippets[activeTab]}
          </pre>
        </div>

        {/* Integration Specs */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">API Gateway Endpoints</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                  POST
                </span>
                <span className="font-mono text-slate-700">https://api.omniflow.io/v1/broadcasts</span>
              </div>
              <span className="text-[11px] text-slate-400">Broadcast Dispatch</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">
                  GET
                </span>
                <span className="font-mono text-slate-700">https://api.omniflow.io/v1/contacts</span>
              </div>
              <span className="text-[11px] text-slate-400">Audience Queries</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-bold text-[10px]">
                  POST
                </span>
                <span className="font-mono text-slate-700">https://api.omniflow.io/v1/webhooks</span>
              </div>
              <span className="text-[11px] text-slate-400">Real-Time Subscriptions</span>
            </div>
          </div>
        </div>

        {/* Rate Limiting Notice */}
        <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 space-y-1">
          <p className="font-semibold text-indigo-900">Rate Limit Entitlements</p>
          <p className="text-indigo-800 text-[11px] leading-relaxed">
            Live keys are rated for <strong>10,000 requests/minute</strong>. Sandbox/Test keys are rated for{" "}
            <strong>500 requests/minute</strong>. Standard responses include <code className="font-mono">X-RateLimit-Remaining</code> headers.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
