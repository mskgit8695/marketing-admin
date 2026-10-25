import {
  History,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSuperAdminAuditLogs } from "../hooks/useSuperAdmin";

export function SuperAdminAuditLogsView() {
  const { data: logs = [], isLoading } = useSuperAdminAuditLogs();

  return (
    <div className="space-y-6 flex-1">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <History className="w-5 h-5 text-amber-400" />
          Global Platform Security Audit Trail ({logs.length})
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically signed, tamper-evident security record of all root operations, tenant overrides, and maintenance events.
        </p>
      </div>

      <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
        <CardHeader className="p-4 border-b border-slate-800/80">
          <CardTitle className="text-sm font-bold text-white tracking-tight">
            Root Operations Trail
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading platform logs...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 tracking-wider">
                    <th className="py-3 px-5">TIMESTAMP</th>
                    <th className="py-3 px-4">SUPER ADMIN ACTOR</th>
                    <th className="py-3 px-4">ACTION</th>
                    <th className="py-3 px-4">TARGET TENANT / SYSTEM</th>
                    <th className="py-3 px-4">IP ADDRESS</th>
                    <th className="py-3 px-4">DETAILS</th>
                    <th className="py-3 px-5 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-5 font-mono whitespace-nowrap text-slate-300">
                        {new Date(log.timestamp).toLocaleTimeString()}
                        <span className="block text-[10px] text-slate-500">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-white font-semibold whitespace-nowrap">
                        {log.adminName}
                        <span className="block text-[10px] text-slate-500 font-normal">
                          {log.adminEmail}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-[11px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-amber-300">
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-medium whitespace-nowrap">
                        {log.targetTenant}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {log.ipAddress}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 text-[11px] max-w-sm">
                        {log.details}
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <Badge
                          variant={log.status === "success" ? "success" : "destructive"}
                          className="capitalize text-[10px] font-bold"
                        >
                          <ShieldCheck className="w-3 h-3 mr-1 inline" />
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
