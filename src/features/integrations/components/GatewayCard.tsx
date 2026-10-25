import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Smartphone,
  Layers,
  Activity,
  Settings2,
  ExternalLink,
  PlusCircle,
  KeyRound,
  Loader2,
} from "lucide-react";
import type { Gateway } from "@/types/integrations";
import { Badge, Button } from "@/components/ui";

interface GatewayCardProps {
  gateway: Gateway;
  onConfigure: (gateway: Gateway) => void;
  onTestPing: (gatewayId: string) => Promise<unknown>;
}

export function GatewayCard({ gateway, onConfigure, onTestPing }: GatewayCardProps) {
  const [isPinging, setIsPinging] = useState(false);

  const handlePing = async () => {
    setIsPinging(true);
    try {
      await onTestPing(gateway.id);
    } finally {
      setIsPinging(false);
    }
  };

  const getCategoryIcon = () => {
    switch (gateway.category) {
      case "email":
        return <Mail className="w-4 h-4 text-sky-600" />;
      case "whatsapp":
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case "sms":
        return <Smartphone className="w-4 h-4 text-purple-600" />;
      case "crm":
        return <Layers className="w-4 h-4 text-amber-600" />;
    }
  };

  const isConnected = gateway.status === "connected";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between p-5">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-2xs">
              {getCategoryIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                {gateway.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  {gateway.category}
                </span>
                <span className="text-slate-300">•</span>
                <a
                  href={gateway.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 font-medium"
                >
                  Docs
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

          <Badge
            variant={isConnected ? "success" : "default"}
            size="sm"
            dot
          >
            {isConnected ? "Connected" : "Available"}
          </Badge>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {gateway.description}
        </p>

        {/* Feature Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {gateway.features.slice(0, 3).map((feat, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
            >
              {feat}
            </span>
          ))}
          {gateway.features.length > 3 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md text-slate-400 bg-slate-50">
              +{gateway.features.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-[11px] truncate max-w-[130px]">
              {gateway.credentialsMasked}
            </span>
          </div>

          {isConnected ? (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <Activity className="w-3 h-3" />
              <span>{gateway.latencyMs}ms</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">Not configured</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={handlePing}
                disabled={isPinging}
              >
                {isPinging ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Pinging...
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                    Test Ping
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50/50"
                onClick={() => onConfigure(gateway)}
              >
                <Settings2 className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Configure
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs"
              onClick={() => onConfigure(gateway)}
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              Connect Gateway
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
