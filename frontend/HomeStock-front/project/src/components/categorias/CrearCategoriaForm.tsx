import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { CrearCategoriaRequest } from '../../types/categoria';

interface CrearCategoriaFormProps {
  onSubmit: (data: CrearCategoriaRequest) => Promise<void>;
  isLoading?: boolean;
}

export const CrearCategoriaForm: React.FC<CrearCategoriaFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await onSubmit({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
      });
      
      // Limpiar formulario después del éxito
      setFormData({ nombre: '', descripcion: '' });
    } catch (error) {
      // El error será manejado por el componente padre
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Crear Nueva Categoría</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Ej: Lácteos, Carnes, Verduras..."
            className={errors.nombre ? 'border-red-500' : ''}
            disabled={submitting || isLoading}
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Descripción opcional de la categoría..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            disabled={submitting || isLoading}
          />
        </div>

        <Button
          type="submit"
          disabled={submitting || isLoading}
          className="w-full bg-purple-600 text-white border border-purple-600 hover:bg-purple-700 rounded-lg"
        >
          {submitting ? 'Creando...' : 'Crear Categoría'}
        </Button>
      </form>
    </Card>
  );
};