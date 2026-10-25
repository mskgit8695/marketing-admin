import { useState } from "react";
import { Button, ConfirmDialog, Modal, Input } from "@/components/ui";
import { Tag, Trash2, Download, X, CheckSquare } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkTag: (tags: string[]) => void;
  onExportSelected: () => void;
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkTag,
  onExportSelected,
}: BulkActionBarProps) {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");

  if (selectedCount === 0) return null;

  const handleApplyTags = () => {
    if (!tagInput.trim()) return;
    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length > 0) {
      onBulkTag(tags);
      setTagInput("");
      setIsTagModalOpen(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
          <div className="h-5 w-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <CheckSquare className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-200">
            {selectedCount} contact{selectedCount > 1 ? "s" : ""} selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsTagModalOpen(true)}
            className="text-xs text-slate-300 hover:text-white hover:bg-slate-800 h-8 gap-1.5"
          >
            <Tag className="h-3.5 w-3.5 text-indigo-400" />
            <span>Add Tags</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onExportSelected}
            className="text-xs text-slate-300 hover:text-white hover:bg-slate-800 h-8 gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Export</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsConfirmDeleteOpen(true)}
            className="text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 h-8 gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-400" />
            <span>Delete</span>
          </Button>
        </div>

        <button
          onClick={onClearSelection}
          className="ml-2 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Clear selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => {
          onBulkDelete();
          setIsConfirmDeleteOpen(false);
        }}
        title={`Delete ${selectedCount} contacts`}
        description={`Are you sure you want to permanently delete these ${selectedCount} contacts? This action cannot be undone.`}
        confirmText="Delete Contacts"
        variant="destructive"
      />

      <Modal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        title="Add tags to selected contacts"
        description="Enter comma-separated tags to assign to the selected contacts."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsTagModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApplyTags} disabled={!tagInput.trim()}>
              Apply Tags
            </Button>
          </div>
        }
      >
        <div className="space-y-3 py-2">
          <Input
            label="Tag Names"
            placeholder="e.g. VIP, Q4 Campaign, Webinar Attendee"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            helperText="Separate multiple tags with commas."
            autoFocus
          />
        </div>
      </Modal>
    </>
  );
}
