import {
  AlertTriangle,
  RotateCw,
  Trash2,
  CheckCircle2,
  Mail,
  MessageSquare,
  Smartphone,
  Webhook,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  useFailedJobs,
  useRetryFailedJob,
  useRetryAllFailedJobs,
  usePurgeFailedJobs,
} from "../hooks/useSuperAdmin";

export function SuperAdminFailedJobsView() {
  const { data: failedJobs = [], isLoading } = useFailedJobs();
  const retryJobMutation = useRetryFailedJob();
  const retryAllMutation = useRetryAllFailedJobs();
  const purgeMutation = usePurgeFailedJobs();

  return (
    <div className="space-y-6 flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Dead-Letter Queue (DLQ) Inspector
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Failed background worker dispatches, third-party timeout rejects, and manual task re-drives.
          </p>
        </div>
        {failedJobs.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => purgeMutation.mutate()}
              isLoading={purgeMutation.isPending}
              className="text-xs font-semibold border-rose-500/30 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 h-8"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Purge Queue
            </Button>
            <Button
              size="sm"
              onClick={() => retryAllMutation.mutate()}
              isLoading={retryAllMutation.isPending}
              className="text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 h-8 shadow-md shadow-amber-500/10"
            >
              <RotateCw className="w-3.5 h-3.5 mr-1.5" />
              Retry All ({failedJobs.length})
            </Button>
          </div>
        )}
      </div>

      {/* DLQ Status Banner */}
      {failedJobs.length > 0 ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-bold text-rose-100">
              {failedJobs.length} Unresolved Failed Worker Executions
            </p>
            <p className="text-rose-200/80 leading-relaxed">
              These tasks exceeded the 3-attempt exponential backoff ceiling and were shunted to the dead-letter queue to preserve queue throughput. Inspect error logs and trigger manual re-drive.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-emerald-100">Queue Operating Normally</h3>
          <p className="text-xs text-emerald-300/80">
            No failed jobs present in the BullMQ dead-letter queue. All dispatches processed smoothly.
          </p>
        </div>
      )}

      {/* Jobs Table */}
      {failedJobs.length > 0 && (
        <Card className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xs">
          <CardHeader className="p-4 border-b border-slate-800/80">
            <CardTitle className="text-sm font-bold text-white tracking-tight">
              Failed Dispatch Records
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading queue...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 tracking-wider">
                      <th className="py-3 px-5">JOB ID & QUEUE</th>
                      <th className="py-3 px-4">WORKSPACE</th>
                      <th className="py-3 px-4">CHANNEL</th>
                      <th className="py-3 px-4">RECIPIENT</th>
                      <th className="py-3 px-4">FAILURE REASON</th>
                      <th className="py-3 px-4">ATTEMPTS</th>
                      <th className="py-3 px-5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {failedJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-5 font-mono">
                          <span className="font-bold text-white block">{job.id}</span>
                          <span className="text-[10px] text-slate-500">{job.queueName}</span>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-300">
                          {job.workspaceName}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="flex items-center gap-1.5 text-slate-300 capitalize text-xs">
                            {job.channel === "email" && <Mail className="w-3.5 h-3.5 text-blue-400" />}
                            {job.channel === "whatsapp" && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                            {job.channel === "sms" && <Smartphone className="w-3.5 h-3.5 text-amber-400" />}
                            {job.channel === "webhook" && <Webhook className="w-3.5 h-3.5 text-purple-400" />}
                            {job.channel}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                          {job.recipient}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <span className="text-[11px] text-rose-300 font-mono line-clamp-2">
                            {job.errorReason}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge variant="destructive" className="font-mono text-[10px]">
                            {job.attempts}/{job.maxAttempts}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => retryJobMutation.mutate(job.id)}
                            isLoading={retryJobMutation.isPending}
                            className="h-7 px-2.5 text-xs text-amber-400 hover:text-amber-300 hover:bg-slate-800 font-semibold"
                          >
                            <RotateCw className="w-3 h-3 mr-1" />
                            Retry
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
