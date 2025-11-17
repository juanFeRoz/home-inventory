import React, { useState, useEffect } from 'react';
import { CrearProductoRequest } from '../../services/productoService';
import { Button } from '../ui/button';
import { X, Package, AlertCircle, Loader, Calendar, Hash, FileText } from 'lucide-react';

interface CrearProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lugarId: string;
  lugarNombre: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onCrearProducto: (lugarId: string, productoData: CrearProductoRequest) => Promise<void>;
}

interface FormData {
  nombre: string;
  descripcion: string;
  cantidad: string;
  cantidadMinima: string;
  expiracion: string;
}

const initialFormData: FormData = {
  nombre: '',
  descripcion: '',
  cantidad: '0',
  cantidadMinima: '0',
  expiracion: '',
};

export const CrearProductoModal: React.FC<CrearProductoModalProps> = ({
  isOpen,
  onClose,
  lugarId,
  lugarNombre,
  onSuccess,
  onError,
  onCrearProducto,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Limpiar formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Validar nombre (requerido)
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del producto es requerido';
    }

    // Validar cantidad (debe ser número válido)
    const cantidad = parseInt(formData.cantidad);
    if (isNaN(cantidad) || cantidad < 0) {
      newErrors.cantidad = 'La cantidad debe ser un número válido mayor o igual a 0';
    }

    // Validar cantidad mínima (debe ser número válido)
    const cantidadMinima = parseInt(formData.cantidadMinima);
    if (isNaN(cantidadMinima) || cantidadMinima < 0) {
      newErrors.cantidadMinima = 'La cantidad mínima debe ser un número válido mayor o igual a 0';
    }

    // Validar que cantidad >= cantidadMinima
    if (!isNaN(cantidad) && !isNaN(cantidadMinima) && cantidad < cantidadMinima) {
      newErrors.cantidad = 'La cantidad debe ser mayor o igual a la cantidad mínima';
    }

    // Validar fecha (opcional, pero si se proporciona debe ser válida)
    if (formData.expiracion) {
      const fecha = new Date(formData.expiracion);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (isNaN(fecha.getTime())) {
        newErrors.expiracion = 'La fecha de expiración no es válida';
      } else if (fecha < hoy) {
        newErrors.expiracion = 'La fecha de expiración no puede ser anterior a hoy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empieza a corregir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const productoData: CrearProductoRequest = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        cantidad: formData.cantidad || undefined,
        cantidadMinima: formData.cantidadMinima || undefined,
        expiracion: formData.expiracion || undefined,
      };

      await onCrearProducto(lugarId, productoData);
      
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Error creando producto:', error);
      onError(error.message || 'Error al crear el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData(initialFormData);
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Crear Producto</h2>
              <p className="text-sm text-gray-600">En {lugarNombre}</p>
            </div>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Nombre del producto *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Arroz blanco"
              disabled={isLoading}
              required
            />
            {errors.nombre && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Descripción adicional del producto..."
              rows={2}
              disabled={isLoading}
            />
          </div>

          {/* Cantidad y Cantidad Mínima */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Cantidad
              </label>
              <input
                type="number"
                min="0"
                value={formData.cantidad}
                onChange={(e) => handleInputChange('cantidad', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.cantidad ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                disabled={isLoading}
              />
              {errors.cantidad && (
                <p className="text-red-600 text-xs mt-1">{errors.cantidad}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad mínima
              </label>
              <input
                type="number"
                min="0"
                value={formData.cantidadMinima}
                onChange={(e) => handleInputChange('cantidadMinima', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.cantidadMinima ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                disabled={isLoading}
              />
              {errors.cantidadMinima && (
                <p className="text-red-600 text-xs mt-1">{errors.cantidadMinima}</p>
              )}
            </div>
          </div>

          {/* Fecha de expiración */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha de expiración (opcional)
            </label>
            <input
              type="date"
              value={formData.expiracion}
              onChange={(e) => handleInputChange('expiracion', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.expiracion ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
              min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
            />
            {errors.expiracion && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.expiracion}
              </p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Crear Producto
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};