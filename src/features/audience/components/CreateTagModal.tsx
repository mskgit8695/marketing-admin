import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Input, Button } from "@/components/ui";
import type { CreateTagInput, TagCategory } from "@/services/api/tags.service";

const COLOR_PRESETS = [
  { name: "Indigo", hex: "#6366F1" },
  { name: "Purple", hex: "#8B5CF6" },
  { name: "Emerald", hex: "#10B981" },
  { name: "Amber", hex: "#F59E0B" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Cyan", hex: "#06B6D4" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Rose", hex: "#EF4444" },
  { name: "Teal", hex: "#14B8A6" },
  { name: "Orange", hex: "#F97316" },
];

const CATEGORIES: { label: string; value: TagCategory }[] = [
  { label: "Account Tier", value: "tier" },
  { label: "User Behavior", value: "behavior" },
  { label: "Purchase Intent", value: "intent" },
  { label: "Demographic", value: "demographic" },
];

const tagSchema = z.object({
  name: z.string().min(2, "Tag name must be at least 2 characters"),
  category: z.enum(["tier", "behavior", "intent", "demographic"] as const),
});

type TagFormData = z.infer<typeof tagSchema>;

interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTagInput) => void;
  isSubmitting?: boolean;
}

export function CreateTagModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateTagModalProps) {
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0].hex);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      category: "tier",
    },
  });

  const handleFormSubmit = (data: TagFormData) => {
    onSubmit({
      name: data.name,
      category: data.category,
      color: selectedColor,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Audience Tag"
      description="Categorize contacts and automate workflow routing using color-coded tags."
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
        <div>
          <Input
            label="Tag Name"
            placeholder="e.g. VIP Decision Maker"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Category
          </label>
          <select
            {...register("category")}
            className="w-full text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Color Accent
          </label>
          <div className="flex flex-wrap items-center gap-2.5">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color.hex}
                type="button"
                onClick={() => setSelectedColor(color.hex)}
                className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                  selectedColor === color.hex
                    ? "scale-125 ring-2 ring-offset-2 ring-primary dark:ring-offset-slate-900"
                    : "hover:scale-110"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Live Tag Preview */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-500">Preview:</span>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-2xs"
            style={{ backgroundColor: selectedColor }}
          >
            Sample Tag
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Create Tag
          </Button>
        </div>
      </form>
    </Modal>
  );
}
