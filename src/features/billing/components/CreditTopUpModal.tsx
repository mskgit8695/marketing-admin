import { useState } from "react";
import {
  Sparkles,
  Mail,
  MessageSquare,
  Smartphone,
  CreditCard,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import type {
  CreditPack,
  PaymentMethod,
  CreditTopUpInput,
  CreditPackCategory,
} from "@/types/billing";
import { Modal, Button, Badge } from "@/components/ui";

interface CreditTopUpModalProps {
  packs: CreditPack[];
  paymentMethods: PaymentMethod[];
  isOpen: boolean;
  initialCategory?: CreditPackCategory;
  onClose: () => void;
  onPurchase: (input: CreditTopUpInput) => Promise<unknown>;
}

export function CreditTopUpModal({
  packs = [],
  paymentMethods = [],
  isOpen,
  initialCategory,
  onClose,
  onPurchase,
}: CreditTopUpModalProps) {
  const safePacks = packs || [];
  const safePaymentMethods = paymentMethods || [];

  const [selectedCategory, setSelectedCategory] = useState<"all" | CreditPackCategory>(
    initialCategory || "all"
  );
  const [selectedPackId, setSelectedPackId] = useState<string>(
    safePacks[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>(
    safePaymentMethods.find((p) => p.isDefault)?.id || safePaymentMethods[0]?.id || ""
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredPacks = safePacks.filter((p) => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const selectedPack = safePacks.find((p) => p.id === selectedPackId) || filteredPacks[0];

  const totalPrice = selectedPack ? selectedPack.price * quantity : 0;

  const handleConfirm = async () => {
    if (!selectedPack || !selectedPaymentMethodId) return;

    setIsProcessing(true);
    try {
      await onPurchase({
        packId: selectedPack.id,
        quantity,
        paymentMethodId: selectedPaymentMethodId,
      });
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryIcon = (cat: CreditPackCategory) => {
    switch (cat) {
      case "email":
        return <Mail className="w-4 h-4 text-sky-600" />;
      case "whatsapp":
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case "sms":
        return <Smartphone className="w-4 h-4 text-purple-600" />;
      case "ai":
        return <Sparkles className="w-4 h-4 text-amber-600" />;
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
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-semibold text-slate-900 leading-none">
              On-Demand Credit Allocator
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Add non-expiring delivery capacity and generative AI tokens
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
          {(["all", "whatsapp", "email", "sms", "ai"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                const firstMatching = packs.find((p) => cat === "all" || p.category === cat);
                if (firstMatching) setSelectedPackId(firstMatching.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {cat === "ai" ? "AI Tokens" : cat}
            </button>
          ))}
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
          {filteredPacks.map((pack) => {
            const isSelected = selectedPack?.id === pack.id;
            return (
              <div
                key={pack.id}
                onClick={() => setSelectedPackId(pack.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-indigo-50/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-2xs"
                    : "bg-white border-slate-200/90 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center">
                        {getCategoryIcon(pack.category)}
                      </div>
                      <span className="font-semibold text-xs text-slate-900">
                        {pack.name}
                      </span>
                    </div>

                    {pack.popular && (
                      <Badge variant="primary" size="sm">
                        Popular
                      </Badge>
                    )}
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500 line-clamp-2">
                    {pack.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    +{pack.amount.toLocaleString()} {pack.unitLabel}
                  </span>
                  <span className="text-sm font-extrabold text-indigo-600 font-mono">
                    ${pack.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quantity & Payment Selector */}
        {selectedPack && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 block">
                  Select Pack Quantity
                </span>
                <span className="text-[11px] text-slate-500">
                  Multiplier: {quantity}x ({selectedPack.amount * quantity} total)
                </span>
              </div>

              <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-slate-800 font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  disabled={quantity >= 20}
                  className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-700">
                Charge to Card
              </span>

              <select
                value={selectedPaymentMethodId}
                onChange={(e) => setSelectedPaymentMethodId(e.target.value)}
                className="text-xs font-mono py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              >
                {paymentMethods.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.brand.toUpperCase()} •••• {pm.last4} {pm.isDefault ? "(Default)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Total Amount
            </span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              disabled={isProcessing || !selectedPack}
              className="text-xs"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                  Authorize & Charge
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
