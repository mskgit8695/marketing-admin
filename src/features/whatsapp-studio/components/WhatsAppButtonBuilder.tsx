import { Button } from "@/components/ui";
import { Plus, Trash2 } from "lucide-react";
import type { WhatsAppButton, WhatsAppButtonType } from "@/services/api/whatsapp-studio.service";

interface WhatsAppButtonBuilderProps {
  buttons: WhatsAppButton[];
  onChange: (buttons: WhatsAppButton[]) => void;
}

export function WhatsAppButtonBuilder({
  buttons,
  onChange,
}: WhatsAppButtonBuilderProps) {
  const handleAddButton = () => {
    if (buttons.length >= 3) return;
    const newBtn: WhatsAppButton = {
      id: `btn-${Date.now()}`,
      type: "url",
      text: "Visit Website",
      value: "https://app.omniflow.ai",
    };
    onChange([...buttons, newBtn]);
  };

  const handleUpdate = (id: string, updates: Partial<WhatsAppButton>) => {
    onChange(buttons.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const handleRemove = (id: string) => {
    onChange(buttons.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Interactive Action Buttons ({buttons.length}/3)
          </label>
          <p className="text-[11px] text-slate-400">
            CTA Website Links or Quick-Reply response chips.
          </p>
        </div>

        {buttons.length < 3 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddButton}
            className="text-xs h-7 px-2"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Button
          </Button>
        )}
      </div>

      {buttons.length === 0 ? (
        <div className="p-3 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
          No action buttons added yet. Click &quot;Add Button&quot; to configure CTAs.
        </div>
      ) : (
        <div className="space-y-2.5">
          {buttons.map((btn, index) => (
            <div
              key={btn.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Button #{index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemove(btn.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Button Type */}
                <div>
                  <select
                    value={btn.type}
                    onChange={(e) =>
                      handleUpdate(btn.id, {
                        type: e.target.value as WhatsAppButtonType,
                      })
                    }
                    className="w-full text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="url">CTA Website Link</option>
                    <option value="quick_reply">Quick-Reply Text</option>
                  </select>
                </div>

                {/* Button Label Text */}
                <div>
                  <input
                    type="text"
                    maxLength={25}
                    value={btn.text}
                    onChange={(e) => handleUpdate(btn.id, { text: e.target.value })}
                    placeholder="Label (max 25 chars)..."
                    className="w-full text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Button Value / Target URL */}
                <div>
                  <input
                    type="text"
                    value={btn.value}
                    onChange={(e) =>
                      handleUpdate(btn.id, { value: e.target.value })
                    }
                    placeholder={
                      btn.type === "url"
                        ? "https://..."
                        : "Payload identifier..."
                    }
                    className="w-full text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
