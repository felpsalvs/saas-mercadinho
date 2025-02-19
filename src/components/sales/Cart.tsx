import React from "react";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { cn } from "../../lib/utils";
import { formatCurrency } from "../../utils/format";
import type { CartItem, PaymentMethod } from "../../types";

interface CartProps {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onFinishSale: () => void;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "cash", name: "Dinheiro", fee: 0 },
  { id: "pix", name: "PIX", fee: 0.01 },
  { id: "credit", name: "Crédito", fee: 0.03 },
  { id: "debit", name: "Débito", fee: 0.02 },
];

export function Cart({
  items,
  onRemoveItem,
  onQuantityChange,
  onFinishSale,
}: CartProps) {
  const [payments, setPayments] = React.useState<Record<string, number>>({});

  // Cálculos
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const fees = Object.entries(payments).reduce((sum, [method, amount]) => {
    const paymentMethod = PAYMENT_METHODS.find((p) => p.id === method);
    return sum + amount * (paymentMethod?.fee || 0);
  }, 0);
  const total = subtotal + fees;
  const totalPaid = Object.values(payments).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const remainingAmount = total - totalPaid;
  const canFinishSale = items.length > 0 && remainingAmount <= 0;

  const handlePaymentChange = (methodId: string, amount: number) => {
    if (isNaN(amount) || amount < 0) return;
    setPayments((prev) => ({ ...prev, [methodId]: amount }));
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-lg overflow-hidden transition-all duration-200",
        "bg-surface-light dark:bg-surface-dark",
        "border border-border-light dark:border-border-dark",
        "shadow-md-light dark:shadow-md-dark hover:shadow-lg-light dark:hover:shadow-lg-dark"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "p-4 border-b",
          "border-border-light dark:border-border-dark",
          "bg-background-light dark:bg-background-dark"
        )}
      >
        <h2 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">
          Carrinho de Compras
        </h2>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-light-tertiary dark:text-text-dark-tertiary">
            <ShoppingCart className="h-12 w-12 mb-2" />
            <p>Carrinho vazio</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.productId}
                className={cn(
                  "p-3 rounded-lg",
                  "bg-background-light dark:bg-background-dark",
                  "border border-border-light dark:border-border-dark"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-text-light-primary dark:text-text-dark-primary">
                    {item.productName}
                  </h3>
                  <button
                    onClick={() => onRemoveItem(item.productId)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onQuantityChange(
                          item.productId,
                          item.quantity - (item.unit === "kg" ? 0.1 : 1)
                        )
                      }
                      disabled={item.quantity <= (item.unit === "kg" ? 0.1 : 1)}
                      className={cn(
                        "p-1 rounded transition-colors",
                        "hover:bg-hover-light dark:hover:bg-hover-dark",
                        "text-text-light-secondary dark:text-text-dark-secondary",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        onQuantityChange(
                          item.productId,
                          parseFloat(e.target.value)
                        )
                      }
                      step={item.unit === "kg" ? "0.1" : "1"}
                      min={item.unit === "kg" ? "0.1" : "1"}
                      className={cn(
                        "w-16 text-center rounded-lg",
                        "bg-surface-light dark:bg-surface-dark",
                        "border border-border-light dark:border-border-dark",
                        "text-text-light-primary dark:text-text-dark-primary",
                        "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      )}
                    />

                    <button
                      onClick={() =>
                        onQuantityChange(
                          item.productId,
                          item.quantity + (item.unit === "kg" ? 0.1 : 1)
                        )
                      }
                      className={cn(
                        "p-1 rounded transition-colors",
                        "hover:bg-hover-light dark:hover:bg-hover-dark",
                        "text-text-light-secondary dark:text-text-dark-secondary"
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      {formatCurrency(item.price)} / {item.unit}
                    </div>
                    <div className="font-medium text-text-light-primary dark:text-text-dark-primary">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Payment Methods */}
      {items.length > 0 && (
        <div className="p-4 border-t border-border-light dark:border-border-dark">
          <h3 className="font-medium mb-3 text-text-light-primary dark:text-text-dark-primary">
            Formas de Pagamento
          </h3>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  "bg-background-light dark:bg-background-dark",
                  "border border-border-light dark:border-border-dark"
                )}
              >
                <div>
                  <span className="text-text-light-primary dark:text-text-dark-primary">
                    {method.name}
                  </span>
                  <span className="ml-2 text-sm text-text-light-tertiary dark:text-text-dark-tertiary">
                    (Taxa: {(method.fee * 100).toFixed(1)}%)
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={payments[method.id] || ""}
                  onChange={(e) =>
                    handlePaymentChange(method.id, parseFloat(e.target.value))
                  }
                  className={cn(
                    "w-32 px-3 py-1 rounded-lg",
                    "bg-surface-light dark:bg-surface-dark",
                    "border border-border-light dark:border-border-dark",
                    "text-text-light-primary dark:text-text-dark-primary",
                    "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  )}
                  placeholder="0,00"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="p-4 border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
        <div className="space-y-2">
          <div className="flex justify-between text-text-light-secondary dark:text-text-dark-secondary">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-text-light-secondary dark:text-text-dark-secondary">
            <span>Taxas</span>
            <span>{formatCurrency(fees)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-text-light-secondary dark:text-text-dark-secondary">
            <span>Pago</span>
            <span>{formatCurrency(totalPaid)}</span>
          </div>
          {remainingAmount > 0 && (
            <div className="flex justify-between text-red-500 dark:text-red-400 font-medium">
              <span>Falta</span>
              <span>{formatCurrency(remainingAmount)}</span>
            </div>
          )}
        </div>

        <button
          onClick={onFinishSale}
          disabled={!canFinishSale}
          className={cn(
            "w-full mt-4 py-3 px-4 rounded-lg font-medium transition-all duration-200",
            canFinishSale
              ? "bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg"
              : "bg-gray-100 dark:bg-gray-800 text-text-light-disabled dark:text-text-dark-disabled cursor-not-allowed"
          )}
        >
          {remainingAmount > 0
            ? `Falta ${formatCurrency(remainingAmount)}`
            : items.length === 0
            ? "Carrinho vazio"
            : "Finalizar Venda"}
        </button>
      </div>
    </div>
  );
}
