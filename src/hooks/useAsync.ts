import { useState, useCallback } from 'react';
import { useUIStore } from '../stores';

interface UseAsyncOptions {
  showLoader?: boolean;
  showError?: boolean;
  showSuccess?: boolean;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const {
    showLoader = true,
    showError = true,
    showSuccess = false
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const { setLoading: setUILoading, addNotification } = useUIStore();

  const execute = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      if (showLoader) setUILoading(true);

      const result = await asyncFunction();
      setData(result);

      if (showSuccess) {
        addNotification('Operação realizada com sucesso!');
      }

      return result;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro';
      setError(errorMessage);
      if (showError) {
        addNotification(`Erro: ${errorMessage}`);
      }
      throw e;
    } finally {
      setLoading(false);
      if (showLoader) setUILoading(false);
    }
  }, [asyncFunction, showLoader, showError, showSuccess]);

  return { execute, loading, error, data };
} 