import React from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
  icon?: React.ReactNode;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  icon
}) => {
  if (!isOpen) return null;

  const getConfirmButtonClass = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 animate-scaleIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-3">
          {icon && <div className="text-2xl">{icon}</div>}
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div className="text-gray-300 text-sm leading-relaxed">
            {message}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-850 rounded-b-lg flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant === 'danger' || confirmVariant === 'warning' ? 'secondary' : 'primary'}
            onClick={onConfirm}
            className={confirmVariant === 'danger' || confirmVariant === 'warning' ? getConfirmButtonClass() : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
