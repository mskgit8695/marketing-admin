import { Badge } from "@/components/ui";
import { MessageSquare, AlertTriangle, Info } from "lucide-react";

interface SmsSegmentCounterProps {
  messageText: string;
  includeOptOut: boolean;
}

export function SmsSegmentCounter({
  messageText,
  includeOptOut,
}: SmsSegmentCounterProps) {
  const fullText = includeOptOut
    ? `${messageText} Reply STOP to opt out`
    : messageText;

  // Detect Unicode (emojis, non-ASCII)
  const isUnicode = /[^\u0000-\u007F]/.test(fullText);
  const segmentLimit = isUnicode ? 70 : 160;
  const length = fullText.length;
  const segments = Math.max(1, Math.ceil(length / segmentLimit));

  const charsInCurrentSegment = length % segmentLimit || (length > 0 ? segmentLimit : 0);
  const remainingInSegment = segmentLimit - (length % segmentLimit);
  const pctOfSegment = Math.min(100, Math.round((charsInCurrentSegment / segmentLimit) * 100));

  return (
    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <MessageSquare className="w-3.5 h-3.5 text-primary" />
          <span>Real-Time Segment Telemetry:</span>
        </div>

        <Badge
          variant={isUnicode ? "warning" : "success"}
          className="text-[10px] font-mono font-bold"
        >
          {isUnicode ? "UCS-2 (Unicode)" : "GSM-7 Standard"}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-900 dark:text-white">
            {length} chars used
          </span>
          <span className="text-slate-500">
            {segments} SMS Segment{segments > 1 ? "s" : ""} ({length > 0 ? remainingInSegment : segmentLimit} chars left in seg #{segments})
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isUnicode ? "bg-amber-500" : "bg-emerald-500"
            }`}
            style={{ width: `${pctOfSegment || 1}%` }}
          />
        </div>
      </div>

      {/* Explanation alert */}
      {isUnicode ? (
        <div className="flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            Unicode characters or emojis detected. Message will be encoded in UCS-2 (70 chars/segment).
          </span>
        </div>
      ) : (
        <div className="flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            Standard GSM-7 encoding (160 chars/segment). Lowest carrier billing cost.
          </span>
        </div>
      )}
    </div>
  );
}
