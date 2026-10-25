import { useState } from "react";
import {
  Globe,
  Plus,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  Clock,
  Loader2,
} from "lucide-react";
import type { SendingDomain, DomainDnsRecord } from "@/types/settings";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Badge,
  toast,
} from "@/components/ui";
import {
  useSendingDomains,
  useAddSendingDomain,
  useVerifyDomainDns,
  useDeleteSendingDomain,
} from "../hooks/useSettings";
import { SettingsNavHeader } from "../components/SettingsNavHeader";
import { AddDomainModal } from "../components/AddDomainModal";

export function DomainsSettingsView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { data: domains = [], isLoading } = useSendingDomains();
  const addDomainMutation = useAddSendingDomain();
  const verifyMutation = useVerifyDomainDns();
  const deleteMutation = useDeleteSendingDomain();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success("Copied to Clipboard", {
      description: `${label} value copied.`,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    try {
      await verifyMutation.mutateAsync(id);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDelete = (id: string, domain: string) => {
    if (window.confirm(`Are you sure you want to delete sending domain "${domain}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const renderDnsRows = (dom: SendingDomain) => {
    const records: { label: string; record: DomainDnsRecord }[] = [
      { label: "DKIM Verification", record: dom.dkimRecord },
      { label: "SPF Authentication", record: dom.spfRecord },
      { label: "DMARC Policy", record: dom.dmarcRecord },
      { label: "MX Routing", record: dom.mxRecord },
    ];

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[18%]">Record Type</TableHead>
            <TableHead className="w-[32%]">Host / Name</TableHead>
            <TableHead className="w-[36%]">Value / Target</TableHead>
            <TableHead className="w-[14%] text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((r, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-slate-800 block">
                    {r.record.type}
                  </span>
                  <span className="text-[10px] text-slate-500">{r.label}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 group">
                  <span className="truncate max-w-[200px]" title={r.record.name}>
                    {r.record.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(r.record.name, "Host Name")}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
                  >
                    {copiedKey === r.record.name ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 group">
                  <span className="truncate max-w-[220px]" title={r.record.value}>
                    {r.record.value}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(r.record.value, "Record Value")}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
                  >
                    {copiedKey === r.record.value ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <Badge
                  variant={r.record.status === "verified" ? "success" : "warning"}
                  size="sm"
                  dot
                >
                  {r.record.status.toUpperCase()}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <SettingsNavHeader
        title="Custom Sending Domains & DNS"
        description="Verify DKIM, SPF, DMARC, and MX records on your DNS provider to maximize email inbox deliverability."
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Registered Sending Domains
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deliver branded transactional and broadcast emails with authenticated domain signatures.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Sending Domain
        </Button>
      </div>

      {/* Domains List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : domains.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-12 text-center">
          <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-900">No Domains Configured</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Add your company domain or marketing subdomain to generate DKIM and SPF records.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add First Domain
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {domains.map((dom) => {
            const isVerified = dom.status === "verified";
            const isVerifying = verifyingId === dom.id;

            return (
              <div
                key={dom.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Domain Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 font-mono">
                          {dom.domain}
                        </h3>
                        <Badge variant={isVerified ? "success" : "warning"} size="sm" dot>
                          {isVerified ? "DNS VERIFIED" : "PENDING PROPAGATION"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Last pinged: {new Date(dom.lastCheckedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerify(dom.id)}
                      disabled={isVerifying}
                      className="text-xs"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Checking DNS...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                          Verify DNS Now
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      onClick={() => handleDelete(dom.id, dom.domain)}
                      title="Remove domain"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* DNS Records Table */}
                <div className="pt-1">{renderDnsRows(dom)}</div>
              </div>
            );
          })}
        </div>
      )}

      <AddDomainModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (domain) => addDomainMutation.mutateAsync(domain)}
      />
    </div>
  );
}
