import React from 'react';
import { Keyboard } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
}

interface Props {
  shortcuts: Shortcut[];
}

export function ShortcutsHelp({ shortcuts }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
        title="Atalhos de Teclado"
      >
        <Keyboard size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Atalhos de Teclado</h2>
            
            <div className="space-y-2">
              {shortcuts.map(({ key, description }) => (
                <div key={key} className="flex items-center gap-3">
                  <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                    {key.toUpperCase()}
                  </kbd>
                  <span>{description}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}