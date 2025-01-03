import React from 'react';
import { Trash2 } from 'lucide-react';
import { SaleItem } from '../../types';

interface CartProps {
  items: SaleItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Carrinho</h2>
      
      <div className="flex-1 overflow-auto">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 py-2 border-b">
            <div className="flex-1">
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-gray-500">
                R$ {item.price.toFixed(2)} {item.unit === 'kg' ? '/kg' : '/un'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(index, Number(e.target.value))}
                className="w-20 px-2 py-1 border rounded"
                min="0"
                step={item.unit === 'kg' ? '0.1' : '1'}
              />
              <span className="text-sm text-gray-500">{item.unit}</span>
            </div>
            
            <p className="w-24 text-right font-medium">
              R$ {item.total.toFixed(2)}
            </p>
            
            <button
              onClick={() => onRemoveItem(index)}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center text-xl font-semibold">
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        
        <button
          className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          onClick={() => {/* Implementar finalização */}}
        >
          Finalizar Venda
        </button>
      </div>
    </div>
  );
}