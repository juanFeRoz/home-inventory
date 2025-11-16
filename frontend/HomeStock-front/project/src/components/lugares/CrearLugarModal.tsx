import React, { useState } from 'react';
import { lugarService } from '../../services/lugarService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, MapPin, Loader } from 'lucide-react';

interface CrearLugarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  grupoFamiliarId: string;
  userId: string;
}

export const CrearLugarModal: React.FC<CrearLugarModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  grupoFamiliarId,
  userId,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setError('El nombre del lugar es requerido');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await lugarService.crearLugar(
        formData.nombre.trim(),
        formData.descripcion.trim(),
        grupoFamiliarId,
        userId
      );

      // Limpiar formulario
      setFormData({ nombre: '', descripcion: '' });
      onSuccess();
    } catch (error: any) {
      console.error('Error creando lugar:', error);
      setError(error.message || 'Error al crear el lugar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ nombre: '', descripcion: '' });
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Lugar</h2>
          </div>
          <Button
            onClick={handleClose}
            variant="outline"
            size="sm"
            className="p-2"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Lugar *
              </label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Cocina, Despensa, Refrigerador..."
                disabled={isLoading}
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (Opcional)
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Describe el lugar o qué tipo de productos se almacenan aquí..."
                disabled={isLoading}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading || !formData.nombre.trim()}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                'Crear Lugar'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};