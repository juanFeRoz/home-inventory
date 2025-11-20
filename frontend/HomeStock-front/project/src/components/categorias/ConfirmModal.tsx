import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <p className="text-sm text-gray-600">
            {message}
          </p>
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-white text-red-600 border border-red-300 hover:bg-red-50"
            >
              {isLoading ? 'Eliminando...' : confirmText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};