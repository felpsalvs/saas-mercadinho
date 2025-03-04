import React from "react";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, QrCode, DollarSign } from "lucide-react";
import { cn } from "../../lib/utils";
import { formatCurrency } from "../../utils/format";
import type { CartItem, PaymentMethod } from "../../types";

interface CartProps {
  items: CartItem[];
  payments: Array<{ method: string; amount: number }>;
  onRemoveItem: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onAddPayment: (payment: { method: string; amount: number }) => void;
  onRemovePayment: (index: number) => void;
  onFinishSale: () => void;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "cash", name: "Dinheiro (F10)", fee: 0, icon: Banknote },
  { id: "pix", name: "PIX (F11)", fee: 0.01, icon: QrCode },
  { id: "credit", name: "Crédito (F12)", fee: 0.03, icon: CreditCard },
  { id: "debit", name: "Débito (Shift+F12)", fee: 0.02, icon: DollarSign },
];

export function Cart({
  items,
  payments,
  onRemoveItem,
  onQuantityChange,
  onAddPayment,
  onRemovePayment,
  onFinishSale,
}: CartProps) {
  const [paymentAmounts, setPaymentAmounts] = React.useState<Record<string, string>>({});

  // Cálculos
  const subtotal = items.reduce((sum, item) => {
    // Calcular o total do item se não estiver definido
    const itemTotal = item.total !== undefined ? item.total : item.price * item.quantity;
    return sum + itemTotal;
  }, 0);
  const fees = payments.reduce((sum, payment) => {
    const paymentMethod = PAYMENT_METHODS.find((p) => p.id === payment.method);
    return sum + payment.amount * (paymentMethod?.fee || 0);
  }, 0);
  const total = subtotal + fees;
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = total - totalPaid;
  const canFinishSale = items.length > 0 && remainingAmount <= 0;

  const handlePaymentChange = (methodId: string, value: string) => {
    setPaymentAmounts((prev) => ({ ...prev, [methodId]: value }));
  };

  const handleAddPayment = (methodId: string) => {
    const amount = parseFloat(paymentAmounts[methodId] || "0");
    if (isNaN(amount) || amount <= 0) return;

    onAddPayment({ method: methodId, amount });
    setPaymentAmounts((prev) => ({ ...prev, [methodId]: "" }));
  };

  // Função para renderizar o ícone do método de pagamento
  const renderPaymentIcon = (methodId: string) => {
    const method = PAYMENT_METHODS.find(m => m.id === methodId);
    if (!method || !method.icon) return null;
    
    const Icon = method.icon;
    return <Icon className="h-5 w-5 mr-2" />;
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-lg overflow-hidden transition-all duration-200",
        "bg-surface-light dark:bg-surface-dark",
        "border border-border-light dark:border-border-dark",
        "shadow-md-light dark:shadow-md-dark"
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
        <h2 className="text-pdv-lg font-semibold text-text-light-primary dark:text-text-dark-primary flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2" />
          Carrinho de Compras
        </h2>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-light-tertiary dark:text-text-dark-tertiary">
            <ShoppingCart className="h-16 w-16 mb-4" />
            <p className="text-pdv-lg">Carrinho vazio</p>
            <p className="text-pdv-sm mt-2">Pressione F6 para selecionar produtos</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li
                key={item.productId}
                className={cn(
                  "p-3 rounded-lg",
                  "bg-background-light dark:bg-background-dark",
                  "border border-border-light dark:border-border-dark"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-pdv-base text-text-light-primary dark:text-text-dark-primary">
                    {item.name}
                  </h3>
                  <button
                    onClick={() => onRemoveItem(item.productId)}
                    className="text-pdv-error hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1"
                    title="Remover item (Delete)"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onQuantityChange(
                          item.productId,
                          item.quantity - ((item.unit === "kg") ? 0.1 : 1)
                        )
                      }
                      disabled={item.quantity <= ((item.unit === "kg") ? 0.1 : 1)}
                      className={cn(
                        "p-2 rounded transition-colors",
                        "hover:bg-hover-light dark:hover:bg-hover-dark",
                        "text-text-light-secondary dark:text-text-dark-secondary",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      title="Diminuir quantidade (-)"
                    >
                      <Minus className="h-5 w-5" />
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
                        "w-20 text-center rounded-lg text-pdv-base py-2",
                        "bg-surface-light dark:bg-surface-dark",
                        "border border-border-light dark:border-border-dark",
                        "text-text-light-primary dark:text-text-dark-primary",
                        "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      )}
                      aria-label={`Quantidade de ${item.name}`}
                    />

                    <button
                      onClick={() =>
                        onQuantityChange(
                          item.productId,
                          item.quantity + ((item.unit === "kg") ? 0.1 : 1)
                        )
                      }
                      className={cn(
                        "p-2 rounded transition-colors",
                        "hover:bg-hover-light dark:hover:bg-hover-dark",
                        "text-text-light-secondary dark:text-text-dark-secondary"
                      )}
                      title="Aumentar quantidade (+)"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-pdv-sm text-text-light-secondary dark:text-text-dark-secondary">
                      {formatCurrency(item.price)} / {item.unit || 'unit'}
                    </div>
                    <div className="font-medium text-pdv-base text-text-light-primary dark:text-text-dark-primary">
                      {formatCurrency(item.total !== undefined ? item.total : item.price * item.quantity)}
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
          <h3 className="font-medium mb-3 text-pdv-lg text-text-light-primary dark:text-text-dark-primary">
            Formas de Pagamento
          </h3>
          
          {/* Métodos de pagamento disponíveis */}
          <div className="space-y-2 mb-4">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  "bg-background-light dark:bg-background-dark",
                  "border border-border-light dark:border-border-dark"
                )}
              >
                <div className="flex items-center">
                  {method.icon && <method.icon className="h-5 w-5 mr-2" />}
                  <span className="text-pdv-base text-text-light-primary dark:text-text-dark-primary">
                    {method.name}
                  </span>
                  <span className="ml-2 text-pdv-xs text-text-light-tertiary dark:text-text-dark-tertiary">
                    (Taxa: {(method.fee * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={paymentAmounts[method.id] || ""}
                    onChange={(e) =>
                      handlePaymentChange(method.id, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddPayment(method.id);
                      }
                    }}
                    className={cn(
                      "w-32 px-3 py-2 rounded-lg text-pdv-base",
                      "bg-surface-light dark:bg-surface-dark",
                      "border border-border-light dark:border-border-dark",
                      "text-text-light-primary dark:text-text-dark-primary",
                      "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    )}
                    placeholder="0,00"
                  />
                  <button
                    onClick={() => handleAddPayment(method.id)}
                    className={cn(
                      "ml-2 px-3 py-2 rounded-lg",
                      "bg-primary-500 text-white",
                      "hover:bg-primary-600",
                      "transition-colors duration-200"
                    )}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagamentos adicionados */}
          {payments.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2 text-pdv-base text-text-light-primary dark:text-text-dark-primary">
                Pagamentos Adicionados
              </h4>
              <ul className="space-y-2">
                {payments.map((payment, index) => {
                  const method = PAYMENT_METHODS.find(m => m.id === payment.method);
                  return (
                    <li
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-2 rounded",
                        "bg-background-light dark:bg-background-dark",
                        "border border-border-light dark:border-border-dark"
                      )}
                    >
                      <div className="flex items-center">
                        {renderPaymentIcon(payment.method)}
                        <span className="text-pdv-sm">
                          {method?.name.split(' ')[0] || payment.method}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-pdv-base font-medium mr-2">
                          {formatCurrency(payment.amount)}
                        </span>
                        <button
                          onClick={() => onRemovePayment(index)}
                          className="text-pdv-error hover:text-red-600 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="p-4 border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
        <div className="space-y-2">
          <div className="flex justify-between text-pdv-base text-text-light-secondary dark:text-text-dark-secondary">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-pdv-base text-text-light-secondary dark:text-text-dark-secondary">
            <span>Taxas</span>
            <span>{formatCurrency(fees)}</span>
          </div>
          <div className="flex justify-between text-pdv-xl font-semibold text-text-light-primary dark:text-text-dark-primary">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-pdv-base text-text-light-secondary dark:text-text-dark-secondary">
            <span>Pago</span>
            <span>{formatCurrency(totalPaid)}</span>
          </div>
          {remainingAmount > 0 && (
            <div className="flex justify-between text-pdv-error dark:text-red-400 font-medium text-pdv-base">
              <span>Falta</span>
              <span>{formatCurrency(remainingAmount)}</span>
            </div>
          )}
          {remainingAmount < 0 && (
            <div className="flex justify-between text-pdv-success dark:text-green-400 font-medium text-pdv-base">
              <span>Troco</span>
              <span>{formatCurrency(Math.abs(remainingAmount))}</span>
            </div>
          )}
        </div>

        <button
          onClick={onFinishSale}
          disabled={!canFinishSale}
          className={cn(
            "w-full mt-4 py-3 px-4 rounded-lg font-medium text-pdv-lg transition-all duration-200",
            canFinishSale
              ? "bg-pdv-success text-white hover:bg-green-600 shadow-md hover:shadow-lg"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          )}
        >
          Finalizar Venda (F8)
        </button>
      </div>
    </div>
  );
}
