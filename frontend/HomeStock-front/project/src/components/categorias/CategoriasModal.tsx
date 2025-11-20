import React from 'react';
import { Button } from '../ui/button';
import { X, Tags } from 'lucide-react';
import { CategoriaManager } from './CategoriaManager';

interface CategoriasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoriasModal: React.FC<CategoriasModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] mx-4 overflow-hidden">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Tags className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Gestión de Categorías
              </h2>
              <p className="text-sm text-gray-600">
                Administra las categorías para organizar tus productos
              </p>
            </div>
          </div>
          
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cerrar
          </Button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <CategoriaManager />
        </div>
      </div>
    </div>
  );
};