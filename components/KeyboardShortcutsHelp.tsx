import React from 'react';
import { Button } from './ui/Button';
import { KeyboardShortcut, getShortcutDisplay } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
  shortcuts
}) => {
  if (!isOpen) return null;

  // Group shortcuts by category
  const categorizedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col animate-scaleIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⌨️</span>
            <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {Object.entries(categorizedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">{category}</h3>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 bg-gray-750 rounded hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-gray-300 text-sm">{shortcut.description}</span>
                    <kbd className="px-3 py-1 bg-gray-900 border border-gray-600 rounded text-xs font-mono text-gray-300">
                      {getShortcutDisplay(shortcut)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-850 rounded-b-lg border-t border-gray-700 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            Press <kbd className="px-2 py-1 bg-gray-900 border border-gray-600 rounded text-xs font-mono">?</kbd> to toggle this help
          </p>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
