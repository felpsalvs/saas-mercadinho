import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ShortcutInfo {
  key: string;
  description: string;
  scope: string;
}

interface KeyboardShortcutsHelpProps {
  shortcuts: ShortcutInfo[];
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({
  shortcuts,
  isOpen,
  onClose,
}: KeyboardShortcutsHelpProps) {
  if (!isOpen) return null;

  // Agrupa os atalhos por escopo
  const shortcutsByScope = shortcuts.reduce<Record<string, ShortcutInfo[]>>(
    (acc, shortcut) => {
      if (!acc[shortcut.scope]) {
        acc[shortcut.scope] = [];
      }
      acc[shortcut.scope].push(shortcut);
      return acc;
    },
    {}
  );

  // Renderiza uma tecla individual
  const renderKey = (keyText: string) => {
    const keys = keyText.split('+');
    return (
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <kbd
              className={cn(
                "px-2 py-1 text-pdv-xs font-mono font-bold rounded",
                "bg-gray-200 dark:bg-gray-700",
                "border border-gray-300 dark:border-gray-600",
                "text-gray-800 dark:text-gray-200",
                "shadow-sm"
              )}
            >
              {key}
            </kbd>
            {index < keys.length - 1 && <span>+</span>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={cn(
          "w-full max-w-3xl max-h-[80vh] overflow-auto rounded-lg p-6",
          "bg-surface-light dark:bg-surface-dark",
          "border border-border-light dark:border-border-dark",
          "shadow-lg"
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-pdv-xl font-bold text-text-light-primary dark:text-text-dark-primary">
            Atalhos de Teclado
          </h2>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-full",
              "hover:bg-hover-light dark:hover:bg-hover-dark",
              "text-text-light-secondary dark:text-text-dark-secondary"
            )}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(shortcutsByScope).map(([scope, scopeShortcuts]) => (
            <div key={scope}>
              <h3 className="text-pdv-lg font-semibold mb-3 text-text-light-primary dark:text-text-dark-primary capitalize">
                {scope}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scopeShortcuts.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className={cn(
                      "flex items-center justify-between p-3 rounded",
                      "bg-background-light dark:bg-background-dark",
                      "border border-border-light dark:border-border-dark"
                    )}
                  >
                    <span className="text-pdv-base text-text-light-primary dark:text-text-dark-primary">
                      {shortcut.description}
                    </span>
                    {renderKey(shortcut.key)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark text-center">
          <p className="text-pdv-sm text-text-light-secondary dark:text-text-dark-secondary">
            Pressione <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">?</kbd> a qualquer momento para ver esta ajuda
          </p>
        </div>
      </div>
    </div>
  );
} 