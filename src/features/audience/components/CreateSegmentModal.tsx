import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Textarea, Button } from "@/components/ui";
import { SegmentRuleBuilder } from "./SegmentRuleBuilder";
import type { CreateSegmentInput, SegmentRule } from "@/services/api/segments.service";

const segmentSchema = z.object({
  name: z.string().min(2, "Segment name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

type SegmentFormData = z.infer<typeof segmentSchema>;

interface CreateSegmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSegmentInput) => void;
  isSubmitting?: boolean;
}

export function CreateSegmentModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateSegmentModalProps) {
  const [conjunction, setConjunction] = useState<"AND" | "OR">("AND");
  const [rules, setRules] = useState<SegmentRule[]>([
    {
      id: "rule-init-1",
      field: "score",
      operator: "greater_than",
      value: "80",
    },
    {
      id: "rule-init-2",
      field: "lifecycle_stage",
      operator: "equals",
      value: "qualified",
    },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SegmentFormData>({
    resolver: zodResolver(segmentSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleFormSubmit = (data: SegmentFormData) => {
    onSubmit({
      name: data.name,
      description: data.description,
      conjunction,
      rules,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Dynamic Segment"
      description="Build a real-time audience segment based on multi-condition logic and behavioral filters."
      size="xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Segment Name"
              placeholder="e.g. VIP Enterprise Buyers"
              error={errors.name?.message}
              {...register("name")}
            />
          </div>
          <div>
            <Textarea
              label="Description"
              placeholder="Targeting intent, campaign use-case..."
              rows={1}
              error={errors.description?.message}
              {...register("description")}
            />
          </div>
        </div>

        {/* Visual Rule Builder Component */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Targeting Rule Engine
          </label>
          <SegmentRuleBuilder
            conjunction={conjunction}
            rules={rules}
            onChangeConjunction={setConjunction}
            onChangeRules={setRules}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Save Dynamic Segment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
