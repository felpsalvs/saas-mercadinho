import { useEffect, useRef } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface ShortcutMap {
  [key: string]: {
    handler: KeyHandler;
    description: string;
    scope?: string;
  };
}

interface UseKeyboardShortcutsOptions {
  scope?: string;
  preventDefault?: boolean;
}

/**
 * Hook para gerenciar atalhos de teclado no sistema PDV
 * 
 * @param shortcuts Mapa de atalhos de teclado
 * @param options Opções adicionais
 * @returns Objeto com funções para gerenciar os atalhos
 */
export function useKeyboardShortcuts(
  shortcuts: ShortcutMap,
  options: UseKeyboardShortcutsOptions = {}
) {
  const { scope = 'global', preventDefault = true } = options;
  const shortcutsRef = useRef<ShortcutMap>(shortcuts);

  // Atualiza a referência quando os atalhos mudam
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  // Configura os event listeners
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignora eventos em campos de entrada
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Constrói a string de tecla (ex: "Shift+F1")
      let keyString = '';
      if (event.ctrlKey) keyString += 'Ctrl+';
      if (event.altKey) keyString += 'Alt+';
      if (event.shiftKey) keyString += 'Shift+';
      if (event.metaKey) keyString += 'Meta+';
      
      // Adiciona a tecla principal
      keyString += event.key.toUpperCase();

      // Verifica se existe um handler para esta tecla
      const shortcut = shortcutsRef.current[keyString];
      if (shortcut && (!shortcut.scope || shortcut.scope === scope)) {
        if (preventDefault) {
          event.preventDefault();
        }
        shortcut.handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scope, preventDefault]);

  // Retorna a lista de atalhos disponíveis para exibição na UI
  const getShortcutsList = () => {
    return Object.entries(shortcutsRef.current).map(([key, { description, scope: shortcutScope }]) => ({
      key,
      description,
      scope: shortcutScope || 'global',
    }));
  };

  return {
    getShortcutsList,
  };
}
