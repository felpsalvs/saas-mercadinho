import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="flex items-center gap-2 p-4 text-red-600 bg-red-50 rounded-lg">
      <AlertCircle size={20} />
      <span>{message}</span>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="ml-auto text-sm font-medium hover:text-red-700"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}