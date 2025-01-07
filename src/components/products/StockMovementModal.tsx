import React, { useState } from "react";
import { X } from "lucide-react";
import { StockMovement } from "../../types";

interface Props {
  productId: string;
  productName: string;
  currentStock: number;
  onClose: () => void;
  onSave: (movement: Omit<StockMovement, "id" | "createdAt">) => void;
}

export function StockMovementModal({
  productId,
  productName,
  currentStock,
  onClose,
  onSave,
}: Props) {
  const [type, setType] = useState<"in" | "out">("in");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState<StockMovement["reason"]>("purchase");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      productId,
      type,
      quantity,
      reason,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Movimentação de Estoque</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Produto: {productName}
          <br />
          Estoque atual: {currentStock}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={type === "in"}
                  onChange={() => setType("in")}
                  className="mr-2"
                />
                Entrada
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={type === "out"}
                  onChange={() => setType("out")}
                  className="mr-2"
                />
                Saída
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantidade</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Motivo</label>
            <select
              value={reason}
              onChange={(e) =>
                setReason(e.target.value as StockMovement["reason"])
              }
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="purchase">Compra</option>
              <option value="sale">Venda</option>
              <option value="loss">Perda</option>
              <option value="adjustment">Ajuste</option>
              <option value="return">Devolução</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Observações
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 order-1 sm:order-2"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
