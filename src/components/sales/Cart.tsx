import React from "react";
import { Trash2, AlertCircle } from "lucide-react";
import { SaleItem } from "../../types";
import { formatCurrency } from "../../utils/format";

interface CartProps {
  items: SaleItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onFinalize: () => void;
  error?: string | null;
  isProcessing?: boolean;
}

export function Cart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onFinalize,
  error,
  isProcessing = false,
}: CartProps) {
  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Cabeçalho */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Carrinho
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {items.length} {items.length === 1 ? "item" : "itens"}
          </span>
        </div>

        {error && (
          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      {/* Lista de Itens */}
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            Carrinho vazio
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.productName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(item.price)} {item.unit === "kg" ? "/kg" : "/un"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateQuantity(index, Number(e.target.value))
                      }
                      className="w-16 h-8 text-center border-y dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      min="0"
                      step={item.unit === "kg" ? "0.1" : "1"}
                    />
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(index)}
                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    title="Remover item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-2 text-right font-medium text-gray-900 dark:text-white">
                {formatCurrency(item.total)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer com Total e Botão de Finalizar */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex justify-between items-center text-lg font-semibold text-gray-900 dark:text-white mb-4">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>

        <button
          className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={onFinalize}
          disabled={items.length === 0 || isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processando...
            </span>
          ) : (
            "Finalizar Venda"
          )}
        </button>
      </div>
    </div>
  );
}
