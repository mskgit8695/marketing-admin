import { useState } from "react";
import { Modal, Input, Textarea, Button } from "@/components/ui";
import { Mail, MessageSquare, Phone } from "lucide-react";
import type {
  CreateTemplateInput,
  TemplateCategory,
} from "@/services/api/templates.service";
import type { ChannelType } from "@/types";

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTemplateInput) => void;
  isSubmitting?: boolean;
}

export function TemplateEditorModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: TemplateEditorModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [channel, setChannel] = useState<ChannelType>("email");
  const [category, setCategory] = useState<TemplateCategory>("marketing");
  const [subjectOrHeader, setSubjectOrHeader] = useState("");
  const [content, setContent] = useState("");

  const insertToken = (token: string) => {
    setContent((prev) => `${prev} ${token}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      channel,
      category,
      subjectOrHeader: subjectOrHeader.trim(),
      content: content.trim(),
    });

    // Reset
    setName("");
    setDescription("");
    setSubjectOrHeader("");
    setContent("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Marketing Template"
      description="Create reusable message templates with variable tokens for campaigns and automated flows."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Template Name"
              placeholder="e.g. VIP Early Access Notification"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TemplateCategory)}
              className="w-full text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="marketing">Marketing Broadcast</option>
              <option value="transactional">Transactional</option>
              <option value="onboarding">Onboarding</option>
              <option value="alert">System Alert</option>
            </select>
          </div>
        </div>

        {/* Channel Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Channel Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setChannel("email")}
              className={`p-3 rounded-xl border text-center transition-all ${
                channel === "email"
                  ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold ring-2 ring-blue-500/20"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              <Mail className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Email</span>
            </button>

            <button
              type="button"
              onClick={() => setChannel("whatsapp")}
              className={`p-3 rounded-xl border text-center transition-all ${
                channel === "whatsapp"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/20"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              <MessageSquare className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setChannel("sms")}
              className={`p-3 rounded-xl border text-center transition-all ${
                channel === "sms"
                  ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold ring-2 ring-amber-500/20"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              <Phone className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">SMS</span>
            </button>
          </div>
        </div>

        <div>
          <Input
            label={channel === "email" ? "Subject Line" : "Header / Identifier"}
            placeholder="e.g. Special Announcement for {{company}}"
            value={subjectOrHeader}
            onChange={(e) => setSubjectOrHeader(e.target.value)}
            required
          />
        </div>

        <div>
          <Input
            label="Internal Description"
            placeholder="Describe when and where to use this template..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Variable Tokens Helper */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Insert Variable Tokens
            </label>
            <span className="text-[11px] text-slate-400">
              Click to insert into message body
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "{{firstName}}",
              "{{lastName}}",
              "{{company}}",
              "{{orderId}}",
              "{{discountCode}}",
              "{{link}}",
            ].map((token) => (
              <button
                key={token}
                type="button"
                onClick={() => insertToken(token)}
                className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                + {token}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Textarea
            label="Template Content"
            placeholder="Write your template copy here with variable tokens..."
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Save Template
          </Button>
        </div>
      </form>
    </Modal>
  );
}
