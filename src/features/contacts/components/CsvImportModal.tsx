import { useState } from "react";
import { Modal, Button, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";
import { Upload, FileSpreadsheet, Check, ArrowRight, Download, CheckCircle2 } from "lucide-react";
import type { CreateContactInput } from "@/services/api/contacts.service";

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: CreateContactInput[]) => void;
  isImporting?: boolean;
}

const sampleRows: CreateContactInput[] = [
  {
    firstName: "Amara",
    lastName: "Okafor",
    email: "amara.okafor@lagostech.ng",
    phone: "+234 802 123 4567",
    companyName: "Lagos Tech Ventures",
    status: "active",
    source: "Import CSV",
    tags: ["Tech", "VIP"],
  },
  {
    firstName: "Mateo",
    lastName: "Silva",
    email: "mateo.silva@saopauloinnov.br",
    phone: "+55 11 98765 4321",
    companyName: "São Paulo Innovations",
    status: "active",
    source: "Import CSV",
    tags: ["Enterprise", "Lead"],
  },
  {
    firstName: "Ingrid",
    lastName: "Lindqvist",
    email: "i.lindqvist@nordicretail.se",
    phone: "+46 8 123 4567",
    companyName: "Nordic Retail Group",
    status: "active",
    source: "Import CSV",
    tags: ["Ecommerce", "Newsletter"],
  },
];

export function CsvImportModal({
  isOpen,
  onClose,
  onImport,
  isImporting,
}: CsvImportModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fileName, setFileName] = useState<string | null>("leads_export_q4.csv");

  const resetState = () => {
    setStep(1);
    setFileName("leads_export_q4.csv");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleStartImport = () => {
    onImport(sampleRows);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Contacts via CSV"
      description="Upload a CSV spreadsheet with contact email addresses, phone numbers, and custom tags."
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Step {step} of 3</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClose} disabled={isImporting}>
              Cancel
            </Button>
            {step === 1 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep(2)}
                className="gap-1.5"
              >
                <span>Continue to Column Mapping</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {step === 2 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep(3)}
                className="gap-1.5"
              >
                <span>Preview Data</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {step === 3 && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleStartImport}
                isLoading={isImporting}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="h-4 w-4" />
                <span>Import 3 Contacts</span>
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="py-2 space-y-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs">
          <span
            className={`font-semibold ${
              step >= 1 ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            1. Upload File
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`font-semibold ${
              step >= 2 ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            2. Map Headers
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`font-semibold ${
              step >= 3 ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            3. Review & Import
          </span>
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/20 hover:bg-indigo-50/40 transition-colors rounded-2xl p-8 text-center cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Drag and drop your CSV file here
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Supports .csv and .tsv files up to 25MB (max 50,000 contacts per batch).
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  {fileName}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 text-slate-600">
                <Download className="h-4 w-4 text-slate-400" />
                <span>Need a pre-formatted template?</span>
              </div>
              <button
                type="button"
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                onClick={() => alert("Sample CSV template downloaded.")}
              >
                Download sample.csv
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Mapping */}
        {step === 2 && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-500">
              Match the detected columns from <span className="font-semibold text-slate-700">{fileName}</span> to OmniFlow AI fields:
            </p>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
              {[
                { csvCol: "first_name", target: "First Name", auto: true },
                { csvCol: "last_name", target: "Last Name", auto: true },
                { csvCol: "contact_email", target: "Email Address", auto: true },
                { csvCol: "mobile_phone", target: "Phone Number", auto: true },
                { csvCol: "org_name", target: "Company Name", auto: true },
                { csvCol: "tags_list", target: "Tags", auto: true },
              ].map((map, idx) => (
                <div key={idx} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" size="sm" className="font-mono text-[11px]">
                      {map.csvCol}
                    </Badge>
                    <span className="text-slate-400">maps to</span>
                    <span className="font-semibold text-slate-800">{map.target}</span>
                  </div>
                  <Badge variant="success" size="sm" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Auto-matched
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Preview: First 3 rows ready for import</span>
              <Badge variant="primary" size="sm">3 Valid Rows</Badge>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleRows.map((row, idx) => (
                    <TableRow key={idx} className="text-xs">
                      <TableCell className="font-semibold text-slate-800">
                        {row.firstName} {row.lastName}
                      </TableCell>
                      <TableCell className="text-slate-600">{row.email}</TableCell>
                      <TableCell className="text-slate-600">{row.phone}</TableCell>
                      <TableCell className="text-slate-600">{row.companyName}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {row.tags.map((t, i) => (
                            <Badge key={i} variant="default" size="sm" className="text-[10px]">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
