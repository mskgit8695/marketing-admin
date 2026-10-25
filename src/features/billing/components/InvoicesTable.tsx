import { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import type { InvoiceRecord } from "@/types/billing";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Button,
} from "@/components/ui";

interface InvoicesTableProps {
  invoices: InvoiceRecord[];
  onDownload: (invoiceId: string) => Promise<unknown>;
}

export function InvoicesTable({ invoices, onDownload }: InvoicesTableProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (id: string) => {
    setDownloadingId(id);
    try {
      await onDownload(id);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            Billing History & Invoices
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Download compliant tax receipts and itemized PDF invoices for accounting.
          </p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Invoice Number</TableHead>
            <TableHead className="w-[30%]">Billing Period</TableHead>
            <TableHead className="w-[15%]">Amount</TableHead>
            <TableHead className="w-[15%] text-center">Status</TableHead>
            <TableHead className="w-[12%]">Date Paid</TableHead>
            <TableHead className="w-[8%] text-right">PDF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(invoices || []).map((inv) => {
            const isDownloading = downloadingId === inv.id;
            return (
              <TableRow key={inv.id}>
                <TableCell>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {inv.invoiceNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-600">{inv.billingPeriod}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    ${inv.amount.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      inv.status === "paid"
                        ? "success"
                        : inv.status === "pending"
                        ? "warning"
                        : "destructive"
                    }
                    size="sm"
                    dot
                  >
                    {inv.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-500">
                    {new Date(inv.paidAt).toLocaleDateString([], {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[11px] px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    onClick={() => handleDownload(inv.id)}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 mr-1" />
                        PDF
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
