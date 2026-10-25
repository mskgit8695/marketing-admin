import { useState } from "react";
import { History, Search, Mail, MessageSquare, Phone, CheckCircle2, Clock, Eye, MousePointerClick, AlertCircle } from "lucide-react";
import type { TransmissionLog, TransmissionStatus } from "@/types/analytics";
import { Badge, Input } from "@/components/ui";

interface TransmissionLogsCardProps {
  logs?: TransmissionLog[];
  isLoading?: boolean;
}

export function TransmissionLogsCard({ logs = [], isLoading }: TransmissionLogsCardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(
    (l) =>
      l.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.recipientContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.providerMsgId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: TransmissionStatus) => {
    switch (status) {
      case "CLICKED":
        return (
          <Badge variant="primary" className="gap-1 text-[10px] font-bold">
            <MousePointerClick className="h-3 w-3" /> Clicked
          </Badge>
        );
      case "OPENED":
        return (
          <Badge variant="info" className="gap-1 text-[10px] font-bold">
            <Eye className="h-3 w-3" /> Opened
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge variant="success" className="gap-1 text-[10px] font-bold">
            <CheckCircle2 className="h-3 w-3" /> Delivered
          </Badge>
        );
      case "QUEUED":
        return (
          <Badge variant="warning" className="gap-1 text-[10px] font-bold">
            <Clock className="h-3 w-3" /> Queued
          </Badge>
        );
      case "FAILED":
      default:
        return (
          <Badge variant="destructive" className="gap-1 text-[10px] font-bold">
            <AlertCircle className="h-3 w-3" /> Failed
          </Badge>
        );
    }
  };

  const getChannelIcon = (ch: string) => {
    switch (ch.toLowerCase()) {
      case "email":
        return <Mail className="h-3.5 w-3.5 text-sky-600" />;
      case "whatsapp":
        return <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />;
      case "sms":
      default:
        return <Phone className="h-3.5 w-3.5 text-cyan-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="h-4 w-4 text-indigo-600" />
            Live Transmission Audit Log
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time individual message dispatch telemetry and gateway delivery receipts
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search recipient or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8.5 h-8.5 text-xs rounded-xl bg-slate-50/70 focus:bg-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-sm text-slate-400">
          Loading transmission receipts...
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="flex items-center justify-center p-12 text-sm text-slate-400">
          No matching transmission logs found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="pb-3 pl-2">Status</th>
                <th className="pb-3 px-3">Recipient</th>
                <th className="pb-3 px-3">Channel</th>
                <th className="pb-3 px-3">Campaign</th>
                <th className="pb-3 px-3">Provider Msg ID</th>
                <th className="pb-3 pr-2 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pl-2">{getStatusBadge(log.status)}</td>
                  <td className="py-3 px-3">
                    <div>
                      <p className="font-bold text-slate-900">{log.recipientName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{log.recipientContact}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                      {getChannelIcon(log.channel)}
                      <span>{log.channel}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700 max-w-xs truncate">
                    {log.campaign}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    {log.providerMsgId}
                  </td>
                  <td className="py-3 pr-2 text-right font-mono text-[11px] text-slate-500 tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
