import { CreditCard, Plus, Trash2, CheckCircle2 } from "lucide-react";
import type { PaymentMethod } from "@/types/billing";
import { Button, Badge } from "@/components/ui";

interface PaymentMethodsCardProps {
  paymentMethods: PaymentMethod[];
  onOpenAddModal: () => void;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
}

export function PaymentMethodsCard({
  paymentMethods,
  onOpenAddModal,
  onSetDefault,
  onRemove,
}: PaymentMethodsCardProps) {
  const getBrandBadge = (brand: string) => {
    switch (brand) {
      case "visa":
        return (
          <span className="font-extrabold text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            VISA
          </span>
        );
      case "mastercard":
        return (
          <span className="font-extrabold text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            MC
          </span>
        );
      case "amex":
        return (
          <span className="font-extrabold text-[11px] text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
            AMEX
          </span>
        );
      default:
        return (
          <span className="font-extrabold text-[11px] text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            CARD
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            Payment Methods
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cards used for subscription renewals, credit top-ups, and overages.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAddModal}
          className="text-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Payment Method
        </Button>
      </div>

      <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
        {(paymentMethods || []).map((pm) => (
          <div
            key={pm.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getBrandBadge(pm.brand)}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    •••• •••• •••• {pm.last4}
                  </span>
                  {pm.isDefault && (
                    <Badge variant="success" size="sm" dot>
                      Default
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span>Expires {String(pm.expiryMonth).padStart(2, "0")}/{pm.expiryYear}</span>
                  {pm.holderName && (
                    <>
                      <span>•</span>
                      <span>{pm.holderName}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {!pm.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-[11px] text-slate-600 hover:text-indigo-600"
                  onClick={() => onSetDefault(pm.id)}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Make Default
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                onClick={() => onRemove(pm.id)}
                disabled={pm.isDefault && paymentMethods.length > 1}
                title={
                  pm.isDefault && paymentMethods.length > 1
                    ? "Cannot remove default payment method"
                    : "Remove card"
                }
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
