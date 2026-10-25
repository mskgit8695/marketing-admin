import { type ReactNode } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle, Info } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "primary";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  isLoading = false,
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnOutsideClick={!isLoading}
      showCloseButton={!isLoading}
    >
      <div className="flex items-start gap-4">
        <div
          className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${
            isDestructive
              ? "bg-rose-50 text-rose-600 border border-rose-100"
              : "bg-indigo-50 text-indigo-600 border border-indigo-100"
          }`}
        >
          {isDestructive ? <AlertTriangle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 leading-snug">{title}</h4>
          <div className="text-xs text-slate-500 leading-relaxed">{description}</div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={onClose}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          variant={isDestructive ? "destructive" : "primary"}
          size="sm"
          isLoading={isLoading}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
