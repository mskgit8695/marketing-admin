import { Button, Badge } from "@/components/ui";
import { UserPlus, Upload, Download } from "lucide-react";

interface ContactsHeaderProps {
  totalCount: number;
  onAddContact: () => void;
  onImportCsv: () => void;
  onExport: () => void;
}

export function ContactsHeader({
  totalCount,
  onAddContact,
  onImportCsv,
  onExport,
}: ContactsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Contacts</h1>
          <Badge variant="primary" size="sm" className="font-semibold">
            {totalCount.toLocaleString()} Total
          </Badge>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Manage omnichannel marketing contacts, track engagement timelines, and segment audiences.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          leftIcon={<Download className="h-4 w-4 text-slate-500" />}
          className="text-slate-700 hover:text-slate-900"
        >
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onImportCsv}
          leftIcon={<Upload className="h-4 w-4 text-slate-500" />}
          className="text-slate-700 hover:text-slate-900"
        >
          Import CSV
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onAddContact}
          leftIcon={<UserPlus className="h-4 w-4" />}
          className="shadow-sm font-semibold"
        >
          Add Contact
        </Button>
      </div>
    </div>
  );
}
