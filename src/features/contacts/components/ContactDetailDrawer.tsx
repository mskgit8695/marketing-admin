import {
  Drawer,
  Avatar,
  Badge,
  Button,
  Skeleton,
} from "@/components/ui";
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Tag,
  Edit2,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Send,
  MousePointerClick,
  FileText,
} from "lucide-react";
import type { Contact } from "@/types";
import { useContactTimeline, useContactStats } from "../hooks/useContacts";
import type { TimelineEventType } from "@/services/api/contacts.service";

interface ContactDetailDrawerProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
}

export function ContactDetailDrawer({
  contact,
  isOpen,
  onClose,
  onEdit,
}: ContactDetailDrawerProps) {
  const { data: timeline = [], isLoading: isLoadingTimeline } = useContactTimeline(contact?.id);
  const { data: stats, isLoading: isLoadingStats } = useContactStats(contact?.id);

  if (!contact) return null;

  const fullName = `${contact.firstName} ${contact.lastName}`.trim();

  const getTimelineIcon = (type: TimelineEventType, channel?: string) => {
    if (channel === "whatsapp") {
      return (
        <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <MessageSquare className="h-3.5 w-3.5" />
        </div>
      );
    }
    if (channel === "sms") {
      return (
        <div className="h-7 w-7 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
          <Send className="h-3.5 w-3.5" />
        </div>
      );
    }
    if (type === "email_opened") {
      return (
        <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          <Mail className="h-3.5 w-3.5" />
        </div>
      );
    }
    if (type === "sms_clicked" || type === "email_clicked") {
      return (
        <div className="h-7 w-7 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
          <MousePointerClick className="h-3.5 w-3.5" />
        </div>
      );
    }
    if (type === "lead_qualified") {
      return (
        <div className="h-7 w-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      );
    }
    return (
      <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
        <FileText className="h-3.5 w-3.5" />
      </div>
    );
  };

  const formatEventDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Contact Profile"
      description={`ID: ${contact.id}`}
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(contact)}
            className="gap-1.5"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Contact</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-6 pb-4">
        {/* Header Profile Card */}
        <div className="flex items-start justify-between bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-3.5">
            <Avatar
              src={contact.avatarUrl}
              name={fullName}
              size="lg"
              className="border-2 border-white shadow-sm ring-1 ring-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">{fullName}</h3>
                <Badge
                  variant={contact.status === "active" ? "success" : "default"}
                  size="sm"
                  dot
                >
                  {contact.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{contact.email}</p>
              {contact.companyName && (
                <div className="flex items-center gap-1 text-xs text-slate-600 font-medium mt-1">
                  <Building className="h-3 w-3 text-slate-400" />
                  <span>{contact.companyName}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Engagement Stats Grid */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Engagement Telemetry
          </h4>
          {isLoadingStats ? (
            <div className="grid grid-cols-3 gap-2.5">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl text-center">
                <span className="text-[11px] text-slate-500 block font-medium">Campaigns</span>
                <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                  {stats?.totalCampaigns ?? 0}
                </span>
              </div>
              <div className="bg-indigo-50/40 border border-indigo-100 p-3 rounded-xl text-center">
                <span className="text-[11px] text-indigo-700 block font-medium">Open Rate</span>
                <span className="text-lg font-bold text-indigo-700 mt-0.5 block">
                  {stats?.openRate ?? 0}%
                </span>
              </div>
              <div className="bg-emerald-50/40 border border-emerald-100 p-3 rounded-xl text-center">
                <span className="text-[11px] text-emerald-700 block font-medium">Click Rate</span>
                <span className="text-lg font-bold text-emerald-700 mt-0.5 block">
                  {stats?.clickRate ?? 0}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Details & Channel Opt-in
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200/70 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Direct Phone</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-800 mt-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{contact.phone || "Not provided"}</span>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200/70 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Acquisition Source</span>
              <div className="font-medium text-slate-800 mt-1">
                {contact.source || "Manual"}
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200/70 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Member Since</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-800 mt-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {new Date(contact.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200/70 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Channels</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> Email
                </span>
                {contact.phone && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" /> WhatsApp
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span>Assigned Tags</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {contact.tags.map((tag, idx) => (
              <Badge key={idx} variant="primary" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Omnichannel Activity Stream
            </h4>
            <span className="text-[11px] text-slate-400">{timeline.length} events</span>
          </div>

          {isLoadingTimeline ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timeline.map((event) => (
                <div key={event.id} className="relative group">
                  <div className="absolute -left-6 top-0">
                    {getTimelineIcon(event.type, event.channel)}
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900">
                        {event.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatEventDate(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
