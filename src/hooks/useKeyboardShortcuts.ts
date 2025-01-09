import { useEffect } from "react";

type ShortcutHandler = () => void;

interface ShortcutMap {
  [key: string]: {
    handler: ShortcutHandler;
    description: string;
  };
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Ignora atalhos quando estiver em campos de input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const shortcut = shortcuts[key];

      if (shortcut) {
        event.preventDefault();
        shortcut.handler();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);

  return Object.entries(shortcuts).map(([key, { description }]) => ({
    key,
    description,
  }));
}
