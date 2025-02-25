import React, { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface ScaleInputProps {
  onWeightChange: (weight: number) => void;
  onError: (error: string) => void;
  productPrice?: number;
}

export function ScaleInput({ onWeightChange, onError, productPrice }: ScaleInputProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [weight, setWeight] = useState<number | null>(null);
  const [isReading, setIsReading] = useState(false);

  // Simula a conexão com a balança (substitua por sua implementação real)
  useEffect(() => {
    async function connectScale() {
      try {
        // Aqui você implementaria a conexão real com sua balança
        // Por exemplo, usando Serial Port API ou outro protocolo
        setIsConnected(true);
      } catch (error) {
        onError('Erro ao conectar com a balança');
        setIsConnected(false);
      }
    }

    connectScale();
  }, [onError]);

  const readWeight = async () => {
    if (!isConnected) {
      onError('Balança não conectada');
      return;
    }

    setIsReading(true);
    try {
      // Simula a leitura do peso (substitua pela implementação real)
      // Por exemplo, lendo dados da Serial Port
      const simulatedWeight = parseFloat((Math.random() * 10).toFixed(3));
      setWeight(simulatedWeight);
      onWeightChange(simulatedWeight);
    } catch (error) {
      onError('Erro ao ler o peso');
    } finally {
      setIsReading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Scale 
            className={`h-5 w-5 ${isConnected ? 'text-green-500' : 'text-red-500'}`} 
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isConnected ? 'Balança conectada' : 'Balança desconectada'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {weight !== null && (
            <>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Peso:</span>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {weight.toFixed(3)} kg
                </div>
              </div>

              {productPrice && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Valor:</span>
                  <div className="text-2xl font-bold text-green-500">
                    {formatCurrency(weight * productPrice)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <button
        onClick={readWeight}
        disabled={!isConnected || isReading}
        className={`px-4 py-2 rounded-lg font-medium transition-colors
          ${
            isConnected
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {isReading ? 'Lendo...' : 'Ler Peso'}
      </button>
    </div>
  );
}
