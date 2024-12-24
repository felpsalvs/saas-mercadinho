import React from 'react';
import { StockMovement } from '../../types';

interface Props {
  movements: StockMovement[];
}

const reasonLabels: Record<StockMovement['reason'], string> = {
  purchase: 'Compra',
  sale: 'Venda',
  loss: 'Perda',
  adjustment: 'Ajuste',
  return: 'Devolução'
};

export function StockHistory({ movements }: Props) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Histórico de Movimentações</h2>
      </div>
      <div className="overflow-auto max-h-[400px]">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4">Data</th>
              <th className="text-left p-4">Tipo</th>
              <th className="text-left p-4">Quantidade</th>
              <th className="text-left p-4">Motivo</th>
              <th className="text-left p-4">Observações</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id} className="border-t">
                <td className="p-4">
                  {movement.createdAt.toLocaleString()}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${movement.type === 'in' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {movement.type === 'in' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
                <td className="p-4">{movement.quantity}</td>
                <td className="p-4">{reasonLabels[movement.reason]}</td>
                <td className="p-4 text-gray-600">{movement.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}