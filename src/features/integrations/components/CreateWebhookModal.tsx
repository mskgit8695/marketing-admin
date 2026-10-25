import { useState } from "react";
import { Webhook, Plus, Loader2 } from "lucide-react";
import type { CreateWebhookInput, WebhookEventSubscription } from "@/types/integrations";
import { Modal, Button } from "@/components/ui";

interface CreateWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateWebhookInput) => Promise<unknown>;
}

const AVAILABLE_EVENTS: { id: WebhookEventSubscription; label: string; desc: string }[] = [
  {
    id: "contact.created",
    label: "contact.created",
    desc: "Dispatched when a new contact, lead, or subscriber joins the workspace.",
  },
  {
    id: "contact.updated",
    label: "contact.updated",
    desc: "Dispatched when custom properties, tags, or consent stages change.",
  },
  {
    id: "campaign.sent",
    label: "campaign.sent",
    desc: "Dispatched when an email, SMS, or WhatsApp campaign blast begins execution.",
  },
  {
    id: "message.delivered",
    label: "message.delivered",
    desc: "Dispatched upon carrier or gateway delivery confirmation receipt (DLR).",
  },
  {
    id: "message.clicked",
    label: "message.clicked",
    desc: "Dispatched when a recipient clicks a tracked short-link in any broadcast.",
  },
  {
    id: "message.bounced",
    label: "message.bounced",
    desc: "Dispatched on hard bounce, spam complaint, or telecom routing error.",
  },
  {
    id: "workflow.completed",
    label: "workflow.completed",
    desc: "Dispatched when a contact exits all branches of an automated workflow.",
  },
];

export function CreateWebhookModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateWebhookModalProps) {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<WebhookEventSubscription[]>([
    "contact.created",
    "message.delivered",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleEvent = (eventId: WebhookEventSubscription) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((e) => e !== eventId) : [...prev, eventId]
    );
  };

  const selectAll = () => {
    setSelectedEvents(AVAILABLE_EVENTS.map((e) => e.id));
  };

  const clearAll = () => {
    setSelectedEvents([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("Endpoint URL must begin with https:// or http://");
      return;
    }

    if (selectedEvents.length === 0) {
      setError("Please select at least one event subscription.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        url,
        description,
        events: selectedEvents,
      });
      setUrl("");
      setDescription("");
      setSelectedEvents(["contact.created", "message.delivered"]);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create webhook endpoint.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Webhook className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-semibold text-slate-900 leading-none">
              Register Webhook Endpoint
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure destination URL and event triggers for outbound dispatches
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Destination URL */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Endpoint URL <span className="text-rose-500">*</span>
          </label>
          <input
            type="url"
            placeholder="https://api.yourdomain.com/v1/omni-webhooks"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <p className="text-[11px] text-slate-400">
            HTTPS endpoints will receive POST requests with HMAC-SHA256 signature headers.
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Description / Identifier <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Segment CDP Event Stream or Slack Alert Bot"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Events Subscription Checklist */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Event Subscriptions ({selectedEvents.length} selected)
            </label>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={selectAll}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Select All
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={clearAll}
                className="text-slate-500 hover:text-slate-700"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="border border-slate-200/90 rounded-xl divide-y divide-slate-100 max-h-56 overflow-y-auto bg-slate-50/50">
            {AVAILABLE_EVENTS.map((ev) => {
              const isChecked = selectedEvents.includes(ev.id);
              return (
                <label
                  key={ev.id}
                  className="flex items-start gap-3 p-2.5 hover:bg-slate-100/60 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleEvent(ev.id)}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="space-y-0.5">
                    <span className="font-mono text-xs font-semibold text-slate-800">
                      {ev.label}
                    </span>
                    <p className="text-[11px] text-slate-500">{ev.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="text-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Register Endpoint
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
