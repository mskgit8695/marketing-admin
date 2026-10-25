import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { Plus, Trash2, Sparkles, Filter } from "lucide-react";
import { useEstimateReach } from "../hooks/useSegments";
import type { SegmentRule, RuleField, RuleOperator } from "@/services/api/segments.service";

interface SegmentRuleBuilderProps {
  conjunction: "AND" | "OR";
  rules: SegmentRule[];
  onChangeConjunction: (c: "AND" | "OR") => void;
  onChangeRules: (rules: SegmentRule[]) => void;
}

const FIELD_OPTIONS: { label: string; value: RuleField }[] = [
  { label: "Lead Score (0-100)", value: "score" },
  { label: "Lifecycle Stage", value: "lifecycle_stage" },
  { label: "Channel Preference", value: "channel_preference" },
  { label: "Country / Region", value: "country" },
  { label: "Contact Tag", value: "tag" },
  { label: "Total Lifetime Spend ($)", value: "total_spend" },
  { label: "Days Since Last Active", value: "last_activity" },
];

const OPERATOR_OPTIONS: { label: string; value: RuleOperator }[] = [
  { label: "equals", value: "equals" },
  { label: "does not equal", value: "not_equals" },
  { label: "greater than (>)", value: "greater_than" },
  { label: "less than (<)", value: "less_than" },
  { label: "contains", value: "contains" },
  { label: "is in list", value: "in_list" },
];

export function SegmentRuleBuilder({
  conjunction,
  rules,
  onChangeConjunction,
  onChangeRules,
}: SegmentRuleBuilderProps) {
  const estimateMutation = useEstimateReach();
  const [estimatedCount, setEstimatedCount] = useState<number>(2450);

  useEffect(() => {
    if (rules.length > 0) {
      estimateMutation.mutate(
        { conjunction, rules },
        {
          onSuccess: (count) => setEstimatedCount(count),
        }
      );
    } else {
      setEstimatedCount(0);
    }
  }, [conjunction, rules]);

  const handleAddRule = () => {
    const newRule: SegmentRule = {
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      field: "score",
      operator: "greater_than",
      value: "75",
    };
    onChangeRules([...rules, newRule]);
  };

  const handleUpdateRule = (id: string, updates: Partial<SegmentRule>) => {
    onChangeRules(
      rules.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const handleRemoveRule = (id: string) => {
    if (rules.length > 1) {
      onChangeRules(rules.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Conjunction Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Targeting Criteria Logic:
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
          <button
            type="button"
            onClick={() => onChangeConjunction("AND")}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              conjunction === "AND"
                ? "bg-primary text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            Match ALL (AND)
          </button>
          <button
            type="button"
            onClick={() => onChangeConjunction("OR")}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              conjunction === "OR"
                ? "bg-primary text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            Match ANY (OR)
          </button>
        </div>
      </div>

      {/* Rules Rows */}
      <div className="space-y-2.5">
        {rules.map((rule, idx) => (
          <div
            key={rule.id}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs"
          >
            <div className="text-xs font-mono font-bold text-slate-400 w-6 text-center">
              {idx === 0 ? "IF" : conjunction}
            </div>

            {/* Field */}
            <div className="flex-1 min-w-[160px]">
              <select
                value={rule.field}
                onChange={(e) =>
                  handleUpdateRule(rule.id, {
                    field: e.target.value as RuleField,
                  })
                }
                className="w-full text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {FIELD_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Operator */}
            <div className="min-w-[130px]">
              <select
                value={rule.operator}
                onChange={(e) =>
                  handleUpdateRule(rule.id, {
                    operator: e.target.value as RuleOperator,
                  })
                }
                className="w-full text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {OPERATOR_OPTIONS.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Value */}
            <div className="flex-1 min-w-[140px]">
              <input
                type="text"
                value={rule.value}
                onChange={(e) =>
                  handleUpdateRule(rule.id, { value: e.target.value })
                }
                placeholder="Value..."
                className="w-full text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Remove */}
            <div className="sm:self-center">
              <button
                type="button"
                onClick={() => handleRemoveRule(rule.id)}
                disabled={rules.length <= 1}
                className="p-2 text-slate-400 hover:text-rose-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                title="Remove condition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer: Add Rule & Dynamic Audience Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddRule}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Condition
        </Button>

        {/* Live Audience Counter Preview */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-300">
          <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
          <span className="text-xs font-medium">Estimated Audience Reach:</span>
          <span className="text-xs font-bold font-mono">
            ~{estimatedCount.toLocaleString()} contacts
          </span>
        </div>
      </div>
    </div>
  );
}
